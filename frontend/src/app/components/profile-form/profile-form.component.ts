import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {
  profileForm: FormGroup;
  isEditMode = false;
  profileId: number | null = null;
  loading = false;
  saving = false;
  
  // Perfis do sistema que não podem ser editados
  systemProfiles = ['ADMIN', 'USER'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    // Verificar se é admin
    if (!this.authService.isAdmin()) {
      this.snackBar.open('Acesso negado. Apenas administradores podem gerenciar perfis.', 'Fechar', { duration: 4000 });
      this.router.navigate(['/dashboard']);
      return;
    }

    this.checkMode();
    
    if (this.isEditMode) {
      this.loadProfile();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Z][A-Z0-9_]*$/) // Maiúsculas, números e underscore
      ]],
      description: ['', [
        Validators.maxLength(255)
      ]]
    });
  }

  private checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.profileId = +params['id'];
        this.isEditMode = true;
      }
    });
  }

  private loadProfile(): void {
    if (!this.profileId) return;

    this.loading = true;
    this.profileService.getProfileById(this.profileId).subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          name: profile.name,
          description: profile.description
        });

        // Verificar se é perfil do sistema
        if (this.isSystemProfile(profile.name)) {
          this.profileForm.get('name')?.disable();
          this.snackBar.open('Este é um perfil do sistema. Apenas a descrição pode ser editada.', 'Fechar', { duration: 4000 });
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
        this.snackBar.open('Erro ao carregar perfil', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.goBack();
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    // Verificar se é tentativa de criar perfil com nome de sistema
    const formValue = this.profileForm.getRawValue();
    if (!this.isEditMode && this.isSystemProfile(formValue.name)) {
      this.snackBar.open('Não é possível criar perfil com nome reservado do sistema', 'Fechar', { duration: 4000 });
      return;
    }

    this.saving = true;

    const profileData: Profile = {
      name: formValue.name.trim().toUpperCase(),
      description: formValue.description?.trim() || ''
    };

    if (this.isEditMode) {
      this.updateProfile(profileData);
    } else {
      this.createProfile(profileData);
    }
  }

  private createProfile(profileData: Profile): void {
    this.profileService.createProfile(profileData).subscribe({
      next: (profile) => {
        this.snackBar.open('Perfil criado com sucesso!', 'Fechar', { duration: 3000 });
        this.saving = false;
        this.goBack();
      },
      error: (error) => {
        console.error('Erro ao criar perfil:', error);
        
        if (error.status === 409 || error.error?.message?.includes('already exists')) {
          this.snackBar.open('Já existe um perfil com este nome', 'Fechar', { duration: 4000 });
        } else {
          this.snackBar.open('Erro ao criar perfil', 'Fechar', { duration: 3000 });
        }
        
        this.saving = false;
      }
    });
  }

  private updateProfile(profileData: Profile): void {
    this.profileService.updateProfile(this.profileId!, profileData).subscribe({
      next: (profile) => {
        this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.saving = false;
        this.goBack();
      },
      error: (error) => {
        console.error('Erro ao atualizar perfil:', error);
        
        if (error.status === 409 || error.error?.message?.includes('already exists')) {
          this.snackBar.open('Já existe um perfil com este nome', 'Fechar', { duration: 4000 });
        } else {
          this.snackBar.open('Erro ao atualizar perfil', 'Fechar', { duration: 3000 });
        }
        
        this.saving = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  isSystemProfile(profileName: string): boolean {
    return this.systemProfiles.includes(profileName?.toUpperCase());
  }

  goBack(): void {
    this.router.navigate(['/admin/profiles']);
  }

  getTitle(): string {
    return this.isEditMode ? 'Editar Perfil' : 'Novo Perfil';
  }

  getSubtitle(): string {
    if (this.isEditMode) {
      return 'Modifique as informações do perfil de acesso';
    }
    return 'Crie um novo perfil de acesso para o sistema';
  }

  // Métodos para validação e feedback
  getNameErrorMessage(): string {
    const nameControl = this.profileForm.get('name');
    
    if (nameControl?.hasError('required')) {
      return 'Nome do perfil é obrigatório';
    }
    
    if (nameControl?.hasError('minlength')) {
      return 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (nameControl?.hasError('maxlength')) {
      return 'Nome deve ter no máximo 50 caracteres';
    }
    
    if (nameControl?.hasError('pattern')) {
      return 'Nome deve começar com letra maiúscula e conter apenas letras maiúsculas, números e underscore';
    }
    
    return '';
  }

  getDescriptionErrorMessage(): string {
    const descControl = this.profileForm.get('description');
    
    if (descControl?.hasError('maxlength')) {
      return 'Descrição deve ter no máximo 255 caracteres';
    }
    
    return '';
  }

  onNameInput(): void {
    // Converter automaticamente para maiúscula conforme o usuário digita
    const nameControl = this.profileForm.get('name');
    if (nameControl?.value) {
      const upperValue = nameControl.value.toUpperCase().replace(/[^A-Z0-9_]/g, '');
      if (upperValue !== nameControl.value) {
        nameControl.setValue(upperValue);
      }
    }
  }
}
