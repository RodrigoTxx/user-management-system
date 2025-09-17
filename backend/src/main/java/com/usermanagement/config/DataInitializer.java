package com.usermanagement.config;

import com.usermanagement.entity.Profile;
import com.usermanagement.entity.User;
import com.usermanagement.repository.ProfileRepository;
import com.usermanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        
        // Criar perfis padrão se não existirem
        if (profileRepository.count() == 0) {
            Profile adminProfile = new Profile("ADMIN", "Administrador do Sistema");
            Profile userProfile = new Profile("USER", "Usuário Comum");
            
            profileRepository.save(adminProfile);
            profileRepository.save(userProfile);
            
            // Criar usuário administrador padrão
            if (userRepository.count() == 0) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@sistema.com");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setFullName("Administrador do Sistema");
                adminUser.setPhone("(11) 99999-9999");
                adminUser.setProfile(adminProfile);
                adminUser.setActive(true);
                
                userRepository.save(adminUser);
                
                // Criar um usuário comum de exemplo
                User commonUser = new User();
                commonUser.setUsername("user");
                commonUser.setEmail("user@sistema.com");
                commonUser.setPassword(passwordEncoder.encode("user123"));
                commonUser.setFullName("Usuário Comum");
                commonUser.setPhone("(11) 88888-8888");
                commonUser.setProfile(userProfile);
                commonUser.setActive(true);
                
                userRepository.save(commonUser);
                
                System.out.println("===== DADOS INICIAIS CRIADOS =====");
                System.out.println("Admin - Usuário: admin | Senha: admin123");
                System.out.println("User  - Usuário: user  | Senha: user123");
                System.out.println("==================================");
            }
        }
    }
}