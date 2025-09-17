import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    
    this.userService.getMyProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {        
        if (currentUser.id) {
          this.userService.getUserById(currentUser.id).subscribe({
            next: (user) => {
              this.user = user;
              this.loading = false;
            },
            error: (error) => {              
              this.user = {
                username: currentUser.username,
                email: currentUser.email || '',
                fullName: currentUser.fullName || currentUser.username,
                phone: currentUser.phone || '',
                active: true,
                profileId: 0,
                profileName: currentUser.profileName
              } as User;
              this.loading = false;
            }
          });
        } else {          
          this.user = {
            username: currentUser.username,
            email: currentUser.email || '',
            fullName: currentUser.fullName || currentUser.username,
            phone: currentUser.phone || '',
            active: true,
            profileId: 0,
            profileName: currentUser.profileName
          } as User;
          this.loading = false;
        }
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getProfileColor(): string {
    if (this.user?.profileName === 'ADMIN' || this.user?.profile?.name === 'ADMIN') {
      return 'primary';
    }
    return 'accent';
  }

  getProfileIcon(): string {
    if (this.user?.profileName === 'ADMIN' || this.user?.profile?.name === 'ADMIN') {
      return 'admin_panel_settings';
    }
    return 'person';
  }

  refreshProfile(): void {
    this.loadUserProfile();
    this.snackBar.open('Perfil atualizado!', 'Fechar', { duration: 2000 });
  }
}
