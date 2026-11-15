package br.com.chiken_pix_back.chikenpix.DTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SaqueRequest {
    private String numeroConta;
    private BigDecimal valor;
    private String senhaConta;
}
