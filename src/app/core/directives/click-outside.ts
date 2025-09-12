import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutside {
  @Output() clickOutside = new EventEmitter<void>();
  private el = inject(ElementRef<HTMLElement>);

  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return;
    if (!this.el.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }
}
