import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';
import { MainLayout } from '@app/layouts/main/main-layout';
import { AuthLayout } from '@layouts/auth-layout';
import { Login } from '@pages/auth/login/login';
import { Recovery } from '@pages/auth/recovery/recovery';
import { Faltas } from '@pages/faltas/faltas';
import { VentasCfe } from '@pages/ventas-cfe/ventas-cfe';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'recovery',
        component: Recovery,
      },
    ],
  },
  {
    path: 'reportes',
    component: MainLayout,
    canActivate: [authGuard],
    data: { breadcrumb: 'Reportes' },
    children: [
      { path: '', redirectTo: 'ventas-cfe', pathMatch: 'full' },
      {
        path: 'faltas',
        component: Faltas,
        data: { breadcrumb: 'Faltas recurrentes' },
      },
      {
        path: 'ventas-cfe',
        component: VentasCfe,
        data: { breadcrumb: 'Ventas CFE' },
      },
    ],
  },
  { path: '**', redirectTo: 'auth' },
];
