import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@app/shared/models/api-response';
import { SettingsService } from '@core/services/settings.service';
import { Observable } from 'rxjs';
import { EmpleadoFaltas } from './models/empleado-faltas';

@Injectable({
  providedIn: 'root',
})
export class FaltasService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  getFaltas(): Observable<ApiResponse<EmpleadoFaltas[]>> {
    return this.http.get<ApiResponse<EmpleadoFaltas[]>>(
      `${this.settingsService.apiUrl}/faltas`,
    );
  }
}
