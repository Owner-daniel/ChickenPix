package br.com.chiken_pix_back.chikenpix.controller;

import br.com.chiken_pix_back.chikenpix.enumerations.StatusTransacao;
import br.com.chiken_pix_back.chikenpix.model.Banco;
import br.com.chiken_pix_back.chikenpix.model.ContaBancaria;
import br.com.chiken_pix_back.chikenpix.model.RelatorioTransacoes;
import br.com.chiken_pix_back.chikenpix.model.Transacao;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/transacoes")
public class TransacaoController {

    private final Banco banco;

    public TransacaoController(Banco banco) {
        this.banco = banco;
    }

    @GetMapping
    public List<Transacao> listarTodas() {
        return banco.listarTransacoes();
    }

    @GetMapping("/filtro")
    public List<Transacao> filtrarPorData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return banco.filtrarTransacoesPorData(inicio, fim);
    }

    @GetMapping("/relatorio/usuario/{numeroConta}")
    public RelatorioTransacoes relatorioPorUsuario(@PathVariable String numeroConta) {
        ContaBancaria conta = banco.getConta(numeroConta);
        List<Transacao> lista = banco.gerarRelatorioPorUsuario(conta);
        return montarRelatorio(lista, numeroConta);
    }

    @GetMapping("/relatorio/periodo/{numeroConta}")
    public RelatorioTransacoes relatorioPorPeriodo(
            @PathVariable String numeroConta,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        if (inicio.isAfter(fim)) {
            throw new IllegalArgumentException("Data inicial não pode ser depois da data final.");
        }
        ContaBancaria conta = banco.getConta(numeroConta);
        List<Transacao> lista = banco.gerarRelatorioPorPeriodo(conta, inicio, fim);
        return montarRelatorio(lista, numeroConta);
    }

    private RelatorioTransacoes montarRelatorio(List<Transacao> lista, String numeroConta) {
        BigDecimal totalEnviado = lista.stream()
                .filter(t -> t.getStatus() == StatusTransacao.CONCLUIDA
                        && t.getOrigem() != null
                        && numeroConta.equals(t.getOrigem().getNumeroConta()))
                .map(Transacao::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRecebido = lista.stream()
                .filter(t -> t.getStatus() == StatusTransacao.CONCLUIDA
                        && t.getDestino() != null
                        && numeroConta.equals(t.getDestino().getNumeroConta()))
                .map(Transacao::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new RelatorioTransacoes(lista, totalEnviado, totalRecebido, lista.size());
    }

    @PatchMapping("/{id}/cancelar")
    public void cancelarTransacao(@PathVariable String id) {
        banco.cancelarTransacao(id);
    }

    @PatchMapping("/{id}/concluir")
    public void concluirTransacao(@PathVariable String id) {
        banco.concluirTransacao(id);
    }
}