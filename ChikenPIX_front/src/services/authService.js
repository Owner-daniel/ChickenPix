
import { apiRequest } from './api';

export function cadastrarUsuario(payload) {
    return apiRequest('/usuarios', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export function fazerLogin({ email, senha }) {
    return apiRequest('/usuarios/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
    });
}