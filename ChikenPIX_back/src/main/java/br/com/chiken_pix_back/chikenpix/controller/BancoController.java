package br.com.chiken_pix_back.chikenpix.controller;

import br.com.chiken_pix_back.chikenpix.model.Banco;
import br.com.chiken_pix_back.chikenpix.model.Usuario;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contas")
public class BancoController {

    private final Banco banco;

    public BancoController(Banco banco) {
        this.banco = banco;
    }

    @GetMapping("/{numeroConta}")
    public FrontIntegrationDTOs.ContaResponse buscarConta(@PathVariable String numeroConta) {
        return FrontIntegrationDTOs.ContaResponse.from(banco.getConta(numeroConta));
    }
}