import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) { // Recebe navigation como prop
  return (
    <View style={styles.container}>
      <Text>Tela de Post</Text>
      {/* Adicionaremos Inputs e Botões aqui */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});