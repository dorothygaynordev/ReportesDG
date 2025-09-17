import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  ContentChild,
  ElementRef,
  input,
} from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [NgClass],
  templateUrl: './card.html',
  host: { class: 'block w-full' },
})
export class AppCard {
  // Signals
  title = input<string | undefined>();
  footerText = input<string | undefined>();
  cardClass = input<string>('');

  // Contenido proyectado
  @ContentChild('[card-header]', { static: false })
  projectedHeader?: ElementRef;
  @ContentChild('[card-footer]', { static: false })
  projectedFooter?: ElementRef;

  // Computed signals para mostrar header/footer
  showHeader = computed(
    () => !!this.title() || !!this.projectedHeader?.nativeElement,
  );
  showFooter = computed(
    () => !!this.footerText() || !!this.projectedFooter?.nativeElement,
  );
}
