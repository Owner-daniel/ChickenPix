import { useState, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    StatusBar,
    ScrollView,
    RefreshControl,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { buscarNotificacoes } from '../src/services/pixService';

function formatarBRL(valor) {
    return Number(valor ?? 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

function dataDaTransacao(t) {
    const bruta = t.data ?? t.dataHora ?? t.createdAt ?? null;
    if (!bruta) return null;
    const d = new Date(bruta);
    return isNaN(d.getTime()) ? null : d;
}

// Normaliza o item vindo da API. Ajuste os campos aqui se o Spring usar outros nomes.
function normalizarTransacao(t, numeroConta) {
    const valor = Number(t.valor ?? t.value ?? 0);
    const data = dataDaTransacao(t);
    const entrada = t.destino === numeroConta || t.tipo === 'ENTRADA' || t.tipo === 'RECEBIDO';

    return {
        id: String(t.id ?? `${data?.getTime() ?? ''}-${valor}-${Math.random()}`),
        descricao: t.descricao ?? t.nomeDestinatario ?? t.nomeRemetente ?? 'Transferência Pix',
        valor,
        entrada,
        data,
    };
}

function agruparPorDia(lista) {
    const grupos = {};
    lista.forEach((item) => {
        const chave = item.data
            ? item.data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
            : 'Sem data';
        if (!grupos[chave]) grupos[chave] = [];
        grupos[chave].push(item);
    });
    return Object.entries(grupos);
}

export default function Extrato() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const numeroConta = params?.numeroConta ? String(params.numeroConta) : '';

    const [transacoes, setTransacoes] = useState([]);
    const [loading, setLoading] = useState(false);
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

    const carregarExtrato = useCallback(async () => {
        console.log('EXTRATO numeroConta:', JSON.stringify(numeroConta));

        if (!numeroConta) {
            setTransacoes([]);
            return;
        }

        setLoading(true);
        setErro(null);

        try {
            const resposta = await buscarNotificacoes(numeroConta);
            console.log('RESPOSTA EXTRATO:', JSON.stringify(resposta)?.slice(0, 500));

            const lista = Array.isArray(resposta) ? resposta : resposta?.content ?? [];
            const normalizadas = lista.map((t) => normalizarTransacao(t, numeroConta));
            normalizadas.sort((a, b) => (b.data?.getTime() ?? 0) - (a.data?.getTime() ?? 0));
            setTransacoes(normalizadas);
        } catch (err) {
            setErro(err.message || 'Não foi possível carregar o extrato.');
        } finally {
            setLoading(false);
        }
    }, [numeroConta]);

    useFocusEffect(
        useCallback(() => {
            carregarExtrato();
        }, [carregarExtrato])
    );

    const grupos = useMemo(() => agruparPorDia(transacoes), [transacoes]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.topo}>
                <TouchableOpacity onPress={handleVoltar} style={styles.voltar}>
                    <Text style={styles.voltarTexto}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.topoTitulo}>Extrato</Text>
            </View>

            <View style={styles.separador} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={carregarExtrato}
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

                {!loading && transacoes.length === 0 && !erro && (
                    <Text style={styles.vazio}>Nenhuma transação encontrada.</Text>
                )}

                {grupos.map(([dia, itens]) => (
                    <View key={dia} style={styles.grupo}>
                        <Text style={styles.dataGrupo}>{dia}</Text>

                        {itens.map((item) => (
                            <View key={item.id} style={styles.linha}>
                                <View style={styles.linhaEsquerda}>
                                    <Text style={styles.descricao} numberOfLines={1}>
                                        {item.descricao}
                                    </Text>
                                    <Text style={styles.hora}>
                                        {item.data
                                            ? item.data.toLocaleTimeString('pt-BR', {
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              })
                                            : ''}
                                    </Text>
                                </View>
                                <Text style={[styles.valor, item.entrada ? styles.entrada : styles.saida]}>
                                    {item.entrada ? '+ ' : '- '}
                                    {formatarBRL(Math.abs(item.valor))}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
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
    voltarTexto: { color: '#000000', fontSize: 36, lineHeight: 36 },
    topoTitulo: {
        color: '#000000',
        fontSize: 26,
        fontWeight: '700',
        marginTop: 12,
        marginBottom: 16,
    },
    separador: { height: 1, backgroundColor: '#EEEEEE' },
    scrollContent: { paddingBottom: 40 },
    avisoBox: {
        marginHorizontal: 20,
        marginTop: 12,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#BCEBE3',
    },
    avisoTexto: { color: '#000000', fontSize: 13, fontWeight: '600' },
    vazio: {
        textAlign: 'center',
        color: '#6B6B6B',
        fontSize: 14,
        marginTop: 40,
    },
    grupo: { paddingHorizontal: 20, paddingTop: 20 },
    dataGrupo: {
        color: '#000000',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    linha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F2',
    },
    linhaEsquerda: { flex: 1, marginRight: 12 },
    descricao: { color: '#000000', fontSize: 15, fontWeight: '600' },
    hora: { color: '#6B6B6B', fontSize: 12, marginTop: 2 },
    valor: { fontSize: 15, fontWeight: '700' },
    entrada: { color: '#00A88F' },
    saida: { color: '#000000' },
});