import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import TelaFluxo from '../src/components/telaFluxo';
import CampoTexto from '../src/components/campoTexto';
import LinkVerde from '../src/components/linkVerde';
import { validarEmail } from '../src/utils/validacoes';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erroEmail, setErroEmail] = useState('');
    const [erroSenha, setErroSenha] = useState('');

    function entrar() {
        const msgEmail = validarEmail(email);
        if (msgEmail) {
            setErroEmail(msgEmail);
            return;
        }
        if (!senha) {
            setErroSenha('Digite sua senha.');
            return;
        }

        // TODO(back): integrar com POST /usuarios/login quando o endpoint existir
        console.log('Login validado localmente para:', email);
        router.replace('/');
    }

    return (
        <TelaFluxo
            titulo="Bem vindo de volta!"
            onAvancar={entrar}
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