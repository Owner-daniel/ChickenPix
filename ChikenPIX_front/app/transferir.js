import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Transferir() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const origem = params?.origem ? String(params.origem).trim() : '';

  const [chaveDestino, setChaveDestino] = useState('');

  const fecharTela = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const avancarComChave = () => {
    const chaveLimpa = chaveDestino.trim();
    if (!chaveLimpa) {
      Alert.alert('Chave obrigatória', 'Informe a chave Pix de quem vai receber.');
      return;
    }

    router.push({
      pathname: '/valor-transferencia',
      params: {
        ...params,
        origem,
        nome: chaveLimpa,
        chave: chaveLimpa,
      },
    });
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={fecharTela} activeOpacity={0.7}>
            <Ionicons name="close" size={28} color="#2D2D2D" />
          </TouchableOpacity>

          <Text style={styles.title}>Para quem você quer transferir?</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Insira a chave Pix de quem vai receber</Text>
            <TextInput
                style={styles.input}
                placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                placeholderTextColor="#A0A0A0"
                value={chaveDestino}
                onChangeText={setChaveDestino}
                onSubmitEditing={avancarComChave}
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
            />
          </View>

          <TouchableOpacity style={styles.btnContinuar} onPress={avancarComChave} activeOpacity={0.85}>
            <Text style={styles.btnContinuarTexto}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    paddingTop: 12,
    paddingBottom: 12,
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 24,
    lineHeight: 30,
  },
  inputContainer: {
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: 8,
  },
  input: {
    fontSize: 15,
    color: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 8,
  },
  btnContinuar: {
    backgroundColor: '#00A88F',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  btnContinuarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});