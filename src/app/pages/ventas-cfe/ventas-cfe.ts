import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCard } from '@shared/components/card/card';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { catchError, map, of } from 'rxjs';
import * as XLSX from 'xlsx';
import { RequestVentas } from './models/request-ventas.interface';
import { IVentasCfe } from './models/vantas-cfe.interface';
import { VentasCfeService } from './ventas-cfe.service';

@Component({
  selector: 'app-ventas-cfe',
  imports: [
    AppCard,
    ButtonModule,
    StyleClassModule,
    DatePickerModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    TableModule,
    CurrencyPipe,
    ToastModule,
    CommonModule,
  ],
  providers: [DatePipe, MessageService],
  templateUrl: './ventas-cfe.html',
})
export class VentasCfe {
  private ventasService = inject(VentasCfeService);
  private datePipe = inject(DatePipe);
  private messageService = inject(MessageService);

  findTienda = '';
  rangeDates: Date[] = [];
  listVentas = signal<IVentasCfe[]>([]);
  ventaTotal = signal<number>(0);

  public filtros = signal<RequestVentas>({
    tienda: '',
    fechaInicio: undefined,
    fechaFin: undefined,
  });

  constructor() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.rangeDates = [yesterday, yesterday];

    this.filtros.set({
      tienda: '',
      fechaInicio: this.getDiaAnterior(),
      fechaFin: this.getDiaAnterior(),
    });

    this.getVentas();
  }

  getVentas() {
    const [inicio, fin] = this.rangeDates || [];
    if (inicio !== null && fin === null) {
      const fechaInicio = this.transformDate(inicio);
      const fechaFin = this.transformDate(inicio);

      this.updateFiltros({ fechaInicio, fechaFin });
      this.rangeDates = [inicio, inicio];
    }

    this.ventasService
      .getVentasCfe(this.filtros())
      .pipe(
        map((res) => {
          if (res.success) {
            if (!res.data || res.data.length === 0) {
              this.messageService.add({
                severity: 'info',
                summary: 'Sin resultados',
                detail:
                  res.message ||
                  'No se encontraron ventas con los filtros aplicados.',
                life: 3000,
              });
              return [];
            }
            const ventaTotal = res.data.reduce(
              (acc, val) => acc + val.venta,
              0,
            );
            this.ventaTotal.set(ventaTotal);
            return res.data;
          }
          return [];
        }),
        catchError((err: Error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err.message || 'Error al obtener las ventas. Inténtalo de nuevo.',
            life: 3000,
          });
          console.error('Error al obtener ventas:', err);
          return of([]);
        }),
      )
      .subscribe((ventas) => {
        this.listVentas.set(ventas);
      });
  }

  changeFecha(fechaRange: Date[]) {
    if (!fechaRange || fechaRange.length !== 2) {
      this.updateFiltros({ fechaInicio: undefined, fechaFin: undefined });
      return;
    }

    const [inicio, fin] = fechaRange;
    const fechaInicio = this.transformDate(inicio);
    const fechaFin = this.transformDate(fin);

    // Actualizamos los filtros
    this.updateFiltros({ fechaInicio, fechaFin });
  }

  updateFiltros(
    nuevosFiltros: Partial<{
      fechaInicio: string;
      fechaFin: string;
      tienda: string;
    }>,
  ) {
    this.filtros.update((current) => ({ ...current, ...nuevosFiltros }));
  }

  transformDate(fecha: Date | undefined): string | undefined {
    return fecha
      ? (this.datePipe.transform(fecha, 'yyyy-MM-dd') ?? undefined)
      : undefined;
  }

  private getDiaAnterior() {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 1);
    return this.datePipe.transform(hoy, 'yyyy-MM-dd') ?? '';
  }

  exportExcel() {
    const excel = this.listVentas().map((venta) => ({
      Tienda: venta.tienda,
      Fecha: this.datePipe.transform(
        new Date(venta.fecha + 'T00:00:00'),
        'dd/MM/yyyy',
      ),
      Venta: venta.venta,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excel);
    const range = XLSX.utils.decode_range(ws['!ref']!);

    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      // Columna Venta (C → índice 2)
      const ventaRef = XLSX.utils.encode_cell({ r: row, c: 2 });
      if (ws[ventaRef]) {
        ws[ventaRef].t = 'n';
        ws[ventaRef].z = '"$"#,##0.00';
      }
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'VentasCFE');
    XLSX.writeFile(wb, `VentasCFE.xlsx`);
  }
}
