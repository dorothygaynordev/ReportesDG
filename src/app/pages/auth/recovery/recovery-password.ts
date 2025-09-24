import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@app/shared/models/api-response';
import { SettingsService } from '@core/services/settings.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecoveryPassword {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  recoveryPassword(email: string): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(
      `${this.settingsService.apiUrl}/auth/recovery-password?email=${email}`,
    );
  }
}
