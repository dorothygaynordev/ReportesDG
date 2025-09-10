import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
    <div class="bg-white dark:bg-gray-900">
      <div class="flex justify-center h-screen">
        <div
          class="hidden bg-cover lg:block lg:w-2/3 bg-[url(/images/bg-login.jpg)]"
        >
          <div class="flex items-center h-full px-20 bg-gray-900/20"></div>
        </div>

        <div class="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div class="flex-1">
            <div class="text-center">
              <h2
                class="text-4xl font-bold text-center text-gray-700 dark:text-white"
              >
                <img
                  src="/images/brand_black.png"
                  alt="Logo"
                  class="w-[250px] mx-auto mb-2"
                />
              </h2>
              <p class="text-xl text-gray-700 dark:text-gray-300 font-semibold">
                Iniciar sesión
              </p>
            </div>
            <div class="mt-6">
              <router-outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthLayout {}
