import { auth } from '../config/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged // Importar para monitorar estado
} from 'firebase/auth';

// Função de Registro
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Função de Login
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Função de Logout
export const logoutUser = () => {
  return signOut(auth);
};

// Monitorar mudanças no estado de autenticação (útil no AppNavigator)
export const monitorAuthState = (onUserChanged) => {
  return onAuthStateChanged(auth, onUserChanged);
};