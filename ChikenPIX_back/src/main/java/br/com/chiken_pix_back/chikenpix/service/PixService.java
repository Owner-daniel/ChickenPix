package br.com.chiken_pix_back.chikenpix.service;

import br.com.chiken_pix_back.chikenpix.enumerations.TipoTransacao;
import br.com.chiken_pix_back.chikenpix.exception.ChaveNaoEncontradaException;
import br.com.chiken_pix_back.chikenpix.exception.ContaBloqueadaSuspeitaFraudeException;
import br.com.chiken_pix_back.chikenpix.exception.SenhaPixIncorretaException;
import br.com.chiken_pix_back.chikenpix.exception.ValorPixInvalidoException;
import br.com.chiken_pix_back.chikenpix.model.Banco;
import br.com.chiken_pix_back.chikenpix.model.ContaBancaria;
import br.com.chiken_pix_back.chikenpix.model.Transacao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class PixService {

    private final Banco banco;

    public PixService(Banco banco) {
        this.banco = banco;
    }

    @Transactional(noRollbackFor = {
            SenhaPixIncorretaException.class,
            ContaBloqueadaSuspeitaFraudeException.class
    })
    public void realizarPix(
            ContaBancaria origem,
            String chaveDestino,
            BigDecimal valor,
            String senha
    ) {
        realizarPix(origem != null ? origem.getNumeroConta() : null, chaveDestino, valor, senha);
    }

    @Transactional(noRollbackFor = {
            SenhaPixIncorretaException.class,
            ContaBloqueadaSuspeitaFraudeException.class
    })
    public Transacao realizarPix(
            String numeroContaOrigem,
            String chaveDestino,
            BigDecimal valor,
            String senha
    ) {
        ContaBancaria origem = banco.getConta(numeroContaOrigem);

        origem.validarSenha(senha);

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValorPixInvalidoException(
                    "Error: Valor inválido para realizar Pix."
            );
        }

        ContaBancaria destino = banco.buscarConta(chaveDestino);

        if (destino == null) {
            throw new ChaveNaoEncontradaException(
                    "Error: Chave Pix não encontrada."
            );
        }

        Transacao transacao = new Transacao(
                origem,
                destino,
                valor,
                TipoTransacao.PIX_ENVIADO
        );

        banco.addTransacao(transacao);
        return transacao;
    }
}