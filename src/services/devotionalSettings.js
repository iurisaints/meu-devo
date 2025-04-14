// src/services/devotionalService.js
import { firestore, auth } from '../config/firebaseConfig';
import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    setDoc, // Usar setDoc com merge:true ou updateDoc
    updateDoc,
    Timestamp // Importar Timestamp para datas
} from 'firebase/firestore';

// Função auxiliar para obter a data atual como YYYY-MM-DD (ou usar Timestamp)
function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses são 0-indexados
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    // Alternativa: retornar Timestamp.now() se preferir comparar Timestamps
}

// Função para atualizar (ou criar) o streak do usuário
const updateUserStreak = async (userId) => {
    const today = Timestamp.now().toDate(); // Data atual como objeto Date
    const userDocRef = doc(firestore, 'users', userId);

    try {
        const userDocSnap = await getDoc(userDocRef);
        let currentStreak = 0;
        let lastDate = null;

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            currentStreak = userData.streakCount || 0;
            // Garante que lastDevotionalDate é um objeto Date do JS para comparação
            if (userData.lastDevotionalDate && userData.lastDevotionalDate.toDate) {
                 lastDate = userData.lastDevotionalDate.toDate();
            }
            console.log("Dados atuais do usuário:", { currentStreak, lastDate });

        } else {
             // Usuário não existe na coleção 'users', pode ser o primeiro devocional
             // Criaremos o documento ao final se não existir
             console.log("Documento do usuário não encontrado, será criado/atualizado.");
        }

        let newStreak = currentStreak;
        let updateData = {};

        if (lastDate) {
            const lastDevotionalDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
            const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const yesterdayDay = new Date(todayDay);
            yesterdayDay.setDate(todayDay.getDate() - 1);

            console.log("Comparando datas:", { lastDevotionalDay, todayDay, yesterdayDay });

            if (lastDevotionalDay.getTime() === todayDay.getTime()) {
                // Já fez devocional hoje, não muda o streak
                 console.log("Devocional já registrado hoje. Streak mantido.");
                newStreak = currentStreak; // Mantém o streak
                // Não precisamos atualizar a data se já for hoje
                updateData = { streakCount: newStreak }; // Apenas garante que o streak está correto

            } else if (lastDevotionalDay.getTime() === yesterdayDay.getTime()) {
                // Fez ontem, incrementa streak
                console.log("Devocional feito ontem. Incrementando streak.");
                newStreak = currentStreak + 1;
                updateData = { streakCount: newStreak, lastDevotionalDate: Timestamp.now() }; // Atualiza data e streak
            } else {
                // Não fez ontem (ou antes), reseta streak para 1
                console.log("Intervalo maior que um dia. Resetando streak para 1.");
                newStreak = 1;
                 updateData = { streakCount: newStreak, lastDevotionalDate: Timestamp.now() };// Atualiza data e streak
            }
        } else {
            // Primeiro devocional do usuário
            console.log("Primeiro devocional registrado. Streak = 1.");
            newStreak = 1;
             updateData = { streakCount: newStreak, lastDevotionalDate: Timestamp.now() }; // Define data e streak
        }

        // Atualiza ou cria o documento do usuário
        // Usar setDoc com merge: true é seguro para criar ou atualizar parcialmente
        console.log("Atualizando/Criando documento do usuário com:", updateData);
        await setDoc(userDocRef, updateData, { merge: true });

        // Se for a primeira vez e precisar de outros campos (como email), adicione-os aqui:
         if (!userDocSnap.exists()) {
             await updateDoc(userDocRef, {
                 email: auth.currentUser?.email, // Pega email do Auth
                 createdAt: serverTimestamp() // Data de criação do perfil no DB
             });
         }


    } catch (error) {
        console.error("Erro ao atualizar streak do usuário:", error);
        // Não lançar erro aqui para não impedir o salvamento do devocional principal,
        // mas logar ou usar um sistema de monitoramento é importante.
    }
};


// Função principal para salvar o devocional
export const saveDevotional = async (devotionalData) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("Usuário não autenticado.");
    }

    const userId = user.uid;

    // Prepara o objeto completo para salvar
    const dataToSave = {
        ...devotionalData,
        userId: userId,
        userEmail: user.email, // Salvar email para facilitar exibição inicial no feed
        createdAt: serverTimestamp(), // Usa o timestamp do servidor Firestore
        visibility: 'public' // MVP: todos públicos inicialmente
    };

    try {
        // Adiciona o documento à coleção 'devotionals'
        const docRef = await addDoc(collection(firestore, 'devotionals'), dataToSave);
        console.log("Devocional salvo com ID: ", docRef.id);

        // Após salvar com sucesso, atualiza o streak
        await updateUserStreak(userId);

        return docRef; // Retorna a referência do documento salvo
    } catch (error) {
        console.error("Erro ao adicionar documento: ", error);
        throw error; // Re-lança o erro para ser tratado na tela
    }
};

// Função para buscar devocionais (será usada na HomeScreen)
// (Implementação no próximo passo)