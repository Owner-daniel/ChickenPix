package br.com.chiken_pix_back.chikenpix.controller;

import br.com.chiken_pix_back.chikenpix.DTO.ChavePix.CadastroChavePixRequest;
import br.com.chiken_pix_back.chikenpix.DTO.ChavePix.RemoverChavePixRequest;
import br.com.chiken_pix_back.chikenpix.DTO.FrontIntegrationDTOs;
import br.com.chiken_pix_back.chikenpix.enumerations.TipoChavePix;
import br.com.chiken_pix_back.chikenpix.model.Banco;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chavespix")
public class ChavePixController {

    private final Banco banco;

    public ChavePixController(Banco banco) {
        this.banco = banco;
    }

    @GetMapping("/conta/{numeroConta}")
    public List<FrontIntegrationDTOs.ChavePixResponse> listarPorConta(@PathVariable String numeroConta) {
        return banco.getConta(numeroConta).getChavesPix()
                .stream()
                .map(FrontIntegrationDTOs.ChavePixResponse::from)
                .toList();
    }

    @PostMapping("/cadastrar")
    public void cadastrarChavePix(@RequestBody CadastroChavePixRequest req) {
        if (req.getTipo() == null) {
            throw new IllegalArgumentException("O tipo da chave Pix é obrigatório.");
        }

        TipoChavePix tipo = switch (req.getTipo().trim().toLowerCase()) {
            case "email" -> TipoChavePix.EMAIL;
            case "telefone" -> TipoChavePix.TELEFONE;
            case "cpf" -> TipoChavePix.CPF;
            case "cnpj" -> TipoChavePix.CNPJ;
            case "aleatoria" -> TipoChavePix.ALEATORIA;
            default -> throw new IllegalArgumentException("Tipo de chave Pix inválido: " + req.getTipo());
        };

        banco.cadastrarChavePix(tipo, req.getChave(), req.getNumConta());
    }

    @DeleteMapping("/remover")
    public void removerChavePix(@RequestBody RemoverChavePixRequest req) {
        banco.removerChavePix(req.getTipo(), req.getNumConta());
    }
}