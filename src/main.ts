import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
// Fix: Import ng-zorro-antd providers and configuration
import { provideNzI18n, zh_CN } from 'ng-zorro-antd/i18n';
import { routes } from './app/app.routes';

// 注册中文语言包
registerLocaleData(zh);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    // Fix: Add ng-zorro-antd i18n provider
    provideNzI18n(zh_CN)
  ]
}).catch(err => console.error(err));