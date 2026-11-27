package br.com.chiken_pix_back.chikenpix.controller;

import br.com.chiken_pix_back.chikenpix.DTO.FrontIntegrationDTOs.NotificacaoTransacaoResponse;
import br.com.chiken_pix_back.chikenpix.service.NotificacaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    public NotificacaoController(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @GetMapping("/{numeroConta}")
    public List<NotificacaoTransacaoResponse> listar(@PathVariable String numeroConta) {
        return notificacaoService.listarNotificacoes(numeroConta)
                .stream()
                .map(t -> NotificacaoTransacaoResponse.from(t, numeroConta))
                .toList();
    }
}