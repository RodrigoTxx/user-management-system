package com.usermanagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nome de família é obrigatório")
    @Size(min = 3, max = 50, message = "Nome de família deve ter entre 3 e 50 caracteres")
    @Column(unique = true, nullable = false)
    private String username; // Nome de Família
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
    @JsonIgnore
    private String password;
    
    @NotBlank(message = "Nome do personagem é obrigatório")
    @Size(min = 3, max = 50, message = "Nome do personagem deve ter entre 3 e 50 caracteres")
    @Column(nullable = false)
    private String characterName;
    
    // Campos específicos do Black Desert Online
    @Column(name = "attack_power")
    private Integer attackPower = 0; // AP
    
    @Column(name = "awakening_attack_power")
    private Integer awakeningAttackPower = 0; // APP
    
    @Column(name = "defense_power")
    private Integer defensePower = 0; // DP
    
    @Column(name = "gear_score")
    private Integer gearScore = 0; // GS - calculado automaticamente
    
    @Size(max = 50, message = "Classe deve ter no máximo 50 caracteres")
    private String characterClass;
    
    @Size(max = 20, message = "Tipo da classe deve ter no máximo 20 caracteres")
    private String classType; // Awakening, Succession, Ascension
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;
    
    // Constructors
    public User() {}
    
    public User(String username, String password, String characterName, Profile profile) {
        this.username = username;
        this.password = password;
        this.characterName = characterName;
        this.profile = profile;
        calculateGearScore();
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateGearScore();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateGearScore();
    }
    
    // Método para calcular automaticamente o Gear Score: (AP + AAP) / 2 + DP
    public void calculateGearScore() {
        if (this.attackPower == null) this.attackPower = 0;
        if (this.awakeningAttackPower == null) this.awakeningAttackPower = 0;
        if (this.defensePower == null) this.defensePower = 0;
        
        this.gearScore = (this.attackPower + this.awakeningAttackPower) / 2 + this.defensePower;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public Boolean getActive() {
        return active;
    }
    
    public void setActive(Boolean active) {
        this.active = active;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Profile getProfile() {
        return profile;
    }
    
    public void setProfile(Profile profile) {
        this.profile = profile;
    }
    
    public String getCharacterName() {
        return characterName;
    }
    
    public void setCharacterName(String characterName) {
        this.characterName = characterName;
    }
    
    public Integer getAttackPower() {
        return attackPower;
    }
    
    public void setAttackPower(Integer attackPower) {
        this.attackPower = attackPower;
        calculateGearScore();
    }
    
    public Integer getAwakeningAttackPower() {
        return awakeningAttackPower;
    }
    
    public void setAwakeningAttackPower(Integer awakeningAttackPower) {
        this.awakeningAttackPower = awakeningAttackPower;
        calculateGearScore();
    }
    
    public Integer getDefensePower() {
        return defensePower;
    }
    
    public void setDefensePower(Integer defensePower) {
        this.defensePower = defensePower;
        calculateGearScore();
    }
    
    public Integer getGearScore() {
        return gearScore;
    }
    
    public void setGearScore(Integer gearScore) {
        // GS é calculado automaticamente, mas mantemos o setter para JPA
        this.gearScore = gearScore;
    }
    
    public String getCharacterClass() {
        return characterClass;
    }
    
    public void setCharacterClass(String characterClass) {
        this.characterClass = characterClass;
    }
    
    public String getClassType() {
        return classType;
    }
    
    public void setClassType(String classType) {
        this.classType = classType;
    }
    
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", characterName='" + characterName + '\'' +
                ", characterClass='" + characterClass + '\'' +
                ", classType='" + classType + '\'' +
                ", gearScore=" + gearScore +
                ", active=" + active +
                ", profile=" + (profile != null ? profile.getName() : null) +
                '}';
    }
}