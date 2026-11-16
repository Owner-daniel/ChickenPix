package br.com.chiken_pix_back.chikenpix.DTO.ChavePix;

import br.com.chiken_pix_back.chikenpix.enumerations.TipoChavePix;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RemoverChavePixRequest {
    private TipoChavePix tipo;
    private String numConta;
}
