package com.usermanagement.controller;

import com.usermanagement.config.JwtTokenUtil;
import com.usermanagement.dto.LoginDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto loginDto) {
        try {
            authenticate(loginDto.getUsername(), loginDto.getPassword());
            
            final UserDetails userDetails = userDetailsService.loadUserByUsername(loginDto.getUsername());
            final String token = jwtTokenUtil.generateToken(userDetails);
            
            // Obter o perfil do usuário
            String profileName = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                    .orElse("USER");
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("type", "Bearer");
            response.put("username", userDetails.getUsername());
            response.put("profileName", profileName);
            response.put("authorities", userDetails.getAuthorities());
            
            return ResponseEntity.ok(response);
            
        } catch (DisabledException e) {
            return ResponseEntity.badRequest().body("Usuário desabilitado");
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("Credenciais inválidas");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro na autenticação: " + e.getMessage());
        }
    }
    
    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}