import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@app/shared/models/api-response';
import { RequestLogin } from '@core/auth/models/request-login.interface';
import { SettingsService } from '@core/services/settings.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  login(requestLogin: RequestLogin): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.settingsService.apiUrl}/auth/login`,
      requestLogin,
    );
  }
}
