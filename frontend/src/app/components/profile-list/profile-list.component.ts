import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {
  profiles: Profile[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  loading = false;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.loading = true;
    this.profileService.getAllProfiles().subscribe({
      next: (profiles) => {
        this.profiles = profiles;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar perfis:', error);
        console.error('Status do erro:', error.status);
        console.error('Mensagem do erro:', error.message);
        this.snackBar.open('Erro ao carregar perfis', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  createProfile(): void {
    this.router.navigate(['/admin/profiles/new']);
  }

  editProfile(profile: Profile): void {
    this.router.navigate(['/admin/profiles/edit', profile.id]);
  }

  deleteProfile(profile: Profile): void {
    // Check if it's a system profile (ADMIN or USER)
    if (profile.name === 'ADMIN' || profile.name === 'USER') {
      this.snackBar.open('Não é possível excluir perfis do sistema', 'Fechar', { duration: 3000 });
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o perfil "${profile.name}"?`)) {
      this.profileService.deleteProfile(profile.id!).subscribe({
        next: () => {
          this.snackBar.open('Perfil excluído com sucesso', 'Fechar', { duration: 3000 });
          this.loadProfiles();
        },
        error: (error) => {
          console.error('Erro ao excluir perfil:', error);
          if (error.status === 400) {
            this.snackBar.open('Não é possível excluir perfil em uso', 'Fechar', { duration: 5000 });
          } else {
            this.snackBar.open('Erro ao excluir perfil', 'Fechar', { duration: 3000 });
          }
        }
      });
    }
  }

  canDelete(profile: Profile): boolean {
    // System profiles cannot be deleted
    return profile.name !== 'ADMIN' && profile.name !== 'USER';
  }

  canEdit(profile: Profile): boolean {
    // All profiles can be edited, but system profiles have restrictions
    return true;
  }

  getProfileIcon(profileName: string): string {
    switch (profileName.toUpperCase()) {
      case 'ADMIN':
        return 'admin_panel_settings';
      case 'USER':
        return 'person';
      default:
        return 'group';
    }
  }

  getProfileColor(profileName: string): string {
    switch (profileName.toUpperCase()) {
      case 'ADMIN':
        return 'primary';
      case 'USER':
        return 'accent';
      default:
        return 'basic';
    }
  }
}
