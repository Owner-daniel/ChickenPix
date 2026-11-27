package br.com.chiken_pix_back.chikenpix.model;

import br.com.chiken_pix_back.chikenpix.enumerations.TipoChavePix;
import br.com.chiken_pix_back.chikenpix.exception.CNPJInvalidoException;
import br.com.chiken_pix_back.chikenpix.exception.CPFInvalidoException;
import br.com.chiken_pix_back.chikenpix.exception.EmailInvalidoException;
import br.com.chiken_pix_back.chikenpix.exception.TelefoneInvalidoException;

public final class ChavePixValidation {

    private ChavePixValidation() {}

    /**
     * Valida a chave e devolve o valor normalizado, que deve ser o usado para salvar e buscar.
     */
    public static String validar(TipoChavePix tipo, String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor da chave Pix não pode ser vazio.");
        }

        return switch (tipo) {
            case CPF -> validarCpf(valor);
            case CNPJ -> validarCnpj(valor);
            case EMAIL -> validarEmail(valor);
            case TELEFONE -> validarTelefone(valor);
            case ALEATORIA -> throw new IllegalStateException(
                    "Chave aleatória não deve passar por validação manual — use gerarChaveAleatoria().");
        };
    }

    private static String validarCpf(String valor) {
        String cpf = valor.replaceAll("\\D", "");
        if (!cpf.matches("\\d{11}")) {
            throw new CPFInvalidoException("CPF inválido para chave Pix.");
        }
        return cpf;
    }

    private static String validarCnpj(String valor) {
        String cnpj = valor.replaceAll("\\D", "");
        if (!cnpj.matches("\\d{14}")) {
            throw new CNPJInvalidoException("CNPJ inválido para chave Pix.");
        }
        return cnpj;
    }

    private static String validarEmail(String valor) {
        String email = valor.trim().toLowerCase();
        if (!email.matches("^[a-z0-9+_.-]+@[a-z0-9-]+(\\.[a-z0-9-]+)+$")) {
            throw new EmailInvalidoException("E-mail inválido para chave Pix.");
        }
        return email;
    }

    private static String validarTelefone(String valor) {
        // Remove espaços, parênteses, hífens e pontos da máscara
        String telefone = valor.replaceAll("[\\s()\\-.]", "");
        if (!telefone.matches("^\\+?\\d{10,13}$")) {
            throw new TelefoneInvalidoException("Telefone inválido para chave Pix.");
        }
        return telefone;
    }
}