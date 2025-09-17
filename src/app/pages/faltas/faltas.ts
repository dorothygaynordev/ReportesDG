import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AppCard } from '@shared/components/card/card';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
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
export class Faltas implements OnInit {
  private faltasService = inject(FaltasService);
  private cdr = inject(ChangeDetectorRef);
  public listFaltas: EmpleadoFaltas[] = [];

  ngOnInit(): void {
    this.faltasService.getFaltas().subscribe({
      next: (response) => {
        if (response.success) {
          this.listFaltas = response.data;
          this.cdr.detectChanges();
        } else {
          console.error('Failed to fetch faltas:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching faltas:', error.message);
      },
    });
  }
  // faltas = toSignal(
  //   this.faltasService.getFaltas().pipe(
  //     map((res) => {
  //       if (res.success) {
  //         console.log('Faltas fetched successfully', res);
  //         return res.data;
  //       }
  //       return [];
  //     }),
  //     catchError(() => {
  //       console.log('Error fetching faltas');
  //       return [];
  //     }),
  //   ),
  // );

  exportExcel() {
    const excel = this.listFaltas.map((falta) => ({
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
