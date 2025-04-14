import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { registerUser } from '../services/authService'; // Importa a função de registro

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Campo extra para confirmar senha
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
        Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    setLoading(true);
    try {
      await registerUser(email, password);
      // O AppNavigator detectará o novo usuário e navegará para Home
      console.log("Registro bem-sucedido!");
      // Poderia adicionar um Alert de sucesso aqui antes da navegação automática
      // Alert.alert("Sucesso", "Conta criada com sucesso! Faça o login.");
      // navigation.navigate('Login'); // Ou voltar para login após registro
    } catch (error) {
      console.error("Erro no Registro:", error);
      let errorMessage = "Ocorreu um erro ao registrar.";
       if (error.code === 'auth/email-already-in-use') {
           errorMessage = "Este e-mail já está em uso.";
       } else if (error.code === 'auth/invalid-email') {
           errorMessage = "Formato de e-mail inválido.";
       } else if (error.code === 'auth/weak-password') {
           errorMessage = "A senha é muito fraca. Use pelo menos 6 caracteres.";
       }
      Alert.alert("Erro no Registro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registre-se</Text>
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
        placeholder="Senha (mínimo 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
       <TextInput
        style={styles.input}
        placeholder="Confirme a Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button
        title={loading ? "Registrando..." : "Registrar"}
        onPress={handleRegister}
        disabled={loading}
       />
       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.switchButton}>
            {/* Ou navigation.navigate('Login') se preferir */}
           <Text style={styles.switchButtonText}>Já tem conta? Faça Login</Text>
       </TouchableOpacity>
    </View>
  );
}

// Usar os mesmos estilos do LoginScreen ou criar um arquivo de estilos compartilhado
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