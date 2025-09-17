import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
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

    // Verificar se é admin
    if (this.authService.isAdmin()) {
      return true;
    }

    // Se não for admin, redirecionar para dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
}