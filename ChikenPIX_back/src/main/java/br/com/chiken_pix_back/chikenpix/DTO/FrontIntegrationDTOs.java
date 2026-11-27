package br.com.chiken_pix_back.chikenpix.DTO;

import br.com.chiken_pix_back.chikenpix.enumerations.StatusConta;
import br.com.chiken_pix_back.chikenpix.enumerations.StatusTransacao;
import br.com.chiken_pix_back.chikenpix.enumerations.TipoChavePix;
import br.com.chiken_pix_back.chikenpix.model.ChavePix;
import br.com.chiken_pix_back.chikenpix.model.ContaBancaria;
import br.com.chiken_pix_back.chikenpix.model.Transacao;
import br.com.chiken_pix_back.chikenpix.model.Usuario;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public final class FrontIntegrationDTOs {

    private FrontIntegrationDTOs() {}

    public record LoginRequest(String email, String senha) {}

    public record ContaResponse(
            String numeroConta,
            String numeroAgencia,
            String nomeBanco,
            BigDecimal saldo,
            StatusConta status
    ) {
        public static ContaResponse from(ContaBancaria c) {
            return new ContaResponse(
                    c.getNumeroConta(),
                    c.getNumeroAgencia(),
                    c.getNomeBanco(),
                    c.getSaldo(),
                    c.getStatus()
            );
        }
    }

    public record UsuarioLoginResponse(
            String id,
            String nome,
            String email,
            String cpf,
            String cnpj,
            String telefone,
            ContaResponse conta
    ) {
        public static UsuarioLoginResponse from(Usuario u) {
            return new UsuarioLoginResponse(
                    u.getId(),
                    u.getNome(),
                    u.getEmail(),
                    u.getCpf(),
                    u.getCnpj(),
                    u.getTelefone(),
                    u.getConta() != null ? ContaResponse.from(u.getConta()) : null
            );
        }
    }

    public record ChavePixResponse(
            Long id,
            TipoChavePix tipo,
            String chave
    ) {
        public static ChavePixResponse from(ChavePix c) {
            return new ChavePixResponse(c.getId(), c.getTipoChave(), c.getChave());
        }
    }

    public record PixResponse(
            String transacaoId,
            StatusTransacao status,
            BigDecimal valor,
            LocalDateTime dataHora
    ) {
        public static PixResponse from(Transacao t) {
            return new PixResponse(t.getId(), t.getStatus(), t.getValor(), t.getDataHora());
        }
    }

    public record NotificacaoTransacaoResponse(
            String id,
            BigDecimal valor,
            StatusTransacao status,
            LocalDateTime dataHora,
            String direcao,
            String contraparteNome,
            String contraparteConta
    ) {
        public static NotificacaoTransacaoResponse from(Transacao t, String numeroContaLogada) {
            boolean enviada = t.getOrigem() != null
                    && numeroContaLogada.equals(t.getOrigem().getNumeroConta());
            ContaBancaria contraparte = enviada ? t.getDestino() : t.getOrigem();
            String nome = (contraparte != null && contraparte.getUsuario() != null)
                    ? contraparte.getUsuario().getNome()
                    : "Usuário ChickenPix";
            String conta = contraparte != null ? contraparte.getNumeroConta() : "";

            return new NotificacaoTransacaoResponse(
                    t.getId(),
                    t.getValor(),
                    t.getStatus(),
                    t.getDataHora(),
                    enviada ? "ENVIADO" : "RECEBIDO",
                    nome,
                    conta
            );
        }
    }
}