package com.usermanagement.service;

import com.usermanagement.dto.CreateUserDto;
import com.usermanagement.dto.UserDto;
import com.usermanagement.entity.Profile;
import com.usermanagement.entity.User;
import com.usermanagement.repository.ProfileRepository;
import com.usermanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<UserDto> getActiveUsers() {
        return userRepository.findActiveUsers().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public UserDto createUser(CreateUserDto createUserDto) {
        // Verificar se username já existe
        if (userRepository.existsByUsername(createUserDto.getUsername())) {
            throw new RuntimeException("Nome de usuário já existe");
        }
        
        // Verificar se email já existe
        if (userRepository.existsByEmail(createUserDto.getEmail())) {
            throw new RuntimeException("Email já existe");
        }
        
        // Buscar o perfil
        Profile profile = profileRepository.findById(createUserDto.getProfileId())
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));
        
        // Criar novo usuário
        User user = new User();
        user.setUsername(createUserDto.getUsername());
        user.setEmail(createUserDto.getEmail());
        user.setPassword(passwordEncoder.encode(createUserDto.getPassword()));
        user.setFullName(createUserDto.getFullName());
        user.setPhone(createUserDto.getPhone());
        user.setProfile(profile);
        user.setActive(true);
        
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }
    
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Verificar se username já existe em outro usuário
        if (!user.getUsername().equals(userDto.getUsername()) && 
            userRepository.existsByUsername(userDto.getUsername())) {
            throw new RuntimeException("Nome de usuário já existe");
        }
        
        // Verificar se email já existe em outro usuário
        if (!user.getEmail().equals(userDto.getEmail()) && 
            userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email já existe");
        }
        
        // Atualizar dados
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setFullName(userDto.getFullName());
        user.setPhone(userDto.getPhone());
        user.setActive(userDto.getActive());
        
        // Atualizar perfil se necessário
        if (userDto.getProfileId() != null && 
            !userDto.getProfileId().equals(user.getProfile().getId())) {
            Profile profile = profileRepository.findById(userDto.getProfileId())
                    .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));
            user.setProfile(profile);
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }
    
    public UserDto updateUserProfile(Long userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Usuário comum só pode editar seus próprios dados, menos o perfil
        user.setFullName(userDto.getFullName());
        user.setPhone(userDto.getPhone());
        
        // Verificar email apenas se foi alterado
        if (!user.getEmail().equals(userDto.getEmail())) {
            if (userRepository.existsByEmail(userDto.getEmail())) {
                throw new RuntimeException("Email já existe");
            }
            user.setEmail(userDto.getEmail());
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        userRepository.delete(user);
    }
    
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        user.setActive(false);
        userRepository.save(user);
    }
    
    public List<UserDto> getUsersByProfile(String profileName) {
        return userRepository.findByProfileName(profileName).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<UserDto> searchUsers(String name) {
        return userRepository.findByNameContaining(name).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setActive(user.getActive());
        dto.setProfileId(user.getProfile().getId());
        dto.setProfileName(user.getProfile().getName());
        return dto;
    }
}