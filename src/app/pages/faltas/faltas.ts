import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppCard } from '@shared/components/card/card';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { catchError, map, of } from 'rxjs';
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
  ],
  templateUrl: './faltas.html',
})
export class Faltas {
  private faltasService = inject(FaltasService);

  public listFaltas: Signal<EmpleadoFaltas[]> = toSignal(
    this.faltasService.getFaltas().pipe(
      map((response) => (response.success ? response.data : [])),
      catchError((err) => {
        console.log('Error al obtener faltas:', err);
        return of([]);
      }),
    ),
    { initialValue: [] },
  );

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
