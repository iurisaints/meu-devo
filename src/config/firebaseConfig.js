// src/config/firebaseConfig.js

import { initializeApp } from "firebase/app";
// Importe initializeAuth e getReactNativePersistence especificamente para React Native Auth
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// Importe o AsyncStorage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore"; // <--- ADICIONE ESTA LINHA
// Remova a importação do getAnalytics se não for usar imediatamente
// import { getAnalytics } from "firebase/analytics";

// Suas credenciais do Firebase (substitua pelos seus valores reais)
// LEMBRE-SE: Proteja essas chaves em produção usando variáveis de ambiente!
const firebaseConfig = {
  apiKey: "AIzaSyBUsvHtgWh6Ud5nIjiN94kMD7xx17PnzHI",
  authDomain: "meu-devo.firebaseapp.com",
  projectId: "meu-devo",
  storageBucket: "meu-devo.firebasestorage.app",
  messagingSenderId: "82478942671",
  appId: "1:82478942671:web:50033ec81226a47822aaba",
  measurementId: "G-BCLVDP8BJM"
};

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Inicializa o Firebase Auth com persistência usando AsyncStorage
// Esta é a parte crucial para React Native
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Se você precisar do Analytics (opcional para o MVP de Auth):
// 1. Certifique-se de que o SDK do Analytics está instalado (`firebase` já inclui)
// 2. Descomente a linha de importação do getAnalytics no início
// 3. Descomente a linha abaixo:
// const analytics = getAnalytics(app);
// 4. Exporte 'analytics' se necessário

// Exporta a instância 'auth' configurada para ser usada nos seus serviços

const firestore = getFirestore(app);
export { auth, firestore };