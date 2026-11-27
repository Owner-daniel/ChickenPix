package br.com.chiken_pix_back.chikenpix.DTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class DepositoRequest {
    private String numeroConta;
    private BigDecimal valor;
}
