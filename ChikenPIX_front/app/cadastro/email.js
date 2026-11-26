import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import TelaFluxo from '../../src/components/telaFluxo';
import CampoTexto from '../../src/components/campoTexto';
import LinkVerde from '../../src/components/linkVerde';
import { useCadastro } from '../../src/context/CadastroContext';
import { validarEmail } from '../../src/utils/validacoes';

export default function CadastroEmail() {
    const router = useRouter();
    const { dados, atualizarDados } = useCadastro();
    const [erro, setErro] = useState('');

    function avancar() {
        const msgErro = validarEmail(dados.email);
        if (msgErro) {
            setErro(msgErro);
            return;
        }
        router.push('/cadastro/senha');
    }

    return (
        <TelaFluxo
            titulo="Qual o seu e-mail?"
            onVoltar={() => router.back()}
            onAvancar={avancar}
        >
            <CampoTexto
                placeholder="Digite o seu e-mail"
                value={dados.email}
                onChangeText={(texto) => {
                    setErro('');
                    atualizarDados({ email: texto });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                erro={erro}
            />

            <LinkVerde
                texto="Já tenho uma conta: Fazer login!"
                onPress={() => router.replace('/login')}
            />
        </TelaFluxo>
    );
}