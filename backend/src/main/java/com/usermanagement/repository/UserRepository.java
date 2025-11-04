package com.usermanagement.repository;

import com.usermanagement.entity.Profile;
import com.usermanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    List<User> findByProfile(Profile profile);
    
    @Query("SELECT u FROM User u WHERE u.active = true")
    List<User> findActiveUsers();
    
    @Query("SELECT u FROM User u WHERE u.profile.name = :profileName")
    List<User> findByProfileName(@Param("profileName") String profileName);
    
    @Query("SELECT u FROM User u WHERE u.characterName LIKE %:name% OR u.username LIKE %:name%")
    List<User> findByNameContaining(@Param("name") String name);
    
}