import { apiRequest } from './api';

export function buscarConta(numeroConta) {
    return apiRequest(`/contas/${encodeURIComponent(numeroConta)}`);
}

export function buscarNotificacoes(numeroConta) {
    return apiRequest(`/api/notificacoes/${encodeURIComponent(numeroConta)}`);
}

export function listarTransacoes() {
    return apiRequest('/transacoes');
}

export function realizarPix({ origem, chaveDestino, valor, senha }) {
    return apiRequest('/pix', {
        method: 'POST',
        body: JSON.stringify({
            origem,
            chaveDestino,
            valor,
            senha,
        }),
    });
}

export function concluirTransacao(id) {
    return apiRequest(`/transacoes/${encodeURIComponent(id)}/concluir`, {
        method: 'PATCH',
    });
}