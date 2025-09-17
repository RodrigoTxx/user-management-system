import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para verificar se o usuário está autenticado
 * Redireciona para login se não estiver logado
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Salvar a URL tentada para redirecionamento após login
    localStorage.setItem('returnUrl', state.url);
    
    // Redirecionar para login
    this.router.navigate(['/login']);
    return false;
  }
}