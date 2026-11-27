import React, { useState, useCallback } from 'react';
import { StyleSheet, StatusBar, ScrollView, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';

import Header from '../src/components/Header';
import CardSaldo from '../src/components/CardSaldo';
import AcessoRapido from '../src/components/AcessoRapido';
import HistoricoTransferencia from '../src/components/HistoricoTransferencia';
import BotaoPix from '../src/components/BotaoPix';
import PerfilModal from '../src/components/PerfilModal';
import { buscarConta, buscarNotificacoes } from '../src/services/pixService';

function formatarSaldo(valor) {
    const num = Number(valor ?? 0);
    return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

export default function Home() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const numeroContaAtiva = params?.numeroConta ? String(params.numeroConta) : '';

    const [perfilVisible, setPerfilVisible] = useState(false);
    const [conta, setConta] = useState(null);
    const [transacoes, setTransacoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erroConta, setErroConta] = useState(null);
    const [erroTransacoes, setErroTransacoes] = useState(null);

    const carregarDados = useCallback(async () => {
        if (!numeroContaAtiva) {
            setConta(null);
            setTransacoes([]);
            return;
        }

        setLoading(true);
        setErroConta(null);
        setErroTransacoes(null);

        try {
            const dadosConta = await buscarConta(numeroContaAtiva);
            setConta(dadosConta);
        } catch (err) {
            setErroConta(err.message || 'Não foi possível carregar a conta.');
        }

        try {
            const lista = await buscarNotificacoes(numeroContaAtiva);
            setTransacoes(Array.isArray(lista) ? lista : []);
        } catch (err) {
            setErroTransacoes(err.message || 'Não foi possível carregar o histórico.');
        } finally {
            setLoading(false);
        }
    }, [numeroContaAtiva]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados])
    );

    const nomeUsuario = conta?.usuario?.nome || 'Conta';
    const saldoFormatado = conta ? formatarSaldo(conta.saldo) : 'R$ 0,00';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#00A88F" />

            {/* Conteúdo com scroll para evitar cortes em telas menores */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={carregarDados}
                        colors={['#00A88F']}
                        tintColor="#00A88F"
                    />
                }
            >
                <Header
                    nome={nomeUsuario}
                    onPressPerfil={() => setPerfilVisible(true)}
                    onPressMenu={() => setPerfilVisible(true)}
                />

                {erroConta && (
                    <View style={styles.avisoBox}>
                        <Text style={styles.avisoTexto}>{erroConta}</Text>
                    </View>
                )}

                <CardSaldo
                    saldo={saldoFormatado}
                    onPress={carregarDados}
                />

                <AcessoRapido
                    onPix={() =>
                        router.push({
                            pathname: '/transferir',
                            params: { origem: conta?.numeroConta || numeroContaAtiva },
                        })
                    }
                    onCofre={() =>
                        router.push({
                            pathname: '/limite-diario',
                            params: { numeroConta: conta?.numeroConta || numeroContaAtiva },
                        })
                    }
                    onChaves={() =>
                        router.push({
                            pathname: '/chave',
                            params: { numConta: conta?.numeroConta || numeroContaAtiva },
                        })
                    }
                />

                <HistoricoTransferencia
                    transacoes={transacoes}
                    numeroConta={conta?.numeroConta || numeroContaAtiva}
                    loading={loading}
                    error={erroTransacoes}
                />
            </ScrollView>

            {/* Botão Pix flutuante no fundo */}
            <BotaoPix />

            {/* Modal de Perfil acionado ao clicar no Avatar/Header */}
            <PerfilModal
                visible={perfilVisible}
                onClose={() => setPerfilVisible(false)}
                usuario={{
                    nome: nomeUsuario,
                    agencia: conta?.numeroAgencia || '',
                    conta: conta?.numeroConta || numeroContaAtiva,
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 90, // Espaço extra para o BotaoPix não cobrir o conteúdo final
    },
    avisoBox: {
        marginHorizontal: 20,
        marginTop: 12,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#BCEBE3',
    },
    avisoTexto: {
        color: '#000000',
        fontSize: 13,
        fontWeight: '600',
    },
});