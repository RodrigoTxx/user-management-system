# Guards de Autorização - Sistema de Gerenciamento de Usuários

## Visão Geral
Os Guards foram implementados para controlar o acesso às rotas baseado no status de autenticação e perfil do usuário.

## Guards Implementados

### 1. AuthGuard
- **Propósito**: Verificar se o usuário está autenticado
- **Comportamento**: 
  - Permite acesso se usuário estiver logado
  - Redireciona para `/login` se não estiver autenticado
  - Salva a URL tentada para redirecionamento após login
- **Usado em**: Todas as rotas que requerem autenticação

### 2. AdminGuard
- **Propósito**: Verificar se o usuário tem perfil de ADMIN
- **Comportamento**:
  - Verifica autenticação primeiro
  - Permite acesso apenas para usuários com `profileName === 'ADMIN'`
  - Redireciona usuários comuns para `/dashboard`
- **Usado em**: Rotas administrativas (`/admin/*`)

### 3. UserGuard
- **Propósito**: Verificar se o usuário é comum (não admin)
- **Comportamento**:
  - Verifica autenticação primeiro
  - Permite acesso apenas para usuários NÃO admins
  - Redireciona admins para `/admin/users`
- **Usado em**: Rotas de usuário comum (`/profile`, `/profile/edit`)

### 4. LoginGuard
- **Propósito**: Evitar que usuários já logados acessem a tela de login
- **Comportamento**:
  - Permite acesso apenas se não estiver logado
  - Redireciona usuários logados baseado no perfil:
    - Admin → `/admin/users`
    - User → `/profile`
- **Usado em**: Rota `/login`

## Rotas Protegidas

### Rotas Administrativas (AdminGuard)
```
/admin/users              - Lista de usuários
/admin/users/new          - Criar usuário
/admin/users/edit/:id     - Editar usuário
/admin/users/view/:id     - Visualizar usuário
/admin/profiles           - Lista de perfis
/admin/profiles/new       - Criar perfil
/admin/profiles/edit/:id  - Editar perfil
```

### Rotas de Usuário (UserGuard)
```
/profile      - Ver próprio perfil
/profile/edit - Editar próprios dados
```

### Rotas Gerais (AuthGuard)
```
/dashboard - Dashboard principal
```

### Rota de Login (LoginGuard)
```
/login - Tela de autenticação
```

## Fluxo de Autorização

1. **Usuário não logado**:
   - Acesso apenas à `/login`
   - Qualquer outra rota redireciona para login
   - URL tentada é salva para redirecionamento posterior

2. **Login bem-sucedido**:
   - Admin → Redireciona para `/admin/users`
   - User → Redireciona para `/profile`
   - Se havia URL salva, redireciona para ela

3. **Usuário Admin logado**:
   - Acesso total às rotas administrativas
   - Não pode acessar rotas de usuário comum
   - Tentativa de acesso a `/profile` redireciona para `/admin/users`

4. **Usuário comum logado**:
   - Acesso apenas ao próprio perfil
   - Não pode acessar rotas administrativas
   - Tentativa de acesso a `/admin/*` redireciona para `/dashboard`

## Implementação Técnica

### Estrutura dos Guards
```typescript
@Injectable({ providedIn: 'root' })
export class GuardName implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Lógica de verificação
  }
}
```

### Configuração das Rotas
```typescript
{
  path: 'admin/users',
  component: UserListComponent,
  canActivate: [AdminGuard]
}
```

### Verificações no AuthService
```typescript
isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}

isAdmin(): boolean {
  const user = this.getCurrentUser();
  return user?.profileName === 'ADMIN';
}
```

## Testando os Guards

### Cenários de Teste

1. **Usuário não logado**:
   - Tentar acessar `/admin/users` → Redireciona para `/login`
   - Fazer login como admin → Redireciona para `/admin/users`

2. **Login como Admin**:
   - Tentar acessar `/profile` → Redireciona para `/admin/users`
   - Acessar `/admin/profiles` → Acesso permitido

3. **Login como User**:
   - Tentar acessar `/admin/users` → Redireciona para `/dashboard`
   - Acessar `/profile` → Acesso permitido

4. **Já logado tentando login**:
   - Admin acessando `/login` → Redireciona para `/admin/users`
   - User acessando `/login` → Redireciona para `/profile`

## Dados de Teste

### Usuários no Sistema
- **Admin**: username=`admin`, password=`admin123`
- **User**: username=`user`, password=`user123`

### URLs de Teste
```bash
# Testes com usuário não logado
curl -X GET http://localhost:4200/admin/users
curl -X GET http://localhost:4200/profile

# Testes com token (substituir {TOKEN} pelo token real)
curl -X GET "http://localhost:8080/api/users" \
  -H "Authorization: Bearer {TOKEN}"
```