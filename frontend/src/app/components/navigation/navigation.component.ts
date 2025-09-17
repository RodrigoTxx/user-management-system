import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: any = null;
  isAdmin = false;
  private userSubscription?: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Inscrever-se nas mudanças de usuário
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.currentUser = user;
        this.isAdmin = user.profileName === 'ADMIN';
      } else {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.isAdmin = false;
      }
    });

    // Verificar estado inicial
    this.checkLoginStatus();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private checkLoginStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
      this.isLoggedIn = true;
      this.currentUser = JSON.parse(user);
      this.isAdmin = this.currentUser?.profileName === 'ADMIN';
    }
  }

  logout() {
    this.authService.logout();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}