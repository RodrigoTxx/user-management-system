import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Verificar se já está logado e redirecionar
    if (this.authService.isLoggedIn()) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin/users']);
      } else {
        this.router.navigate(['/profile']);
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      const loginData = this.loginForm.value;
      
      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.loading = false;
          
          // Verificar se existe URL de retorno salva
          const returnUrl = localStorage.getItem('returnUrl');
          if (returnUrl) {
            localStorage.removeItem('returnUrl');
            this.router.navigate([returnUrl]);
          } else {
            // Redirecionar baseado no perfil do usuário
            if (this.authService.isAdmin()) {
              this.router.navigate(['/admin/users']);
            } else {
              this.router.navigate(['/profile']);
            }
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro no login:', error);
          
          if (error.status === 401) {
            this.errorMessage = 'Credenciais inválidas. Verifique seu usuário e senha.';
          } else if (error.status === 0) {
            this.errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
          } else {
            this.errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          }
        }
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${fieldName === 'username' ? 'Nome de usuário' : 'Senha'} é obrigatório`;
    }
    
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `${fieldName === 'username' ? 'Nome de usuário' : 'Senha'} deve ter pelo menos ${minLength} caracteres`;
    }
    
    return '';
  }
}