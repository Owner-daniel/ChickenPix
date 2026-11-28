
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import TelaFluxo from '../../src/components/telaFluxo';
import CampoTexto from '../../src/components/campoTexto';
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

            Alert.alert(
                'Conta criada!',
                'Seu cadastro foi concluído. Agora faça login para acessar sua conta.',
                [
                    {
                        text: 'Ir para Login',
                        onPress: () => {
                            limparCadastro();
                            router.replace('/login');
                        },
                    },
                ]
            );
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
        <TelaFluxo
            titulo={'Está acabando...\nCrie uma senha para sua conta'}
            onVoltar={() => router.back()}
            onAvancar={finalizarCadastro}
        >
            <CampoTexto
                placeholder="Digite sua senha"
                value={dados.senha}
                onChangeText={(texto) => {
                    setErroSenha('');
                    atualizarDados({ senha: texto });
                }}
                secureTextEntry
                erro={erroSenha}
            />

            <CampoTexto
                placeholder="Confirme sua senha"
                value={confirmacao}
                onChangeText={(texto) => {
                    setErroConfirmacao('');
                    setConfirmacao(texto);
                }}
                secureTextEntry
                erro={erroConfirmacao}
            />
        </TelaFluxo>
    );
}