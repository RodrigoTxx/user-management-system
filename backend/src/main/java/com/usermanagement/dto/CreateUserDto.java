package com.usermanagement.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateUserDto {
    
    @NotBlank(message = "Nome de família é obrigatório")
    @Size(min = 3, max = 50, message = "Nome de família deve ter entre 3 e 50 caracteres")
    private String username; // Nome de Família
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
    private String password;
    
    @NotBlank(message = "Nome do personagem é obrigatório")
    @Size(min = 3, max = 50, message = "Nome do personagem deve ter entre 3 e 50 caracteres")
    private String characterName;
    
    private Long profileId;
    
    // Campos específicos do Black Desert Online
    private Integer attackPower = 0; // AP
    private Integer awakeningAttackPower = 0; // APP  
    private Integer defensePower = 0; // DP
    
    @Size(max = 50, message = "Classe deve ter no máximo 50 caracteres")
    private String characterClass;
    
    @Size(max = 20, message = "Tipo da classe deve ter no máximo 20 caracteres")
    private String classType; // Awakening, Succession, Ascension
    
    // Constructors
    public CreateUserDto() {}
    
    public CreateUserDto(String username, String password, String characterName, Long profileId) {
        this.username = username;
        this.password = password;
        this.characterName = characterName;
        this.profileId = profileId;
        this.attackPower = 0;
        this.awakeningAttackPower = 0;
        this.defensePower = 0;
    }
    
    // Getters and Setters
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
    
    public Long getProfileId() {
        return profileId;
    }
    
    public void setProfileId(Long profileId) {
        this.profileId = profileId;
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
    }
    
    public Integer getAwakeningAttackPower() {
        return awakeningAttackPower;
    }
    
    public void setAwakeningAttackPower(Integer awakeningAttackPower) {
        this.awakeningAttackPower = awakeningAttackPower;
    }
    
    public Integer getDefensePower() {
        return defensePower;
    }
    
    public void setDefensePower(Integer defensePower) {
        this.defensePower = defensePower;
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
}