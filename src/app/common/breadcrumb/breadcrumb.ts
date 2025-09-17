import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrum',
  imports: [RouterLink, CommonModule],
  templateUrl: './breadcrumb.html',
})
export class Breadcrumb {
  public breadcrumbService = inject(BreadcrumbService);
}
