import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, BDO_CLASSES, BDOClass, calculateGearScore, getAvailableTypesForClass } from '../../models/user.model';
import { Profile } from '../../models/profile.model';
import { UserService } from '../../services/user.service';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  profiles: Profile[] = [];
  isEditMode = false;
  isAdminMode = false;
  isSelfEdit = false;
  userId: number | null = null;
  loading = false;
  saving = false;
  currentUser: any;
  
  // Black Desert Online data
  bdoClasses: BDOClass[] = BDO_CLASSES;
  calculatedGearScore = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private profileService: ProfileService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.checkMode();
    this.loadProfiles();
    
    if (this.isEditMode) {
      this.loadUser();
    }
    
    // Calculate initial gear score
    this.onPowerChange();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      characterName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
      profileId: ['', Validators.required],
      active: [true],
      
      // Black Desert Online fields
      attackPower: [0, [Validators.min(0), Validators.max(500)]],
      awakeningAttackPower: [0, [Validators.min(0), Validators.max(500)]],
      defensePower: [0, [Validators.min(0), Validators.max(500)]],
      characterClass: [''],
      classType: ['']
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password?.value && confirmPassword?.value && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
  }

  private checkMode(): void {
    const url = this.router.url;
    this.isAdminMode = url.includes('/admin/');
    
    // Check if it's profile edit (self-edit)
    if (url.includes('/profile/edit')) {
      this.isEditMode = true;
      this.isSelfEdit = true;
      this.userId = null; // Will be loaded from current user
    } else {
      this.route.params.subscribe((params: { [x: string]: string | number; }) => {
        if (params['id']) {
          this.userId = +params['id'];
          this.isEditMode = true;
          this.isSelfEdit = false;
        }
      });
    }

    // Adjust form validators based on mode
    if (this.isEditMode) {
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
    } else {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    }

    // If self-editing, disable certain fields
    if (this.isSelfEdit) {
      this.userForm.get('username')?.disable();
      this.userForm.get('profileId')?.disable();
      this.userForm.get('active')?.disable();
    }
  }

  private loadProfiles(): void {
    this.profileService.getAllProfiles().subscribe({
      next: (profiles: Profile[]) => {
        this.profiles = profiles;
      },
      error: (error: any) => {
        console.error('Erro ao carregar perfis:', error);
        this.snackBar.open('Erro ao carregar perfis', 'Fechar', { duration: 3000 });
      }
    });
  }

  private loadUser(): void {
    this.loading = true;

    // If it's self-edit, load own profile
    if (this.isSelfEdit) {
      this.userService.getMyProfile().subscribe({
        next: (user: any) => {
          this.userId = user.id || null;
          this.populateForm(user);
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar próprio perfil:', error);
          this.snackBar.open('Erro ao carregar perfil', 'Fechar', { duration: 3000 });
          this.loading = false;
          this.goBack();
        }
      });
    } else if (this.userId) {
      // Load specific user by ID
      this.userService.getUserById(this.userId).subscribe({
        next: (user: any) => {
          this.populateForm(user);
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar usuário:', error);
          this.snackBar.open('Erro ao carregar usuário', 'Fechar', { duration: 3000 });
          this.loading = false;
          this.goBack();
        }
      });
    }
  }

  private populateForm(user: any): void {
    this.userForm.patchValue({
      username: user.username,
      characterName: user.characterName,
      profileId: user.profile?.id || user.profileId, // Suporte para ambos os formatos
      active: user.active,
      
      // Black Desert Online fields
      attackPower: user.attackPower || 0,
      awakeningAttackPower: user.awakeningAttackPower || 0,
      defensePower: user.defensePower || 0,
      characterClass: user.characterClass || '',
      classType: user.classType || ''
    });
    
    // Calculate gear score after populating form
    this.onPowerChange();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    const formValue = this.userForm.getRawValue();

    // Prepare user data
    const userData = {
      username: formValue.username,
      characterName: formValue.characterName,
      profileId: formValue.profileId,
      active: formValue.active,
      
      // Black Desert Online fields
      attackPower: formValue.attackPower || 0,
      awakeningAttackPower: formValue.awakeningAttackPower || 0,
      defensePower: formValue.defensePower || 0,
      characterClass: formValue.characterClass || '',
      classType: formValue.classType || ''
    };

    // Add password only if provided
    if (formValue.password) {
      (userData as any).password = formValue.password;
    }

    if (this.isEditMode) {
      this.updateUser(userData);
    } else {
      this.createUser(userData);
    }
  }

  private createUser(userData: any): void {
    this.userService.createUser(userData).subscribe({
      next: (user: any) => {
        this.snackBar.open('Usuário criado com sucesso!', 'Fechar', { duration: 3000 });
        this.saving = false;
        this.goBack();
      },
      error: (error: any) => {
        console.error('Erro ao criar usuário:', error);
        this.snackBar.open('Erro ao criar usuário', 'Fechar', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  private updateUser(userData: any): void {
    if (this.isSelfEdit) {
      // Use endpoint específico para auto-edição
      this.userService.updateMyProfile(userData).subscribe({
        next: (user: any) => {
          this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.saving = false;
          this.goBack();
        },
        error: (error: any) => {
          console.error('Erro ao atualizar perfil:', error);
          this.snackBar.open('Erro ao atualizar perfil', 'Fechar', { duration: 3000 });
          this.saving = false;
        }
      });
    } else {
      // Use endpoint de admin para editar outros usuários
      this.userService.updateUser(this.userId!, userData).subscribe({
        next: (user: any) => {
          this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.saving = false;
          this.goBack();
        },
        error: (error: any) => {
          console.error('Erro ao atualizar usuário:', error);
          this.snackBar.open('Erro ao atualizar usuário', 'Fechar', { duration: 3000 });
          this.saving = false;
        }
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    if (this.isSelfEdit) {
      this.router.navigate(['/dashboard']);
    } else if (this.isAdminMode) {
      this.router.navigate(['/admin/users']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  getTitle(): string {
    if (this.isSelfEdit) {
      return 'Meu Perfil';
    } else if (this.isEditMode) {
      return 'Editar Usuário';
    } else {
      return 'Novo Usuário';
    }
  }

  canEditProfile(): boolean {
    return this.isAdminMode && !this.isSelfEdit;
  }

  canEditUsername(): boolean {
    return !this.isSelfEdit;
  }

  shouldShowPassword(): boolean {
    return !this.isEditMode || (this.isEditMode && this.userForm.get('password')?.value);
  }

  togglePasswordChange(): void {
    const passwordControl = this.userForm.get('password');
    const confirmPasswordControl = this.userForm.get('confirmPassword');

    if (passwordControl?.disabled) {
      passwordControl.enable();
      confirmPasswordControl?.enable();
      passwordControl.setValidators([Validators.required, Validators.minLength(6)]);
      confirmPasswordControl?.setValidators([Validators.required]);
    } else {
      passwordControl?.disable();
      confirmPasswordControl?.disable();
      passwordControl?.clearValidators();
      confirmPasswordControl?.clearValidators();
      passwordControl?.setValue('');
      confirmPasswordControl?.setValue('');
    }
    
    passwordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
  }

  // Black Desert Online specific methods
  onPowerChange(): void {
    const ap = this.userForm.get('attackPower')?.value || 0;
    const app = this.userForm.get('awakeningAttackPower')?.value || 0;
    const dp = this.userForm.get('defensePower')?.value || 0;
    
    this.calculatedGearScore = calculateGearScore(ap, app, dp);
  }

  onClassChange(className: string): void {
    // Reset class type when class changes
    this.userForm.get('classType')?.setValue('');
    
    // Update available class types
    const availableTypes = this.getAvailableClassTypes();
    if (availableTypes.length === 1) {
      // Auto-select if only one option
      this.userForm.get('classType')?.setValue(availableTypes[0]);
    }
  }

  getAvailableClassTypes(): string[] {
    const selectedClass = this.userForm.get('characterClass')?.value;
    return selectedClass ? getAvailableTypesForClass(selectedClass) : [];
  }
}
