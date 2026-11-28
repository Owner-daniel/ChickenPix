
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import TelaFluxo from '../src/components/telaFluxo';
import CampoTexto from '../src/components/campoTexto';
import LinkVerde from '../src/components/linkVerde';
import { fazerLogin } from '../src/services/authService';
import { useSessao } from '../src/context/SessaoContext';
import { validarEmail } from '../src/utils/validacoes';

export default function Login() {
    const router = useRouter();
    const { iniciarSessao } = useSessao();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erroEmail, setErroEmail] = useState('');
    const [erroSenha, setErroSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function entrar() {
        if (carregando) return;

        const emailLimpo = email.trim();
        const msgEmail = validarEmail(emailLimpo);
        if (msgEmail) {
            setErroEmail(msgEmail);
            return;
        }
        if (!senha) {
            setErroSenha('Digite sua senha.');
            return;
        }

        setCarregando(true);
        try {
            const usuarioLogado = await fazerLogin({ email: emailLimpo, senha });
            iniciarSessao(usuarioLogado);

            const numeroConta = usuarioLogado?.conta?.numeroConta || '';
            setSenha('');

            router.replace({
                pathname: '/home',
                params: numeroConta ? { numeroConta } : {},
            });
        } catch (error) {
            Alert.alert(
                'Falha no login',
                error?.message || 'Não foi possível entrar. Verifique e-mail e senha.'
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <TelaFluxo
            titulo="Bem vindo de volta!"
            onAvancar={entrar}
            carregando={carregando}
        >
            <CampoTexto
                placeholder="Digite o seu e-mail"
                value={email}
                onChangeText={(texto) => {
                    setErroEmail('');
                    setEmail(texto);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                erro={erroEmail}
            />

            <CampoTexto
                placeholder="Digite a sua senha"
                value={senha}
                onChangeText={(texto) => {
                    setErroSenha('');
                    setSenha(texto);
                }}
                secureTextEntry
                erro={erroSenha}
            />

            <LinkVerde
                texto="Esqueci a senha"
                onPress={() => {}}
            />

            <LinkVerde
                texto="Ainda não tenho conta: Criar conta!"
                onPress={() => router.replace('/cadastro/documento')}
            />
        </TelaFluxo>
    );
}