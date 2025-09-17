import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Rota de login (sempre acessível)
  { 
    path: 'login', 
    component: LoginComponent
  },
  
  // Dashboard protegido (requer autenticação)
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  
  // Rotas de administração (somente admins)
  { 
    path: 'admin/users', 
    component: UserListComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/users/new', 
    component: UserFormComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/users/edit/:id', 
    component: UserFormComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/users/view/:id', 
    component: UserFormComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/profiles', 
    component: ProfileListComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/profiles/new', 
    component: ProfileFormComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/profiles/edit/:id', 
    component: ProfileFormComponent,
    canActivate: [AdminGuard]
  },
  
  // Rotas para usuários comuns (somente users não-admin)
  { 
    path: 'profile', 
    component: UserProfileComponent,
    canActivate: [UserGuard]
  },
  { 
    path: 'profile/edit', 
    component: UserFormComponent,
    canActivate: [UserGuard]
  },
  
  // Rotas de compatibilidade (redirecionamentos simples)
  { 
    path: 'users', 
    redirectTo: '/admin/users'
  },
  { 
    path: 'users/new', 
    redirectTo: '/admin/users/new'
  },
  { 
    path: 'profiles', 
    redirectTo: '/admin/profiles'
  },
  
  // Rota padrão
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }