import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private config: Record<string, string> | null = null;
  private http = inject(HttpClient);

  load(): Promise<void> {
    return lastValueFrom(
      this.http.get<Record<string, string>>('/config/settings.json'),
    )
      .then((data) => {
        this.config = data;
      })
      .catch(() => {
        console.error('Failed to load settings');
        this.config = {};
      });
  }

  getSettings(key: string): string {
    return this.config?.[key] ?? '';
  }

  get apiUrl(): string {
    return this.getSettings('API_URL');
  }

  get token(): string {
    return this.getSettings('TOKEN_KEY');
  }
}
