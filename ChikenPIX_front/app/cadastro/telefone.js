import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import TelaFluxo from '../../src/components/telaFluxo';
import CampoTexto from '../../src/components/campoTexto';
import LinkVerde from '../../src/components/linkVerde';
import { useCadastro } from '../../src/context/CadastroContext';
import { apenasNumeros, formatarTelefone } from '../../src/utils/validacoes';

export default function CadastroTelefone() {
    const router = useRouter();
    const { dados, atualizarDados } = useCadastro();
    const [erro, setErro] = useState('');

    function avancar() {
        const nums = apenasNumeros(dados.telefone);
        if (nums.length < 10 || nums.length > 11) {
            setErro('Digite um telefone válido com DDD.');
            return;
        }
        router.push('/cadastro/email');
    }

    return (
        <TelaFluxo
            titulo="Qual o seu número de telefone?"
            onVoltar={() => router.back()}
            onAvancar={avancar}
        >
            <CampoTexto
                placeholder="(00) 00000-0000"
                value={dados.telefone}
                onChangeText={(texto) => {
                    setErro('');
                    atualizarDados({ telefone: formatarTelefone(texto) });
                }}
                keyboardType="phone-pad"
                erro={erro}
            />

            <LinkVerde
                texto="Já tenho uma conta: Fazer login!"
                onPress={() => router.replace('/login')}
            />
        </TelaFluxo>
    );
}