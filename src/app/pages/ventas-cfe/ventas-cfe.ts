import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCard } from '@shared/components/card/card';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
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
  ],
  providers: [DatePipe],
  templateUrl: './ventas-cfe.html',
})
export class VentasCfe {
  private ventasService = inject(VentasCfeService);
  private datePipe = inject(DatePipe);
  findTienda = '';
  rangeDates: Date[] = [];
  public listVentas = signal<IVentasCfe[]>([]);

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
    this.ventasService
      .getVentasCfe(this.filtros())
      .pipe(
        map((res) => (res.success ? res.data : [])),
        catchError((err) => {
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
    const fechaInicio = this.datePipe.transform(inicio, 'yyyy-MM-dd') ?? '';
    const fechaFin = this.datePipe.transform(fin, 'yyyy-MM-dd') ?? '';

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

  private getDiaAnterior() {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 1);
    return this.datePipe.transform(hoy, 'yyyy-MM-dd') ?? '';
  }

  exportExcel() {
    const excel = this.listVentas().map((venta) => ({
      Tienda: venta.tienda,
      Fecha: venta.fecha,
      Venta: venta.venta,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excel);
    // 2. Agregar formato de moneda a la columna "Venta"
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: 2 }); // columna 2 = "Venta"
      if (ws[cellRef]) {
        ws[cellRef].t = 'n'; // tipo number
        ws[cellRef].z = '"$"#,##0.00'; // formato moneda (ej: $1,234.56)
      }
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'VentasCFE');
    XLSX.writeFile(wb, `VentasCFE.xlsx`);
  }
}
