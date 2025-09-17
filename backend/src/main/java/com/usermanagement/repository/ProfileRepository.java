package com.usermanagement.repository;

import com.usermanagement.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    
    Optional<Profile> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT p FROM Profile p ORDER BY p.name")
    List<Profile> findAllOrderByName();
    
}