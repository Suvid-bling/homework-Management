import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, NzResultModule, NzButtonModule],
  template: `
    <nz-result 
      nzStatus="404" 
      nzTitle="404" 
      nzSubTitle="抱歉，您访问的页面不存在。">
      <div nz-result-extra>
        <button nz-button nzType="primary" routerLink="/dashboard">
          返回首页
        </button>
      </div>
    </nz-result>
  `
})
export class NotFoundComponent {}