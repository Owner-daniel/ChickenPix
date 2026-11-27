import { useState, useCallback } from 'react';
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
  TouchableWithoutFeedback,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { listarChaves, cadastrarChave, removerChave } from '../src/services/pixService';

// Valores aceitos pelo switch do ChavePixController (minúsculas)
const TIPOS_CADASTRO = [
  { valor: 'cpf', label: 'CPF' },
  { valor: 'cnpj', label: 'CNPJ' },
  { valor: 'email', label: 'E-mail' },
  { valor: 'telefone', label: 'Telefone' },
];

const ROTULOS_TIPO = {
  CPF: 'CPF',
  CNPJ: 'CNPJ',
  EMAIL: 'E-mail',
  TELEFONE: 'Telefone',
  ALEATORIA: 'Chave aleatória',
};

const ICONES_TIPO = {
  EMAIL: 'mail',
  TELEFONE: 'phone',
};

// ChavePixResponse: { id, tipo (enum, ex: "CPF"), chave }
function normalizarChave(item) {
  const tipo = String(item.tipo ?? '').toUpperCase();
  return {
    id: String(item.id ?? `${tipo}-${item.chave}`),
    tipo,
    rotulo: ROTULOS_TIPO[tipo] ?? tipo,
    valor: String(item.chave ?? ''),
    icone: ICONES_TIPO[tipo] ?? 'key',
  };
}

function validarChave(tipo, valor) {
  if (!valor) return 'Informe o valor da chave.';
  if (tipo === 'email' && !valor.includes('@')) return 'Informe um e-mail válido.';
  return null;
}

