import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SettingsService } from '@core/services/settings.service';
import { IVentasCfe } from '@pages/ventas-cfe/models/vantas-cfe.interface';
import { ApiResponse } from '@shared/models/api-response';
import { Observable } from 'rxjs';
import { RequestVentas } from './models/request-ventas.interface';

@Injectable({
  providedIn: 'root',
})
export class VentasCfeService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  getVentasCfe(request: RequestVentas): Observable<ApiResponse<IVentasCfe[]>> {
    return this.http.post<ApiResponse<IVentasCfe[]>>(
      `${this.settingsService.apiUrl}/reportes/ventaCfe`,
      request,
    );
  }
}
