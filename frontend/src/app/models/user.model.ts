import { Profile } from './profile.model';

export interface User {
  id?: number;
  username: string; // Nome de Família
  characterName: string; // Nome do Personagem
  active: boolean;
  profileId: number;
  profile?: Profile;
  profileName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Campos específicos do Black Desert Online
  attackPower?: number; // AP
  awakeningAttackPower?: number; // APP
  defensePower?: number; // DP
  gearScore?: number; // GS (calculado automaticamente)
  characterClass?: string; // Classe do personagem
  classType?: string; // Awakening, Succession, Ascension
}

export interface CreateUserRequest {
  username: string; // Nome de Família
  password: string;
  characterName: string; // Nome do Personagem
  profileId: number;
  
  // Campos específicos do Black Desert Online
  attackPower?: number;
  awakeningAttackPower?: number;
  defensePower?: number;
  characterClass?: string;
  classType?: string;
}

export interface UpdateUserRequest {
  username?: string; // Nome de Família
  characterName?: string; // Nome do Personagem
  profileId?: number;
  active?: boolean;
  
  // Campos específicos do Black Desert Online
  attackPower?: number;
  awakeningAttackPower?: number;
  defensePower?: number;
  characterClass?: string;
  classType?: string;
}

// Classes disponíveis no Black Desert Online
export interface BDOClass {
  name: string;
  availableTypes: string[]; // Awakening, Succession, Ascension
}

export const BDO_CLASSES: BDOClass[] = [
  { name: 'Warrior', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Ranger', availableTypes: ['Awakening', 'Succession']  },
  { name: 'Sorceress', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Berserker', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Tamer', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Musa', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Maehwa', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Valkyrie', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Kunoichi', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Ninja', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Witch', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Wizard', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Dark Knight', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Striker', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Mystic', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Lahn', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Archer', availableTypes: ['Ascension'] },
  { name: 'Shai', availableTypes: ['Ascension'] },
  { name: 'Guardian', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Hashashin', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Nova', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Sage', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Corsair', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Drakania', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Woosa', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Maegu', availableTypes: ['Awakening', 'Succession'] },
  { name: 'Scholar', availableTypes: [ 'Ascension'] },
  { name: 'Deadeye', availableTypes: [ 'Ascension']},
  { name: 'Wukong', availableTypes: [ 'Ascension'] }
];

// Função utilitária para calcular o Gear Score: (AP + AAP) / 2 + DP
export function calculateGearScore(ap: number = 0, app: number = 0, dp: number = 0): number {
  return Math.floor((ap + app) / 2) + dp;
}

// Função para obter tipos disponíveis para uma classe específica
export function getAvailableTypesForClass(className: string): string[] {
  const bdoClass = BDO_CLASSES.find(c => c.name === className);
  return bdoClass ? bdoClass.availableTypes : [];
}