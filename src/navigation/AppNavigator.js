// src/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { monitorAuthState } from '../services/authService';
import { View, ActivityIndicator } from 'react-native';

// Importe suas telas
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AddDevotionalScreen from '../screens/AddDevotionalScreen';

const Stack = createStackNavigator();

// ***** VERIFIQUE AQUI *****
// A função AuthStack está definida corretamente? Não está comentada?
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// ***** VERIFIQUE AQUI *****
// A função AppStack também está definida corretamente?
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'MeuDevo' }}/>
      <Stack.Screen name="AddDevotional" component={AddDevotionalScreen} options={{ title: 'Registrar Devocional' }}/>
      {/* Outras telas do app aqui */}
    </Stack.Navigator>
  );
}

// Função principal do Navigator
export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = monitorAuthState(currentUser => {
      setUser(currentUser);
      if (loading) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ***** VERIFIQUE AQUI *****
  // O nome 'AuthStack' na linha abaixo está escrito EXATAMENTE igual
  // à definição da função? (Maiúsculas/minúsculas importam)
  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}