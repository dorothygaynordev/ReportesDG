import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';
import { MainLayout } from '@app/layouts/main/main-layout';
import { AuthLayout } from '@layouts/auth-layout';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('@pages/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'recovery',
        loadComponent: () =>
          import('@pages/auth/recovery/recovery').then((m) => m.Recovery),
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
        loadComponent: () =>
          import('@pages/faltas/faltas').then((m) => m.Faltas),
        data: { breadcrumb: 'Faltas recurrentes' },
      },
      {
        path: 'ventas-cfe',
        loadComponent: () =>
          import('@pages/ventas-cfe/ventas-cfe').then((m) => m.VentasCfe),
        data: { breadcrumb: 'Ventas CFE' },
      },
    ],
  },
  { path: '**', redirectTo: 'auth' },
];
