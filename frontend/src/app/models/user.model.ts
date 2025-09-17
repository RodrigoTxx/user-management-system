import { Profile } from './profile.model';

export interface User {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  active: boolean;
  profileId: number;
  profile?: Profile;
  profileName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  profileId: number;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  profileId?: number;
  active?: boolean;
}