import React, { createContext, useContext, useState } from 'react';

const SessaoContext = createContext(null);

export function SessaoProvider({ children }) {
    const [sessao, setSessao] = useState(null);

    function iniciarSessao(respostaLogin) {
        if (!respostaLogin) return;

        // Garante que nenhum campo sensível como 'senha' entre na sessão
        const { senha: _senhaIgnorada, ...dadosLimpos } = respostaLogin;
        setSessao(dadosLimpos);
    }

    function encerrarSessao() {
        setSessao(null);
    }

    return (
        <SessaoContext.Provider value={{ sessao, iniciarSessao, encerrarSessao }}>
            {children}
        </SessaoContext.Provider>
    );
}

export function useSessao() {
    const contexto = useContext(SessaoContext);
    if (!contexto) {
        throw new Error('useSessao deve ser usado dentro de SessaoProvider');
    }
    return contexto;
}