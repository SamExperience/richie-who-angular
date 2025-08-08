import { Routes } from '@angular/router';
/* components import */
import { PublicHomePageComponent } from './components/public-home-page/public-home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', component: PublicHomePageComponent },
  { path: 'admin-login', component: LoginPageComponent },
  { path: '**', component: PageNotFoundComponent },
];
