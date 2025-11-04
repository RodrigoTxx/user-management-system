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
      next: (user: User | null) => {
        this.user = user;
        this.loading = false;
      },
      error: (error: any) => {        
        if (currentUser.id) {
          this.userService.getUserById(currentUser.id).subscribe({
            next: (user: User | null) => {
              this.user = user;
              this.loading = false;
            },
            error: (error: any) => {              
              this.user = {
                username: currentUser.username,
                characterName: currentUser.characterName || currentUser.username,
                active: true,
                profileId: 0,
                profileName: currentUser.profileName,
                attackPower: 0,
                awakeningAttackPower: 0,
                defensePower: 0,
                gearScore: 0
              } as User;
              this.loading = false;
            }
          });
        } else {          
          this.user = {
            username: currentUser.username,
            characterName: currentUser.characterName || currentUser.username,
            active: true,
            profileId: 0,
            profileName: currentUser.profileName,
            attackPower: 0,
            awakeningAttackPower: 0,
            defensePower: 0,
            gearScore: 0
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

  getGearScoreColor(gearScore: number): string {
    if (gearScore >= 830) return 'primary'; // Altíssimo
    if (gearScore >= 800) return 'accent';  // Alto
    if (gearScore >= 790) return 'basic';   // Médio
    return 'warn';                          // Baixo
  }
}
