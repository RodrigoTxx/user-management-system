export interface Profile {
  id?: number;
  name: string;
  description?: string;
}

export interface CreateProfileRequest {
  name: string;
  description?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  description?: string;
}