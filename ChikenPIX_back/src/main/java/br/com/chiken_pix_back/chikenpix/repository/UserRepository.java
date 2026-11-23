package br.com.chiken_pix_back.chikenpix.repository;

import br.com.chiken_pix_back.chikenpix.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Usuario, String>{
    Optional<Usuario> findByEmail(String email);
}