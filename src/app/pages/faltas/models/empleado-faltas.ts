export interface EmpleadoFaltas {
  cedula: number;
  claveTienda: string;
  nombre: string;
  faltas: DetalleFaltas[];
  total: number;
}

export interface DetalleFaltas {
  key: string;
  fechaFalta: string;
}
