import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { logoutUser } from '../services/authService'; // Importa a função de logout
import { auth } from '../config/firebaseConfig'; // Importa auth para pegar dados do usuário

export default function HomeScreen({ navigation }) { // Recebe navigation

  const user = auth.currentUser; // Pega o usuário atualmente logado

  const handleLogout = async () => {
    try {
      await logoutUser();
      // A navegação de volta para Login será automática pelo AppNavigator
      console.log("Logout bem-sucedido!");
    } catch (error) {
      console.error("Erro no Logout:", error);
      Alert.alert("Erro", "Não foi possível fazer logout.");
    }
  };

  // Função para navegar para a tela de adicionar devocional
  const goToAddDevotional = () => {
      navigation.navigate('AddDevotional'); // Navega para a tela definida no AppStack
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem-vindo ao MeuDevo!</Text>
      {user && <Text style={styles.userInfo}>Logado como: {user.email}</Text>}

      {/* --- Área para Dica do Dia e Streak (MVP Futuro) --- */}
      <View style={styles.featureArea}>
          <Text style={styles.featureTitle}>Dica do Dia:</Text>
          <Text>Leia Salmos 1 hoje!</Text>
          {/* Buscar dica do DB/Hardcoded */}
      </View>
      <View style={styles.featureArea}>
          <Text style={styles.featureTitle}>Dias de Luz (Streak):</Text>
          <Text>🔥 0 dias</Text>
          {/* Buscar streak do usuário no DB */}
      </View>
      {/* --- Fim da Área Futura --- */}


      <Button
        title="Registrar Devocional de Hoje"
        onPress={goToAddDevotional} // Chama a função de navegação
      />

      {/* Espaçamento */}
      <View style={{ height: 30 }} />

      <Button
        title="Logout"
        onPress={handleLogout}
        color="red" // Botão de logout em vermelho
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente (ajuste conforme layout final)
    alignItems: 'center', // Centraliza horizontalmente
    padding: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  userInfo: {
      fontSize: 14,
      color: 'grey',
      marginBottom: 30,
  },
  featureArea: {
      marginBottom: 20,
      alignItems: 'center',
      padding: 15,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      width: '90%', // Ajuste a largura
  },
  featureTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
  }
});