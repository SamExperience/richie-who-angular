import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
/* components import */
import { PublicHomePageComponent } from './components/public-home-page/public-home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AdminDashboardPageComponent } from './components/admin-dashboard-page/admin-dashboard-page.component';

export const routes: Routes = [
  { path: '', component: PublicHomePageComponent },
  {
    path: 'admin-login',
    component: LoginPageComponent,
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardPageComponent,
    canActivate: [authGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];
