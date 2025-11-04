import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  allUsers: User[] = [];
  displayedColumns: string[] = [ 'username', 'characterName', 'characterClass', 'gearScore', 'profile', 'active', 'actions'];
  searchQuery: string = '';
  loading = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.allUsers = users;
        this.users = users;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar usuários:', error);
        this.snackBar.open('Erro ao carregar usuários', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  searchUsers(): void {
    const query = this.searchQuery.trim().toLowerCase();
    
    if (query) {
      this.users = this.allUsers.filter(user => 
        user.username?.toLowerCase().includes(query) ||
        user.characterName?.toLowerCase().includes(query) ||
        user.characterClass?.toLowerCase().includes(query) ||
        user.profileName?.toLowerCase().includes(query)
      );
      
      if (this.users.length === 0 && this.allUsers.length > 0) {
        this.loading = true;
        this.userService.searchUsers(this.searchQuery).subscribe({
          next: (users: User[]) => {
            this.users = users;
            this.loading = false;
          },
          error: (error: any) => {
            console.error('Erro na busca:', error);
            this.snackBar.open('Erro na busca de usuários', 'Fechar', { duration: 3000 });
            this.users = [];
            this.loading = false;
          }
        });
      }
    } else {
      this.users = [...this.allUsers];
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.users = [...this.allUsers];
  }

  createUser(): void {
    this.router.navigate(['/admin/users/new']);
  }

  editUser(user: User): void {
    this.router.navigate(['/admin/users/edit', user.id]);
  }

  viewUser(user: User): void {
    this.router.navigate(['/admin/users/view', user.id]);
  }

  toggleUserStatus(user: User): void {
    if (user.active) {
      this.userService.deactivateUser(user.id!).subscribe({
        next: () => {
          this.snackBar.open('Usuário desativado com sucesso', 'Fechar', { duration: 3000 });
          this.loadUsers();
          if (this.searchQuery.trim()) {
            setTimeout(() => this.searchUsers(), 100);
          }
        },
        error: (error: any) => {
          console.error('Erro ao desativar usuário:', error);
          this.snackBar.open('Erro ao desativar usuário', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Tem certeza que deseja excluir o usuário "${user.username}"?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.snackBar.open('Usuário excluído com sucesso', 'Fechar', { duration: 3000 });
          this.loadUsers();
          if (this.searchQuery.trim()) {
            setTimeout(() => this.searchUsers(), 100);
          }
        },
        error: (error: any) => {
          console.error('Erro ao excluir usuário:', error);
          this.snackBar.open('Erro ao excluir usuário', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  getStatusText(active: boolean): string {
    return active ? 'Ativo' : 'Inativo';
  }

  getStatusColor(active: boolean): string {
    return active ? 'primary' : 'warn';
  }

  getGearScoreColor(gearScore: number): string {
    if (gearScore >= 850) return 'primary'; // Altíssimo
    if (gearScore >= 830) return 'accent';  // Alto
    if (gearScore >= 810) return 'basic';   // Médio
    return 'warn';                          // Baixo
  }
}
