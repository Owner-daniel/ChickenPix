package br.com.chiken_pix_back.chikenpix.controller;

import br.com.chiken_pix_back.chikenpix.DTO.FrontIntegrationDTOs;
import br.com.chiken_pix_back.chikenpix.model.Banco;
import br.com.chiken_pix_back.chikenpix.model.ContaBancaria;
import br.com.chiken_pix_back.chikenpix.service.ContaService;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

import br.com.chiken_pix_back.chikenpix.DTO.SaqueRequest;
import br.com.chiken_pix_back.chikenpix.DTO.DepositoRequest;

@RestController
@RequestMapping("/contas")
public class ContaController {

    private final Banco banco;

    public ContaController(Banco banco, ContaService contaService) {
        this.banco = banco;
    }

    @GetMapping("/{numeroConta}")
    public FrontIntegrationDTOs.ContaResponse consultarConta(@PathVariable String numeroConta) {
        return FrontIntegrationDTOs.ContaResponse.from(banco.getConta(numeroConta));
    }

    @PostMapping("/depositar")
    public void depositar(@RequestBody DepositoRequest req) {
        banco.contaCreditar(req.getNumeroConta(), req.getValor());
    }

    @PostMapping("/sacar")
    public void sacar(@RequestBody SaqueRequest req) {
        banco.contaDebitar(req.getNumeroConta(), req.getValor(), req.getSenhaConta());
    }
    public record LimiteDiarioRequest(java.math.BigDecimal novoLimite) {}

    public record LimiteDiarioResponse(
            String numeroConta,
            java.math.BigDecimal limiteDiario,
            java.math.BigDecimal usadoHoje,
            java.math.BigDecimal disponivelHoje
    ) {
        public static LimiteDiarioResponse from(ContaBancaria c) {
            java.math.BigDecimal disponivel = c.getLimiteDiario().subtract(c.getUsadoHoje()).max(java.math.BigDecimal.ZERO);
            return new LimiteDiarioResponse(c.getNumeroConta(), c.getLimiteDiario(), c.getUsadoHoje(), disponivel);
        }
    }

    @GetMapping("/{numeroConta}/limite")
    public LimiteDiarioResponse consultarLimite(@PathVariable String numeroConta) {
        return LimiteDiarioResponse.from(banco.getConta(numeroConta));
    }

    @PatchMapping("/{numeroConta}/limite")
    public LimiteDiarioResponse definirLimite(
            @PathVariable String numeroConta,
            @RequestBody LimiteDiarioRequest req) {
        ContaBancaria atualizada = banco.definirLimiteDiario(numeroConta, req.novoLimite());
        return LimiteDiarioResponse.from(atualizada);
    }
}
