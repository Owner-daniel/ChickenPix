package br.com.chiken_pix_back.chikenpix.utils;

import br.com.chiken_pix_back.chikenpix.exception.ChaveNaoEncontradaException;
import br.com.chiken_pix_back.chikenpix.exception.ChavePixInvalidaException;
import br.com.chiken_pix_back.chikenpix.exception.ChavePixJaCadastradaException;
import br.com.chiken_pix_back.chikenpix.exception.IdNaoEncontradoException;
import br.com.chiken_pix_back.chikenpix.exception.ValorPixInvalidoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Collections;
import java.util.Map;

@RestControllerAdvice
public class TratamentoErrosHandler {

    @ExceptionHandler(ChavePixJaCadastradaException.class)
    public ResponseEntity<Map<String, String>> chaveDuplicada(RuntimeException ex) {
        return resposta(HttpStatus.CONFLICT, ex);
    }

    @ExceptionHandler({IdNaoEncontradoException.class, ChaveNaoEncontradaException.class})
    public ResponseEntity<Map<String, String>> naoEncontrado(RuntimeException ex) {
        return resposta(HttpStatus.NOT_FOUND, ex);
    }

    @ExceptionHandler({
            IllegalArgumentException.class,
            ChavePixInvalidaException.class,
            ValorPixInvalidoException.class
    })
    public ResponseEntity<Map<String, String>> requisicaoInvalida(RuntimeException ex) {
        return resposta(HttpStatus.BAD_REQUEST, ex);
    }

    // Collections.singletonMap aceita mensagem nula; Map.of lançaria NullPointerException.
    private ResponseEntity<Map<String, String>> resposta(HttpStatus status, RuntimeException ex) {
        String mensagem = ex.getMessage() != null ? ex.getMessage() : "Erro inesperado.";
        return ResponseEntity.status(status)
                .body(Collections.singletonMap("message", mensagem));
    }
}