import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { FaltasService } from './faltas.service';
import { EmpleadoFaltas } from './models/empleado-faltas';

@Component({
  selector: 'app-faltas',
  imports: [CardModule, ButtonModule, TableModule, ListboxModule, DatePipe],
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
          console.log('Faltas fetched successfully', response);
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
}
