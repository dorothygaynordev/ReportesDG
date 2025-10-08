import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-dg',
  imports: [],
  template: `
    <div
      class="flex flex-col justify-center items-center p-6 w-full"
      [style.height]="heigth()"
    >
      <img src="/images/logo.png" class="loader-image" alt="Company Logo" />
      <span class="loading-text">Cargando...</span>
    </div>
  `,
  styles: `
    .loader-image {
      height: 120px !important;
      animation: heartbeat 1.5s ease-in-out infinite both;
    }

    .loading-text {
      animation: heartbeat 1.5s ease-in-out infinite both;
      animation-delay: 0.2s;
    }

    @keyframes heartbeat {
      from {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(0.9);
        opacity: 0.7;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
})
export class LoadingDg {
  // @Input() height = 'calc(100vh - 150px)';
  // currentHeight = 'calc(100vh - 150px)';

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['height'] && changes['height'].currentValue) {
  //     this.currentHeight = changes['height'].currentValue;
  //   }
  // }

  heigth = input<string>('calc(100vh - 150px)');
}
