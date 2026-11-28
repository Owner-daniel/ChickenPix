const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.29.208.1:8081';

export async function fazerLogin({ email, senha }) {
    const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || data.mensagem || data.erro || 'E-mail ou senha inválidos.');
    }

    return data;
}