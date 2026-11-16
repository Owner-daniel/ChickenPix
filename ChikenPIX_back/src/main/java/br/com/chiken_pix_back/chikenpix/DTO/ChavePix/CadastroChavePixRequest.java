package br.com.chiken_pix_back.chikenpix.DTO.ChavePix;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CadastroChavePixRequest {
    private String tipo;
    private String chave;
    private String numConta;
}
