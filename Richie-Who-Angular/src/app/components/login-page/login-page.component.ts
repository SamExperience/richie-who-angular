import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service'; // aggiorna il path se serve
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  onLogin() {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.idToken);
        console.log('Login success');
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error?.message || 'Login error';
      },
    });
  }

  onLogout() {
    this.authService.signout();
  }
}
