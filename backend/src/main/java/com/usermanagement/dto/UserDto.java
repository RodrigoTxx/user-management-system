package com.usermanagement.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class UserDto {
    
    private Long id;
    
    @NotBlank(message = "Nome de família é obrigatório")
    @Size(min = 3, max = 50, message = "Nome de família deve ter entre 3 e 50 caracteres")
    private String username; // Nome de Família
    
    @NotBlank(message = "Nome do personagem é obrigatório")
    @Size(min = 3, max = 50, message = "Nome do personagem deve ter entre 3 e 50 caracteres")
    private String characterName;
    
    private Boolean active;
    
    @NotNull(message = "Perfil é obrigatório")
    private Long profileId;
    
    private String profileName;
    
    // Campos específicos do Black Desert Online
    private Integer attackPower = 0; // AP
    private Integer awakeningAttackPower = 0; // APP
    private Integer defensePower = 0; // DP
    private Integer gearScore = 0; // GS - calculado automaticamente
    
    @Size(max = 50, message = "Classe deve ter no máximo 50 caracteres")
    private String characterClass;
    
    @Size(max = 20, message = "Tipo da classe deve ter no máximo 20 caracteres")
    private String classType; // Awakening, Succession, Ascension
    
    // Constructors
    public UserDto() {}
    
    public UserDto(String username, String characterName, Long profileId) {
        this.username = username;
        this.characterName = characterName;
        this.profileId = profileId;
        this.active = true;
        this.attackPower = 0;
        this.awakeningAttackPower = 0;
        this.defensePower = 0;
        this.gearScore = 0;
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
    

    
    public Boolean getActive() {
        return active;
    }
    
    public void setActive(Boolean active) {
        this.active = active;
    }
    
    public Long getProfileId() {
        return profileId;
    }
    
    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }
    
    public String getProfileName() {
        return profileName;
    }
    
    public void setProfileName(String profileName) {
        this.profileName = profileName;
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
    
    // Método para calcular automaticamente o Gear Score: (AP + APP/2) + DP
    public void calculateGearScore() {
        if (this.attackPower == null) this.attackPower = 0;
        if (this.awakeningAttackPower == null) this.awakeningAttackPower = 0;
        if (this.defensePower == null) this.defensePower = 0;
        
        this.gearScore = (this.attackPower + (this.awakeningAttackPower / 2)) + this.defensePower;
    }
}