export default function Chave() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const numConta = params?.numConta ? String(params.numConta) : '';

  const [chaves, setChaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState('cpf');
  const [novaChave, setNovaChave] = useState('');
  const [salvando, setSalvando] = useState(false);

  const fecharTela = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({ pathname: '/', params: { numeroConta: numConta } });
    }
  };

  const carregarChaves = useCallback(async () => {
    if (!numConta) {
      setChaves([]);
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      const lista = await listarChaves(numConta);
      setChaves(Array.isArray(lista) ? lista.map(normalizarChave) : []);
    } catch (err) {
      setErro(err.message || 'Não foi possível carregar as chaves.');
    } finally {
      setLoading(false);
    }
  }, [numConta]);

  useFocusEffect(
    useCallback(() => {
      carregarChaves();
    }, [carregarChaves])
  );

  const abrirModal = () => {
    setNovaChave('');
    setTipoSelecionado('cpf');
    setModalVisible(true);
  };

  const handleSalvarChave = async () => {
    if (!numConta) {
      Alert.alert('Erro', 'Conta não identificada. Volte à tela inicial e abra as chaves novamente.');
      return;
    }

    const valor = novaChave.trim();
    const erroValidacao = validarChave(tipoSelecionado, valor);
    if (erroValidacao) {
      Alert.alert('Atenção', erroValidacao);
      return;
    }

    setSalvando(true);
    try {
      await cadastrarChave({ numConta, tipo: tipoSelecionado, chave: valor });
      setModalVisible(false);
      await carregarChaves();
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível registrar a chave.');
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluirChave = (chave) => {
    Alert.alert(
      `Excluir ${chave.rotulo}`,
      `Deseja excluir a chave ${chave.valor}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await removerChave({ numConta, tipo: chave.tipo });
              await carregarChaves();
            } catch (err) {
              Alert.alert('Erro', err.message || 'Não foi possível excluir a chave.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={fecharTela} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#2D2D2D" />
        </TouchableOpacity>

        <Text style={styles.title}>Minhas chaves</Text>

        <TouchableOpacity style={styles.registrarRow} onPress={abrirModal} activeOpacity={0.7}>
          <Text style={styles.registrarTexto}>Registrar chave</Text>
          <Ionicons name="add" size={26} color="#00A88F" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Chaves cadastradas</Text>

        {erro && (
          <View style={styles.avisoBox}>
            <Text style={styles.avisoTexto}>{erro}</Text>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={carregarChaves}
              colors={['#00A88F']}
              tintColor="#00A88F"
            />
          }
        >
          {!loading && chaves.length === 0 && !erro && (
            <Text style={styles.vazio}>Nenhuma chave cadastrada.</Text>
          )}

          {chaves.map((item) => (
            <View key={item.id} style={styles.chaveItem}>
              <View style={styles.iconContainer}>
                <Feather name={item.icone} size={22} color="#000000" />
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.tipoTexto}>{item.rotulo}</Text>
                <Text style={styles.valorTexto}>{item.valor}</Text>
              </View>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => handleExcluirChave(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={20} color="#000000" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalBackButton}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-back" size={26} color="#2D2D2D" />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Registrar chave</Text>

                <Text style={styles.modalSubTitle}>Escolha o tipo da chave</Text>
                <View style={styles.tiposRow}>
                  {TIPOS_CADASTRO.map((t) => {
                    const ativo = tipoSelecionado === t.valor;
                    return (
                      <TouchableOpacity
                        key={t.valor}
                        style={[styles.tipoChip, ativo && styles.tipoChipAtivo]}
                        onPress={() => setTipoSelecionado(t.valor)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.tipoChipTexto, ativo && styles.tipoChipTextoAtivo]}>
                          {t.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.modalSubTitle}>Insira o dado para registrar a chave</Text>
                <TextInput
                  style={styles.input}
                  placeholder={tipoSelecionado === 'email' ? 'seu@email.com' : 'Digite a chave'}
                  placeholderTextColor="#B0B0B0"
                  value={novaChave}
                  onChangeText={setNovaChave}
                  autoCapitalize="none"
                  keyboardType={
                    tipoSelecionado === 'cpf' || tipoSelecionado === 'cnpj' || tipoSelecionado === 'telefone'
                      ? 'numeric'
                      : 'default'
                  }
                  editable={!salvando}
                />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.btnRegistrar, salvando && styles.btnDesabilitado]}
                    onPress={handleSalvarChave}
                    disabled={salvando}
                    activeOpacity={0.8}
                  >
                    {salvando ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.btnRegistrarTexto}>Registrar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#FFFFFF' },
  backButton: { paddingVertical: 12, width: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000000', marginTop: 8, marginBottom: 28 },
  registrarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  registrarTexto: { fontSize: 16, fontWeight: 'bold', color: '#00A88F' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginTop: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#8E8E93', marginBottom: 16 },
  avisoBox: { marginTop: 4, marginBottom: 12, padding: 10, borderRadius: 8, backgroundColor: '#BCEBE3' },
  avisoTexto: { color: '#000000', fontSize: 13, fontWeight: '600' },
  vazio: { textAlign: 'center', color: '#8E8E93', fontSize: 14, marginTop: 24 },
  chaveItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  iconContainer: { width: 32, alignItems: 'flex-start', justifyContent: 'center' },
  infoContainer: { flex: 1 },
  tipoTexto: { fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 2 },
  valorTexto: { fontSize: 14, color: '#8E8E93' },
  menuButton: { padding: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    minHeight: '65%',
  },
  modalBackButton: { width: 40, height: 40, justifyContent: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 32 },
  modalSubTitle: { fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 12 },
  tiposRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  tipoChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tipoChipAtivo: { backgroundColor: '#00A88F', borderColor: '#00A88F' },
  tipoChipTexto: { fontSize: 14, color: '#000000', fontWeight: '600' },
  tipoChipTextoAtivo: { color: '#FFFFFF' },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    fontSize: 16,
    paddingVertical: 8,
    color: '#000000',
    marginBottom: 28,
  },
  buttonContainer: { alignItems: 'flex-end' },
  btnRegistrar: {
    backgroundColor: '#00A88F',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  btnDesabilitado: { opacity: 0.6 },
  btnRegistrarTexto: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});