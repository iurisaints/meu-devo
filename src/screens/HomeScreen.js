// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { logoutUser } from '../services/authService';
import { auth, firestore } from '../config/firebaseConfig';
import { collection, query, orderBy, limit, onSnapshot, getDoc, doc } from 'firebase/firestore'; // Importar onSnapshot, getDoc, doc

// Componente simples para renderizar cada item do feed
const DevotionalItem = ({ item }) => (
    <View style={styles.devotionalItem}>
        <Text style={styles.itemUser}>{item.userEmail || item.userId}</Text>
        <Text style={styles.itemDate}>
            {item.createdAt?.toDate().toLocaleDateString('pt-BR', {hour: '2-digit', minute: '2-digit'}) ?? 'Data indisponível'}
        </Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemMeta}>
            Versículos: {item.versesRead ?? '?'} | Tempo: {item.timeSpentMinutes ?? '?'} min
        </Text>
    </View>
);

export default function HomeScreen({ navigation }) {
    const user = auth.currentUser;
    const [devotionals, setDevotionals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // Para pull-to-refresh
    const [userStreak, setUserStreak] = useState(0); // Estado para o streak

    // Função para buscar dados do usuário (streak)
    const fetchUserData = async () => {
        if (user) {
            const userDocRef = doc(firestore, 'users', user.uid);
            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    setUserStreak(docSnap.data().streakCount || 0);
                } else {
                    setUserStreak(0); // Usuário sem dados ainda
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
                setUserStreak(0); // Define como 0 em caso de erro
            }
        }
    };

    // Função para buscar devocionais (será chamada pelo listener)
    const fetchDevotionals = () => {
        setLoading(true);
        // Query para buscar os últimos 20 devocionais públicos
        const q = query(
            collection(firestore, 'devotionals'),
            // where('visibility', '==', 'public'), // Adicionar filtro quando a privacidade for implementada
            orderBy('createdAt', 'desc'),
            limit(20)
        );

        // onSnapshot escuta atualizações em tempo real
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedDevotionals = [];
            querySnapshot.forEach((doc) => {
                fetchedDevotionals.push({ id: doc.id, ...doc.data() });
            });
            setDevotionals(fetchedDevotionals);
            setLoading(false);
            setRefreshing(false); // Para pull-to-refresh
        }, (error) => {
            console.error("Erro ao buscar devocionais em tempo real:", error);
            Alert.alert("Erro", "Não foi possível carregar o feed.");
            setLoading(false);
            setRefreshing(false);
        });

        // Retorna a função de unsubscribe para limpar o listener quando o componente desmontar
        return unsubscribe;
    };

    useEffect(() => {
        fetchUserData(); // Busca dados do usuário ao montar
        const unsubscribe = fetchDevotionals(); // Inicia o listener do feed

        // Função de limpeza que será chamada quando o componente for desmontado
        return () => unsubscribe();
    }, []); // Roda apenas uma vez na montagem inicial

    // Função para Pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchUserData(); // Re-busca dados do usuário
        // fetchDevotionals é chamado automaticamente pelo listener, mas podemos forçar se quisermos
        // Se estiver usando getDocs() em vez de onSnapshot(), chame fetchDevotionals() aqui.
        // Neste caso, o listener já atualiza, então apenas definimos refreshing como false no callback.
    };


    const handleLogout = async () => { /* ... (código de logout existente) ... */ };
    const goToAddDevotional = () => { navigation.navigate('AddDevotional'); };

    return (
        <View style={styles.container}>
            {/* Header com Infos do Usuário */}
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Bem-vindo!</Text>
                {user && <Text style={styles.userInfo}>{user.email}</Text>}
                 <Text style={styles.streakInfo}>🔥 Dias de Luz: {userStreak}</Text>
                <Button title="Sair" onPress={handleLogout} color="red" />
            </View>

            <Button title="Registrar Devocional de Hoje" onPress={goToAddDevotional} />

            {/* Feed de Devocionais */}
            <Text style={styles.feedTitle}>Devocionais Recentes</Text>
            {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={devotionals}
                    renderItem={({ item }) => <DevotionalItem item={item} />}
                    keyExtractor={item => item.id}
                    style={styles.feedList}
                    ListEmptyComponent={<Text style={styles.emptyFeed}>Nenhum devocional encontrado.</Text>}
                    // Adiciona Pull-to-refresh
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            )}
        </View>
    );
}

// Adicionar estilos para os novos elementos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center', // Remover para permitir que a lista preencha
        // alignItems: 'center', // Remover para permitir que a lista preencha
    },
    header: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center', // Centraliza itens do header
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userInfo: {
        fontSize: 12,
        color: 'grey',
        marginBottom: 5,
    },
     streakInfo: {
         fontSize: 16,
         fontWeight: 'bold',
         color: '#ff8c00', // Cor laranja para o streak
         marginBottom: 10,
     },
    feedTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 15,
        textAlign: 'center',
    },
    feedList: {
        flex: 1, // Permite que a lista ocupe o espaço restante
        width: '100%',
    },
    devotionalItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2, // Sombra Android
        shadowColor: '#000', // Sombra iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    itemUser: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#555',
    },
    itemDate: {
        fontSize: 10,
        color: 'grey',
        marginBottom: 5,
    },
    itemDescription: {
        fontSize: 14,
        marginBottom: 8,
    },
    itemMeta: {
        fontSize: 12,
        color: 'grey',
    },
    emptyFeed: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: 'grey',
    }
});