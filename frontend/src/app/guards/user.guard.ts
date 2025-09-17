import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para verificar se o usuário tem perfil de USER (não admin)
 * Redireciona admins para área administrativa
 */
@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    // Verificar se está logado
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('returnUrl', state.url);
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar se é usuário comum (não admin)
    if (!this.authService.isAdmin()) {
      return true;
    }

    // Se for admin, redirecionar para área administrativa
    this.router.navigate(['/admin/users']);
    return false;
  }
}