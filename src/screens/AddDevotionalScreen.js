// src/screens/AddDevotionalScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { saveDevotional } from '../services/devotionalService'; // Criaremos este serviço a seguir
import { useNavigation } from '@react-navigation/native'; // Para voltar após salvar

export default function AddDevotionalScreen() {
    const navigation = useNavigation();
    const [versesRead, setVersesRead] = useState('');
    const [timeSpent, setTimeSpent] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        // Validação básica
        const versesNum = parseInt(versesRead, 10);
        const timeNum = parseInt(timeSpent, 10);

        if (isNaN(versesNum) || versesNum < 0) {
            Alert.alert('Erro', 'Por favor, insira um número válido de versículos lidos (0 ou mais).');
            return;
        }
        if (isNaN(timeNum) || timeNum <= 0) {
            Alert.alert('Erro', 'Por favor, insira um tempo válido em minutos (maior que 0).');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Erro', 'Por favor, escreva uma descrição ou aprendizado.');
            return;
        }

        setLoading(true);
        try {
            const data = {
                versesRead: versesNum,
                timeSpentMinutes: timeNum,
                description: description.trim(),
                // createdAt será adicionado no serviço
            };
            await saveDevotional(data); // Chama a função para salvar no Firestore
            Alert.alert('Sucesso!', 'Seu devocional foi registrado.');
            navigation.goBack(); // Volta para a tela anterior (Home)
        } catch (error) {
            console.error("Erro ao salvar devocional:", error);
            Alert.alert('Erro', 'Não foi possível salvar seu devocional. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingContainer}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Quantos versículos leu?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 15"
                    value={versesRead}
                    onChangeText={setVersesRead}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Tempo dedicado (em minutos)?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 30"
                    value={timeSpent}
                    onChangeText={setTimeSpent}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>O que você aprendeu ou orou?</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Descreva sua meditação, aprendizado, orações..."
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                    numberOfLines={4}
                />

                <Button
                    title={loading ? "Salvando..." : "Salvar Devocional"}
                    onPress={handleSave}
                    disabled={loading}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1,
    },
    container: {
        flexGrow: 1, // Permite que o ScrollView cresça
        padding: 20,
        justifyContent: 'center', // Tenta centralizar o conteúdo se for pequeno
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 45, // Aumentar altura para melhor toque
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff', // Fundo branco para inputs
    },
    textArea: {
        height: 100, // Altura maior para área de texto
        textAlignVertical: 'top', // Alinha texto no topo em Android
        paddingTop: 10, // Padding interno
    },
});