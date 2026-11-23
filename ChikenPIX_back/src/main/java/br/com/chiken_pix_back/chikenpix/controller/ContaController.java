package br.com.chiken_pix_back.chikenpix.controller;

import br.com.chiken_pix_back.chikenpix.DTO.FrontIntegrationDTOs;
import br.com.chiken_pix_back.chikenpix.model.Banco;
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
}
