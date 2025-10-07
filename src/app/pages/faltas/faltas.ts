import { Component, inject, signal } from '@angular/core';
import { AppCard } from '@shared/components/card/card';
import { Loading } from '@shared/components/loading/loading';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { lastValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { FaltasService } from './faltas.service';
import { EmpleadoFaltas } from './models/empleado-faltas';

@Component({
  selector: 'app-faltas',
  imports: [
    CardModule,
    ButtonModule,
    TableModule,
    ListboxModule,
    AppCard,
    NgScrollbarModule,
    ToastModule,
    Loading,
  ],
  providers: [MessageService],
  templateUrl: './faltas.html',
})
export class Faltas {
  private faltasService = inject(FaltasService);
  private messageService = inject(MessageService);
  listFaltas = signal<EmpleadoFaltas[]>([]);
  loading = signal(false);

  constructor() {
    this.getFaltas();
  }

  async getFaltas() {
    try {
      this.loading.set(true);
      const faltas$ = this.faltasService.getFaltas();
      const response = await lastValueFrom(faltas$);

      this.loading.set(false);
      if (response.success) {
        this.listFaltas.set(response.data);
      }
    } catch (error) {
      this.loading.set(false);
      this.messageService.add({
        severity: 'error',
        summary: 'Error de servidor',
        detail: 'Ocurrió un error inesperado. Intente nuevamente más tarde.',
        life: 3000,
      });
      console.error('Error al obtener ventas:', error);
    }
  }

  exportExcel() {
    const excel = this.listFaltas().map((falta) => ({
      'Número de empleado': falta.cedula,
      Nombre: falta.nombre,
      Tienda: falta.claveTienda,
      Faltas: falta.total,
      'Dias de Falta': falta.faltas.map((x) => x.fechaFalta).join(', '),
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Faltas');
    XLSX.writeFile(wb, `Faltas.xlsx`);
  }
}
