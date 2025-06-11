import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, NzCardModule],
  template: `
    <nz-card nzTitle="系统设置">
      <p>系统设置页面</p>
      <!-- 添加你的系统设置内容 -->
    </nz-card>
  `
})
export class SystemSettingsComponent {}