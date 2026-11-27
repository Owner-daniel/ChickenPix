import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import TelaFluxo from '../../src/components/telaFluxo';
import CampoTexto from '../../src/components/campoTexto';
import LinkVerde from '../../src/components/linkVerde';
import { useCadastro } from '../../src/context/CadastroContext';
import { validarNome } from '../../src/utils/validacoes';

export default function CadastroNome() {
    const router = useRouter();
    const { dados, atualizarDados } = useCadastro();
    const [erro, setErro] = useState('');

    function avancar() {
        const msgErro = validarNome(dados.nome);
        if (msgErro) {
            setErro(msgErro);
            return;
        }
        router.push('/cadastro/telefone');
    }

    return (
        <TelaFluxo
            titulo="Qual o seu nome completo?"
            onVoltar={() => router.back()}
            onAvancar={avancar}
        >
            <CampoTexto
                placeholder="Digite o seu nome completo"
                value={dados.nome}
                onChangeText={(texto) => {
                    setErro('');
                    atualizarDados({ nome: texto });
                }}
                autoCapitalize="words"
                erro={erro}
            />

            <LinkVerde
                texto="Já tenho uma conta: Fazer login!"
                onPress={() => router.replace('/login')}
            />
        </TelaFluxo>
    );
}