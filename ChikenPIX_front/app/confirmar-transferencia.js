import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { realizarPix } from '../src/services/pixService';

export default function ConfirmarTransferencia() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const chaveDestino = params?.chave ? String(params.chave).trim() : '';
  const nome = params?.nome ? String(params.nome).trim() : chaveDestino;
  const origem = params?.origem ? String(params.origem).trim() : '';
  const valor = params?.valor ? String(params.valor) : 'R$ 0,01';

  const valorNumerico = (() => {
    if (params?.valorNumerico !== undefined) {
      const parsed = Number(params.valorNumerico);
      if (!Number.isNaN(parsed)) return parsed;
    }
    const apenasNumeros = String(valor).replace(/\D/g, '');
    return apenasNumeros ? Number(apenasNumeros) / 100 : 0;
  })();

  const [modalSenhaVisible, setModalSenhaVisible] = useState(false);
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);

  const abrirModalSenha = () => {
    if (!origem) {
      Alert.alert(
          'Conta de origem não informada',
          'Abra a tela inicial com uma conta ativa antes de realizar o Pix.'
      );
      return;
    }
    if (!chaveDestino) {
      Alert.alert('Chave Pix ausente', 'Volte e informe uma chave Pix válida para o destino.');
      return;
    }
    if (valorNumerico <= 0) {
      Alert.alert('Valor inválido', 'O valor da transferência deve ser maior que zero.');
      return;
    }

    setSenha('');
    setModalSenhaVisible(true);
  };

  const confirmarEnvioComSenha = async () => {
    if (!senha.trim()) {
      Alert.alert('Senha obrigatória', 'Digite sua senha para confirmar a transferência.');
      return;
    }

    setEnviando(true);
    try {
      await realizarPix({
        origem,
        chaveDestino,
        valor: valorNumerico,
        senha: senha.trim(),
      });

      setModalSenhaVisible(false);
      setSenha('');

      Alert.alert(
          'Sucesso!',
          `Transferência de ${valor} para ${chaveDestino} realizada com sucesso!`,
          [
            {
              text: 'OK',
              onPress: () =>
                  router.push({
                    pathname: '/',
                    params: { numeroConta: origem },
                  }),
            },
          ]
      );
    } catch (err) {
      Alert.alert(
          'Não foi possível concluir',
          err?.message || 'Erro ao realizar transferência Pix.'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.container}>
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#2D2D2D" />
          </TouchableOpacity>

          <Text style={styles.title}>Você vai enviar</Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.rowItem}>
              <Text style={styles.textoDestaque}>{valor}</Text>
              <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                <Feather name="edit-2" size={20} color="#00A88F" />
              </TouchableOpacity>
            </View>

            <View style={styles.rowItem}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.textoDestaque}>{nome || chaveDestino}</Text>
                {chaveDestino ? (
                    <Text style={styles.chaveSubtext}>Chave: {chaveDestino}</Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => router.push('/transferir')} activeOpacity={0.7}>
                <Feather name="edit-2" size={20} color="#00A88F" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.rowOption} activeOpacity={0.7}>
              <Text style={styles.labelOption}>Detalhes</Text>
              <Feather name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>

            <View style={styles.rowOptionWithIcon}>
              <View>
                <Text style={styles.labelOption}>Quando</Text>
                <Text style={styles.valueOption}>Agora</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Feather name="calendar" size={22} color="#00A88F" />
              </TouchableOpacity>
            </View>

            <View style={styles.rowOptionWithIcon}>
              <Text style={styles.labelOption}>Mensagem</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="add" size={26} color="#00A88F" />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <View>
              <Text style={styles.bottomValorText}>{valor}</Text>
              <Text style={styles.bottomSubtext}>Valor total</Text>
            </View>

            <TouchableOpacity style={styles.btnEnviar} onPress={abrirModalSenha} activeOpacity={0.85}>
              <Text style={styles.btnEnviarTexto}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
            visible={modalSenhaVisible}
            transparent
            animationType="fade"
            onRequestClose={() => !enviando && setModalSenhaVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Confirme sua senha</Text>
              <Text style={styles.modalSubtitle}>
                Digite sua senha para enviar {valor} para {chaveDestino}.
              </Text>

              <TextInput
                  style={styles.modalInput}
                  placeholder="Sua senha"
                  placeholderTextColor="#999999"
                  secureTextEntry
                  value={senha}
                  onChangeText={setSenha}
                  editable={!enviando}
                  autoFocus
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                    style={styles.btnCancelar}
                    onPress={() => {
                      if (!enviando) {
                        setModalSenhaVisible(false);
                        setSenha('');
                      }
                    }}
                    disabled={enviando}
                >
                  <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.btnConfirmar, enviando && { opacity: 0.7 }]}
                    onPress={confirmarEnvioComSenha}
                    disabled={enviando}
                >
                  {enviando ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                      <Text style={styles.btnConfirmarTexto}>Confirmar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  textoDestaque: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00A88F',
  },
  chaveSubtext: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
  },
  rowOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowOptionWithIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  labelOption: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  valueOption: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  bottomValorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00A88F',
  },
  bottomSubtext: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  btnEnviar: {
    backgroundColor: '#00A88F',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  btnEnviarTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#000000',
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btnCancelar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  btnCancelarTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
  },
  btnConfirmar: {
    backgroundColor: '#00A88F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  btnConfirmarTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});