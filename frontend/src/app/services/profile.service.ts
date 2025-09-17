import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/profiles';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Buscar todos os perfis
  getAllProfiles(): Observable<Profile[]> {
    const headers = this.getHeaders();
    return this.http.get<Profile[]>(`${this.apiUrl}`, { headers });
  }

  // Buscar perfil por ID
  getProfileById(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Criar novo perfil (admin only)
  createProfile(profileData: Profile): Observable<Profile> {
    return this.http.post<Profile>(`${this.apiUrl}`, profileData, { headers: this.getHeaders() });
  }

  // Atualizar perfil (admin only)
  updateProfile(id: number, profileData: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${id}`, profileData, { headers: this.getHeaders() });
  }

  // Deletar perfil (admin only)
  deleteProfile(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
