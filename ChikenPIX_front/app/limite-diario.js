import { useState, useCallback } from 'react';
import {
    Alert,
    StyleSheet,
    StatusBar,
    ScrollView,
    RefreshControl,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { buscarLimite, alterarLimite } from '../src/services/pixService';

const LIMITE_MINIMO = 100;
const LIMITE_MAXIMO = 50000;

function formatarBRL(valor) {
    return Number(valor ?? 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

export default function LimiteDiario() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const numeroConta = params?.numeroConta ? String(params.numeroConta) : '';

    const [limite, setLimite] = useState(null);
    const [digitos, setDigitos] = useState('');
    const [loading, setLoading] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState(null);

    const handleVoltar = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace({
                pathname: '/',
                params: { numeroConta },
            });
        }
    };

    const carregarLimite = useCallback(async () => {
        if (!numeroConta) {
            setLimite(null);
            return;
        }

        setLoading(true);
        setErro(null);

        try {
            const dados = await buscarLimite(numeroConta);
            setLimite(dados);
        } catch (err) {
            setErro(err.message || 'Não foi possível carregar o limite.');
        } finally {
            setLoading(false);
        }
    }, [numeroConta]);

    useFocusEffect(
        useCallback(() => {
            carregarLimite();
        }, [carregarLimite])
    );

    const limiteAtual = Number(limite?.limiteDiario ?? 0);
    const usadoHoje = Number(limite?.usadoHoje ?? 0);
    const disponivel = Math.max(limiteAtual - usadoHoje, 0);
    const progresso = limiteAtual > 0 ? Math.min(usadoHoje / limiteAtual, 1) : 0;
    const novoValor = digitos ? Number(digitos) / 100 : null;

    const handleSalvar = async () => {
        if (!numeroConta) {
            Alert.alert('Erro', 'Conta não identificada. Volte à tela inicial e abra o limite novamente.');
            return;
        }

        if (novoValor === null) {
            Alert.alert('Atenção', 'Informe um valor para o novo limite.');
            return;
        }
        if (novoValor < LIMITE_MINIMO || novoValor > LIMITE_MAXIMO) {
            Alert.alert(
                'Valor inválido',
                `O limite deve estar entre ${formatarBRL(LIMITE_MINIMO)} e ${formatarBRL(LIMITE_MAXIMO)}.`
            );
            return;
        }

        setSalvando(true);
        try {
            const atualizado = await alterarLimite(numeroConta, novoValor);
            setLimite(atualizado ?? { ...limite, limiteDiario: novoValor });
            setDigitos('');
            Alert.alert('Sucesso', 'Limite diário atualizado.');
        } catch (err) {
            Alert.alert('Erro', err.message || 'Não foi possível alterar o limite.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.topo}>
                <TouchableOpacity onPress={handleVoltar} style={styles.voltar}>
                    <Text style={styles.voltarTexto}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.topoTitulo}>Limite diário</Text>
            </View>

            <View style={styles.separador} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={carregarLimite}
                        colors={['#00A88F']}
                        tintColor="#00A88F"
                    />
                }
            >
                {erro && (
                    <View style={styles.avisoBox}>
                        <Text style={styles.avisoTexto}>{erro}</Text>
                    </View>
                )}

                <View style={styles.secao}>
                    <Text style={styles.label}>Limite atual</Text>
                    <Text style={styles.valorGrande}>{formatarBRL(limiteAtual)}</Text>

                    <View style={styles.barraFundo}>
                        <View style={[styles.barraProgresso, { width: `${progresso * 100}%` }]} />
                    </View>

                    <View style={styles.linhaInfo}>
                        <Text style={styles.infoTexto}>Usado hoje: {formatarBRL(usadoHoje)}</Text>
                        <Text style={styles.infoTexto}>Disponível: {formatarBRL(disponivel)}</Text>
                    </View>
                </View>

                <View style={styles.separador} />

                <View style={styles.secao}>
                    <Text style={styles.labelForm}>Informe o novo valor diário</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="R$ 0,00"
                        placeholderTextColor="#9A9A9A"
                        value={novoValor === null ? '' : formatarBRL(novoValor)}
                        onChangeText={(texto) => setDigitos(texto.replace(/\D/g, ''))}
                        editable={!salvando}
                    />
                    <Text style={styles.ajuda}>
                        Mínimo {formatarBRL(LIMITE_MINIMO)} e máximo {formatarBRL(LIMITE_MAXIMO)}.
                    </Text>

                    <TouchableOpacity
                        style={[styles.botao, salvando && styles.botaoDesabilitado]}
                        onPress={handleSalvar}
                        disabled={salvando}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.botaoTexto}>
                            {salvando ? 'Salvando...' : 'Continuar'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    topo: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    voltar: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    voltarTexto: {
        color: '#000000',
        fontSize: 36,
        lineHeight: 36,
    },
    topoTitulo: {
        color: '#000000',
        fontSize: 26,
        fontWeight: '700',
        marginTop: 12,
        marginBottom: 16,
    },
    scrollContent: { paddingBottom: 40 },
    avisoBox: {
        marginHorizontal: 20,
        marginTop: 12,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#BCEBE3',
    },
    avisoTexto: { color: '#000000', fontSize: 13, fontWeight: '600' },
    secao: { padding: 20 },
    label: { color: '#6B6B6B', fontSize: 14, marginBottom: 4 },
    labelForm: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    valorGrande: { color: '#000000', fontSize: 28, fontWeight: '700', marginBottom: 16 },
    barraFundo: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#B9EAE0',
        overflow: 'hidden',
    },
    barraProgresso: { height: '100%', backgroundColor: '#00A88F', borderRadius: 5 },
    linhaInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    infoTexto: { color: '#6B6B6B', fontSize: 13 },
    separador: { height: 1, backgroundColor: '#EEEEEE' },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
        paddingVertical: 10,
        fontSize: 18,
        color: '#000000',
    },
    ajuda: { color: '#6B6B6B', fontSize: 12, marginTop: 8 },
    botao: {
        backgroundColor: '#00A88F',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 32,
    },
    botaoDesabilitado: { opacity: 0.6 },
    botaoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});