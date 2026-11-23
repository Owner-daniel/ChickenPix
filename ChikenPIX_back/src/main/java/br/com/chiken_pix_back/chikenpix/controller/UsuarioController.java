package br.com.chiken_pix_back.chikenpix.controller;

import br.com.chiken_pix_back.chikenpix.DTO.FrontIntegrationDTOs.LoginRequest;
import br.com.chiken_pix_back.chikenpix.DTO.FrontIntegrationDTOs.UsuarioLoginResponse;
import br.com.chiken_pix_back.chikenpix.model.Banco;
import br.com.chiken_pix_back.chikenpix.model.Usuario;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final Banco banco;

    public UsuarioController(Banco banco) {
        this.banco = banco;
    }

    public record CadastrarUsuarioRequest(
            String nome, String email, String cpf, String cnpj, String senha, String telefone) {}

    @PostMapping
    public Usuario cadastrar(@RequestBody CadastrarUsuarioRequest req) {
        return banco.cadastrarUsuario(req.nome(), req.email(), req.cpf(), req.senha(), req.cnpj(), req.telefone());
    }

    @PostMapping("/login")
    public UsuarioLoginResponse login(@RequestBody LoginRequest req) {
        Usuario usuario = banco.autenticarUsuario(req.email(), req.senha());
        return UsuarioLoginResponse.from(usuario);
    }

    public record AtualizarUsuarioRequest(
            String nome, String email, String senha, String telefone) {}

    @PutMapping("/{id}")
    public UsuarioLoginResponse atualizar(@PathVariable String id, @RequestBody AtualizarUsuarioRequest req) {
        Usuario atualizado = banco.atualizarUsuario(id, req.nome(), req.email(), req.senha(), req.telefone());
        return UsuarioLoginResponse.from(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable String id) {
        banco.removerUsuario(id);
        return ResponseEntity.noContent().build(); // retorna status 204 (sucesso sem conteúdo)
    }
}