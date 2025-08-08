import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
@Component({
  selector: 'app-admin-dashboard-page',
  imports: [],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.scss',
})
export class AdminDashboardPageComponent {
  constructor(private auth: AuthServiceService) {}

  onLogout() {
    this.auth.signout();
    console.log('signout ok');
  }
}
