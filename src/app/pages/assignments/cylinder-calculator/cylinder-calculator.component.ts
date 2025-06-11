import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-cylinder-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzInputModule,
    NzButtonModule,
    NzFormModule,
    NzGridModule,
    NzStatisticModule,
    NzDividerModule,
    NzAlertModule,
    NzIconModule
  ],
  templateUrl: './cylinder-calculator.component.html',
  styleUrls: ['./cylinder-calculator.component.css']
})
export class CylinderCalculatorComponent {
  radius: number | null = null;
  height: number | null = null;
  surfaceArea: number | null = null;
  volume: number | null = null;
  showError: boolean = false;
  errorMessage: string = '';
  showVisualization: boolean = false;

  calculate(): void {
    this.showError = false;
    this.errorMessage = '';

    // 验证输入
    if (this.radius === null || this.radius <= 0) {
      this.showError = true;
      this.errorMessage = '请输入有效的半径（大于0）';
      return;
    }

    if (this.height === null || this.height <= 0) {
      this.showError = true;
      this.errorMessage = '请输入有效的高度（大于0）';
      return;
    }

    // 计算表面积和体积
    // 表面积 = 2πr² + 2πrh = 2πr(r + h)
    this.surfaceArea = 2 * Math.PI * this.radius * (this.radius + this.height);
    
    // 体积 = πr²h
    this.volume = Math.PI * Math.pow(this.radius, 2) * this.height;

    // 显示可视化
    this.showVisualization = true;
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.calculate();
    }
  }

  reset(): void {
    this.radius = null;
    this.height = null;
    this.surfaceArea = null;
    this.volume = null;
    this.showError = false;
    this.errorMessage = '';
    this.showVisualization = false;
  }

  // 格式化数字显示
  formatNumber(value: number | null): string {
    if (value === null) return '--';
    return value.toFixed(2);
  }

  // 获取圆柱体的SVG路径
  getCylinderPath(): string {
    if (!this.radius || !this.height) return '';
    
    const scale = 100 / Math.max(this.radius * 2, this.height);
    const r = this.radius * scale;
    const h = this.height * scale;
    const cy = 150 - h / 2;
    
    return `
      M ${150 - r} ${cy}
      A ${r} ${r * 0.3} 0 0 0 ${150 + r} ${cy}
      L ${150 + r} ${cy + h}
      A ${r} ${r * 0.3} 0 0 1 ${150 - r} ${cy + h}
      Z
    `;
  }

  // 获取顶部椭圆的SVG路径
  getTopEllipsePath(): string {
    if (!this.radius || !this.height) return '';
    
    const scale = 100 / Math.max(this.radius * 2, this.height);
    const r = this.radius * scale;
    const h = this.height * scale;
    const cy = 150 - h / 2;
    
    return `
      M ${150 - r} ${cy}
      A ${r} ${r * 0.3} 0 0 1 ${150 + r} ${cy}
      A ${r} ${r * 0.3} 0 0 1 ${150 - r} ${cy}
    `;
  }
}