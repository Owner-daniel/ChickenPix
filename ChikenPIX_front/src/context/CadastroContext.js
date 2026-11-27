import React, { createContext, useContext, useState } from 'react';
import { apenasNumeros } from '../utils/validacoes';

const CadastroContext = createContext(null);

export function CadastroProvider({ children }) {
    const [dados, setDados] = useState({
        tipoDocumento: 'CPF', // 'CPF' ou 'CNPJ'
        documento: '',
        nome: '',
        telefone: '',
        email: '',
        senha: '',
    });

    function atualizarDados(novosCampos) {
        setDados((anterior) => ({ ...anterior, ...novosCampos }));
    }

    function limparCadastro() {
        setDados({
            tipoDocumento: 'CPF',
            documento: '',
            nome: '',
            telefone: '',
            email: '',
            senha: '',
        });
    }

    // Monta o objeto no formato exato que o back-end vai esperar depois
    function montarPayload() {
        const docLimpo = apenasNumeros(dados.documento);
        return {
            nome: dados.nome.trim(),
            email: dados.email.trim(),
            telefone: apenasNumeros(dados.telefone),
            cpf: dados.tipoDocumento === 'CPF' ? docLimpo : null,
            cnpj: dados.tipoDocumento === 'CNPJ' ? docLimpo : null,
            senha: dados.senha,
        };
    }

    return (
        <CadastroContext.Provider
            value={{ dados, atualizarDados, limparCadastro, montarPayload }}
        >
            {children}
        </CadastroContext.Provider>
    );
}

export function useCadastro() {
    const contexto = useContext(CadastroContext);
    if (!contexto) {
        throw new Error('useCadastro deve ser usado dentro de CadastroProvider');
    }
    return contexto;
}