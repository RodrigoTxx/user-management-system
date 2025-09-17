package com.usermanagement.service;

import com.usermanagement.entity.Profile;
import com.usermanagement.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {
    
    @Autowired
    private ProfileRepository profileRepository;
    
    public List<Profile> getAllProfiles() {
        return profileRepository.findAllOrderByName();
    }
    
    public Optional<Profile> getProfileById(Long id) {
        return profileRepository.findById(id);
    }
    
    public Optional<Profile> getProfileByName(String name) {
        return profileRepository.findByName(name);
    }
    
    public Profile createProfile(Profile profile) {
        if (profileRepository.existsByName(profile.getName())) {
            throw new RuntimeException("Perfil com este nome já existe");
        }
        return profileRepository.save(profile);
    }
    
    public Profile updateProfile(Long id, Profile profileDetails) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));
        
        // Verificar se o nome já existe em outro perfil
        if (!profile.getName().equals(profileDetails.getName()) && 
            profileRepository.existsByName(profileDetails.getName())) {
            throw new RuntimeException("Perfil com este nome já existe");
        }
        
        profile.setName(profileDetails.getName());
        profile.setDescription(profileDetails.getDescription());
        
        return profileRepository.save(profile);
    }
    
    public void deleteProfile(Long id) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));
        
        if (!profile.getUsers().isEmpty()) {
            throw new RuntimeException("Não é possível excluir um perfil que possui usuários associados");
        }
        
        profileRepository.delete(profile);
    }
    
    public boolean existsByName(String name) {
        return profileRepository.existsByName(name);
    }
}