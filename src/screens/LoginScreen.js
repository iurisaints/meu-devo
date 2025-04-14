import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { loginUser } from '../services/authService'; // Importa a função de login

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha e-mail e senha.");
      return;
    }
    setLoading(true); // Inicia o carregamento
    try {
      await loginUser(email, password);
      // A navegação para Home será automática pelo AppNavigator ao detectar o usuário logado
      // Não precisamos navegar manualmente aqui após o login bem-sucedido
      console.log("Login bem-sucedido!");
    } catch (error) {
      console.error("Erro no Login:", error);
      // Tenta dar uma mensagem mais amigável baseada no erro do Firebase
      let errorMessage = "Ocorreu um erro ao fazer login.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          errorMessage = "E-mail ou senha inválidos.";
      } else if (error.code === 'auth/invalid-email') {
          errorMessage = "Formato de e-mail inválido.";
      }
      Alert.alert("Erro no Login", errorMessage);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login MeuDevo</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Esconde a senha
      />
      <Button
        title={loading ? "Entrando..." : "Login"} // Mostra texto diferente durante o carregamento
        onPress={handleLogin}
        disabled={loading} // Desabilita o botão durante o carregamento
      />
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.switchButton}>
        <Text style={styles.switchButtonText}>Não tem conta? Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  switchButton: {
      marginTop: 20,
  },
  switchButtonText: {
      color: 'blue',
      textDecorationLine: 'underline',
  }
});