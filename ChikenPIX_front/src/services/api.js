export const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || 'http:// 10.10.251.83:8081';

export async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    const rawText = await response.text();
    let parsedData = null;

    if (rawText) {
        try {
            parsedData = JSON.parse(rawText);
        } catch {
            parsedData = rawText;
        }
    }

    if (!response.ok) {
        const errorMessage =
            (parsedData && typeof parsedData === 'object' && (parsedData.message || parsedData.error)) ||
            (typeof parsedData === 'string' && parsedData) ||
            `Erro na requisição (HTTP ${response.status})`;

        throw new Error(errorMessage);
    }

    return parsedData;
}