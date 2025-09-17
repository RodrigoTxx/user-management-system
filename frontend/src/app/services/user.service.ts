import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

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

  // Buscar todos os usuários (admin only)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  // Buscar usuários ativos (admin only)
  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/active`, { headers: this.getHeaders() });
  }

  // Buscar usuário por ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Criar novo usuário (admin only)
  createUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, userData, { headers: this.getHeaders() });
  }

  // Atualizar usuário (admin only)
  updateUser(id: number, userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData, { headers: this.getHeaders() });
  }

  // Deletar usuário (admin only)
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Desativar usuário (admin only)
  deactivateUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/deactivate`, {}, { headers: this.getHeaders() });
  }

  // Buscar usuários por perfil (admin only)
  getUsersByProfile(profileName: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/profile/${profileName}`, { headers: this.getHeaders() });
  }

  // Pesquisar usuários (admin only)
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?name=${encodeURIComponent(query)}`, { headers: this.getHeaders() });
  }

  // Definir usuário atual
  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Buscar próprio perfil do usuário logado
  getMyProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, { headers: this.getHeaders() });
  }

  // Atualizar próprio perfil
  updateMyProfile(userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, userData, { headers: this.getHeaders() });
  }
}
