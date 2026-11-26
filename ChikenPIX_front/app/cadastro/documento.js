import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import TelaFluxo from '../../src/components/telaFluxo';
import CampoTexto from '../../src/components/campoTexto';
import LinkVerde from '../../src/components/linkVerde';
import { useCadastro } from '../../src/context/CadastroContext';
import {
    apenasNumeros,
    formatarCPF,
    formatarCNPJ,
} from '../../src/utils/validacoes';

export default function CadastroDocumento() {
    const router = useRouter();
    const { dados, atualizarDados } = useCadastro();
    const [erro, setErro] = useState('');

    const ehCpf = dados.tipoDocumento === 'CPF';

    function alternarTipo() {
        setErro('');
        atualizarDados({
            tipoDocumento: ehCpf ? 'CNPJ' : 'CPF',
            documento: '',
        });
    }

    function handleChange(texto) {
        setErro('');
        const formatado = ehCpf ? formatarCPF(texto) : formatarCNPJ(texto);
        atualizarDados({ documento: formatado });
    }

    function avancar() {
        const nums = apenasNumeros(dados.documento);
        if (ehCpf && nums.length !== 11) {
            setErro('O CPF deve conter 11 dígitos.');
            return;
        }
        if (!ehCpf && nums.length !== 14) {
            setErro('O CNPJ deve conter 14 dígitos.');
            return;
        }
        router.push('/cadastro/nome');
    }

    return (
        <TelaFluxo
            titulo={`Boas Vindas ao ChikenPix!\nPara começar qual o seu ${dados.tipoDocumento}?`}
            onAvancar={avancar}
        >
            <CampoTexto
                placeholder={`Digite o seu ${dados.tipoDocumento}`}
                value={dados.documento}
                onChangeText={handleChange}
                keyboardType="numeric"
                erro={erro}
            />

            <LinkVerde
                texto={ehCpf ? 'Utilizo CNPJ' : 'Utilizo CPF'}
                onPress={alternarTipo}
            />

            <LinkVerde
                texto="Já tenho uma conta: Fazer login!"
                onPress={() => router.replace('/login')}
            />
        </TelaFluxo>
    );
}