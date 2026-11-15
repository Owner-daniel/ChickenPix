package br.com.chiken_pix_back.chikenpix.utils;

import java.util.concurrent.ThreadLocalRandom;

public class GeradorConta {

    public static String gerarNumeroConta() {
        int numeroBase = ThreadLocalRandom.current().nextInt(100000, 1000000);
        int digitoVerificador = calcularDigitoVerificador(numeroBase);
        return numeroBase + "-" + digitoVerificador;
    }

    private static int calcularDigitoVerificador(int numero) {
        int soma = 0;
        int peso = 2;

        while (numero > 0) {
            int digito = numero % 10;
            soma += digito * peso;
            numero /= 10;
            peso++;
        }

        int resto = soma % 11;
        int dv = 11 - resto;

        return (dv >= 10) ? 0 : dv;
    }
}
