import React, { useState } from 'react';
import {
    Alert,
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TelaFluxo from '../../src/components/telaFluxo';
import CampoTexto from '../../src/components/campoTexto';
import LinkVerde from '../../src/components/linkVerde';
import { useCadastro } from '../../src/context/CadastroContext';
import { cadastrarUsuario } from '../../src/services/authService';
import { validarSenha } from '../../src/utils/validacoes';

export default function CadastroSenha() {
    const router = useRouter();
    const { dados, atualizarDados, montarPayload, limparCadastro } = useCadastro();
    const [confirmacao, setConfirmacao] = useState('');
    const [erroSenha, setErroSenha] = useState('');
    const [erroConfirmacao, setErroConfirmacao] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [cadastroConcluido, setCadastroConcluido] = useState(false);

    function irParaLogin() {
        setCadastroConcluido(false);
        limparCadastro();
        router.replace('/login');
    }

    async function finalizarCadastro() {
        if (enviando) return;

        const msgSenha = validarSenha(dados.senha);
        if (msgSenha) {
            setErroSenha(msgSenha);
            return;
        }

        if (dados.senha !== confirmacao) {
            setErroConfirmacao('As senhas não coincidem.');
            return;
        }

        const payload = montarPayload();
        setEnviando(true);

        try {
            await cadastrarUsuario(payload);
            setCadastroConcluido(true);
        } catch (error) {
            const mensagem = error?.message || 'Não foi possível concluir o cadastro.';
            const mensagemAmigavel = mensagem.includes('HTTP 500')
                ? 'Verifique os dados informados ou tente novamente mais tarde.'
                : mensagem;

            Alert.alert('Erro no cadastro', mensagemAmigavel);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <>
            <TelaFluxo
                titulo={'Está acabando...\nCrie uma senha para sua conta!'}
                iconeBotao="checkmark"
                onVoltar={() => router.back()}
                onAvancar={finalizarCadastro}
                carregando={enviando}
            >
                <CampoTexto
                    placeholder="Digite uma senha para sua conta"
                    value={dados.senha}
                    onChangeText={(texto) => {
                        setErroSenha('');
                        atualizarDados({ senha: texto });
                    }}
                    secureTextEntry
                    erro={erroSenha}
                />

                <CampoTexto
                    placeholder="Confirme a senha para sua conta"
                    value={confirmacao}
                    onChangeText={(texto) => {
                        setErroConfirmacao('');
                        setConfirmacao(texto);
                    }}
                    secureTextEntry
                    erro={erroConfirmacao}
                />

                <LinkVerde
                    texto="Já tenho uma conta: Fazer login!"
                    onPress={() => router.replace('/login')}
                />
            </TelaFluxo>

            <Modal
                visible={cadastroConcluido}
                transparent
                animationType="fade"
                onRequestClose={irParaLogin}
            >
                <View style={styles.overlay}>
                    <View style={styles.card}>
                        <View style={styles.iconeSucesso}>
                            <Ionicons name="checkmark" size={32} color="#FFFFFF" />
                        </View>

                        <Text style={styles.cardTitulo}>Conta criada com sucesso!</Text>
                        <Text style={styles.cardMensagem}>
                            Seu cadastro foi concluído. Faça login para acessar sua conta ChickenPix.
                        </Text>

                        <TouchableOpacity
                            style={styles.botaoLogin}
                            onPress={irParaLogin}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.textoBotaoLogin}>Ir para Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    card: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 28,
        paddingHorizontal: 24,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    iconeSucesso: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#00A88F',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E1E1E',
        textAlign: 'center',
        marginBottom: 8,
    },
    cardMensagem: {
        fontSize: 14,
        color: '#555555',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    botaoLogin: {
        width: '100%',
        backgroundColor: '#00A88F',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    textoBotaoLogin: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});