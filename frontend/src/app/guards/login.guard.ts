import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para redirecionar usuários logados que tentam acessar login
 * Evita que usuários já autenticados vejam a tela de login
 */
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    // Se não estiver logado, pode acessar o login
    if (!this.authService.isLoggedIn()) {
      return true;
    }

    // Se estiver logado, redirecionar baseado no perfil
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/users']);
    } else {
      this.router.navigate(['/profile']);
    }
    
    return false;
  }
}