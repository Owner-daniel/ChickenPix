export function apenasNumeros(texto) {
    return (texto || '').replace(/\D/g, '');
}

export function formatarCPF(texto) {
    const nums = apenasNumeros(texto).slice(0, 11);
    return nums
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatarCNPJ(texto) {
    const nums = apenasNumeros(texto).slice(0, 14);
    return nums
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
}

export function formatarTelefone(texto) {
    const nums = apenasNumeros(texto).slice(0, 11);
    if (nums.length <= 2) return nums;
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
}

export function validarNome(nome) {
    const limpo = (nome || '').trim();
    if (limpo.length < 3 || limpo.length > 100) {
        return 'O nome deve ter entre 3 e 100 caracteres.';
    }
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(limpo)) {
        return 'O nome deve conter apenas letras.';
    }
    return '';
}

export function validarEmail(email) {
    const limpo = (email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpo)) {
        return 'Digite um e-mail válido.';
    }
    return '';
}

export function validarSenha(senha) {
    if (!senha || senha.length < 8) {
        return 'A senha deve ter no mínimo 8 caracteres.';
    }
    if (!/[A-Z]/.test(senha)) {
        return 'Inclua pelo menos uma letra maiúscula.';
    }
    if (!/[a-z]/.test(senha)) {
        return 'Inclua pelo menos uma letra minúscula.';
    }
    if (!/[0-9]/.test(senha)) {
        return 'Inclua pelo menos um número.';
    }
    if (!/[@#$%^&+=!]/.test(senha)) {
        return 'Inclua pelo menos um símbolo (@#$%^&+=!).';
    }
    return '';
}