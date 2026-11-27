import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ValorTransferencia() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const chaveDestino = params?.chave ? String(params.chave).trim() : '';
  const nomeDestinatario = params?.nome ? String(params.nome).trim() : chaveDestino;
  const [valorRaw, setValorRaw] = useState('1');

  const obterNumero = (valorDigits) => {
    const apenasNumeros = (valorDigits || '').replace(/\D/g, '');
    if (!apenasNumeros) return 0;
    return Number(apenasNumeros) / 100;
  };

  const formatarMoeda = (valorDigits) => {
    const numero = obterNumero(valorDigits);
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleTextChange = (text) => {
    const apenasNumeros = text.replace(/\D/g, '');
    setValorRaw(apenasNumeros);
  };

  const avançarParaConfirmacao = () => {
    const valorNumerico = obterNumero(valorRaw);
    if (valorNumerico <= 0) {
      Alert.alert('Valor inválido', 'Informe um valor maior que R$ 0,00.');
      return;
    }

    const valorFormatado = formatarMoeda(valorRaw);
    router.push({
      pathname: '/confirmar-transferencia',
      params: {
        ...params,
        nome: nomeDestinatario,
        chave: chaveDestino,
        valor: valorFormatado,
        valorNumerico: String(valorNumerico),
      },
    });
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#2D2D2D" />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.labelTransferir}>Transferir para</Text>
            <Text style={styles.nomeDestinatario}>{nomeDestinatario || 'Destinatário'}</Text>

            <View style={styles.valorContainer}>
              <Text style={styles.labelValor}>Valor</Text>
              <TextInput
                  style={styles.inputValor}
                  value={formatarMoeda(valorRaw)}
                  onChangeText={handleTextChange}
                  keyboardType="numeric"
                  autoFocus={true}
                  onSubmitEditing={avançarParaConfirmacao}
                  returnKeyType="done"
              />
            </View>

            <TouchableOpacity
                style={styles.btnConfirmar}
                onPress={avançarParaConfirmacao}
                activeOpacity={0.85}
            >
              <Text style={styles.btnConfirmarTexto}>Confirmar valor</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  },
  backButton: {
    paddingVertical: 12,
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  labelTransferir: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  nomeDestinatario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 36,
  },
  valorContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 8,
    marginBottom: 28,
  },
  labelValor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  inputValor: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  btnConfirmar: {
    backgroundColor: '#00A88F',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  btnConfirmarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});