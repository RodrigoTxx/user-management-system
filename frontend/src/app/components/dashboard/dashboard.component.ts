import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  isAdmin = false;
  loading = false;
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalProfiles: 0
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.profileName === 'ADMIN' || this.currentUser?.profile?.name === 'ADMIN';
    
    this.userService.getMyProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isAdmin = user.profileName === 'ADMIN' || user.profile?.name === 'ADMIN';
        this.loadStats();
      },
      error: (error) => {
        this.isAdmin = this.currentUser?.profileName === 'ADMIN' || this.currentUser?.profile?.name === 'ADMIN';
        this.loadStats();
      }
    });
  }

  private loadStats(): void {
    if (!this.isAdmin) return;
    
    this.loading = true;
    
    // Carregar estatísticas reais do backend
    Promise.all([
      this.userService.getAllUsers().toPromise(),
      this.userService.getActiveUsers().toPromise(),
      this.profileService.getAllProfiles().toPromise()
    ]).then(([users, activeUsers, profiles]) => {
      this.stats = {
        totalUsers: users?.length || 0,
        activeUsers: activeUsers?.length || 0,
        totalProfiles: profiles?.length || 0
      };
      this.loading = false;
    }).catch(error => {
      console.error('Erro ao carregar estatísticas:', error);
      // Fallback para dados simulados
      this.stats = {
        totalUsers: 0,
        activeUsers: 0,
        totalProfiles: 0
      };
      this.loading = false;
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}