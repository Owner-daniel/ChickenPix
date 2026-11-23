package br.com.chiken_pix_back.chikenpix.controller;

import br.com.chiken_pix_back.chikenpix.DTO.FrontIntegrationDTOs;
import br.com.chiken_pix_back.chikenpix.model.Banco;
import br.com.chiken_pix_back.chikenpix.model.ContaBancaria;
import br.com.chiken_pix_back.chikenpix.DTO.PixRequest;
import br.com.chiken_pix_back.chikenpix.model.Transacao;
import br.com.chiken_pix_back.chikenpix.service.PixService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pix")
public class PixController {

    private final Banco banco;
    private final PixService pixService;

    public PixController(Banco banco, PixService pixService) {
        this.banco = banco;
        this.pixService = pixService;
    }

    @PostMapping
    public FrontIntegrationDTOs.PixResponse realizarPix(@RequestBody PixRequest request) {
        Transacao transacao = pixService.realizarPix(
                request.getOrigem(),
                request.getChaveDestino(),
                request.getValor(),
                request.getSenha()
        );
        return FrontIntegrationDTOs.PixResponse.from(transacao);
    }
}