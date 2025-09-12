import { Routes } from '@angular/router';
import { MainLayout } from '@app/layouts/main/main-layout';
import { authGuard } from '@core/auth/services/auth.guard';
import { AuthLayout } from '@layouts/auth-layout';
import { Login } from '@pages/auth/login/login';
import { Faltas } from '@pages/faltas/faltas';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
    ],
  },
  {
    path: 'reportes',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'faltas', pathMatch: 'full' },
      { path: 'faltas', component: Faltas },
    ],
  },
  { path: '**', redirectTo: 'auth' },
];
