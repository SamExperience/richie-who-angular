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
        let expireAt = Date.now() + res.expiresIn * 1000;
        localStorage.setItem('id_token', res.idToken);
        localStorage.setItem('refresh_token', res.refreshToken);
        localStorage.setItem('expires_at', expireAt.toString());

        console.log('Login success');
        console.log(res);
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
