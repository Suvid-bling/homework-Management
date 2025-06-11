import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

// 矩形类定义
class Rectangle {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  // 获取宽度
  getWidth(): number {
    return this.width;
  }

  // 获取高度
  getHeight(): number {
    return this.height;
  }

  // 设置宽度
  setWidth(width: number): void {
    if (width > 0) {
      this.width = width;
    }
  }

  // 设置高度
  setHeight(height: number): void {
    if (height > 0) {
      this.height = height;
    }
  }

  // 计算面积
  getArea(): number {
    return this.width * this.height;
  }

  // 计算周长
  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  // 显示信息
  display(): string {
    return `矩形 - 宽度: ${this.width}, 高度: ${this.height}, 面积: ${this.getArea()}, 周长: ${this.getPerimeter()}`;
  }

  // 判断是否为正方形
  isSquare(): boolean {
    return this.width === this.height;
  }

  // 获取对角线长度
  getDiagonal(): number {
    return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
  }
}

interface RectangleRecord {
  id: number;
  width: number;
  height: number;
  area: number;
  perimeter: number;
  diagonal: number;
  isSquare: boolean;
  createTime: Date;
}

@Component({
  selector: 'app-rectangle-class',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzInputModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    NzAlertModule,
    NzIconModule,
    NzTagModule,
    NzGridModule,
    NzTabsModule
  ],
  templateUrl: './rectangle-class.component.html',
  styleUrls: ['./rectangle-class.component.css']
})
export class RectangleClassComponent {
  inputWidth: number | null = null;
  inputHeight: number | null = null;
  currentRectangle: Rectangle | null = null;
  rectangleHistory: RectangleRecord[] = [];
  showError: boolean = false;
  errorMessage: string = '';
  nextId: number = 1;

  // 类定义代码
  classDefinitionCode = `// 矩形类定义
class Rectangle {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  // 获取宽度
  getWidth(): number {
    return this.width;
  }

  // 获取高度
  getHeight(): number {
    return this.height;
  }

  // 计算面积
  getArea(): number {
    return this.width * this.height;
  }

  // 计算周长
  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  // 显示信息
  display(): string {
    return \`矩形 - 宽度: \${this.width}, 高度: \${this.height}, 
            面积: \${this.getArea()}, 周长: \${this.getPerimeter()}\`;
  }
}`;

  // 使用示例代码
  usageExampleCode = `// 创建矩形对象
const rect1 = new Rectangle(10, 5);
console.log(rect1.display());
// 输出: 矩形 - 宽度: 10, 高度: 5, 面积: 50, 周长: 30

// 创建正方形
const square = new Rectangle(6, 6);
console.log(square.display());
// 输出: 矩形 - 宽度: 6, 高度: 6, 面积: 36, 周长: 24

// 获取属性
console.log('面积:', rect1.getArea());        // 50
console.log('周长:', rect1.getPerimeter());    // 30`;

  createRectangle(): void {
    this.showError = false;
    this.errorMessage = '';

    // 验证输入
    if (this.inputWidth === null || this.inputWidth <= 0) {
      this.showError = true;
      this.errorMessage = '请输入有效的宽度（大于0）';
      return;
    }

    if (this.inputHeight === null || this.inputHeight <= 0) {
      this.showError = true;
      this.errorMessage = '请输入有效的高度（大于0）';
      return;
    }

    // 创建矩形对象
    this.currentRectangle = new Rectangle(this.inputWidth, this.inputHeight);

    // 添加到历史记录
    const record: RectangleRecord = {
      id: this.nextId++,
      width: this.inputWidth,
      height: this.inputHeight,
      area: this.currentRectangle.getArea(),
      perimeter: this.currentRectangle.getPerimeter(),
      diagonal: this.currentRectangle.getDiagonal(),
      isSquare: this.currentRectangle.isSquare(),
      createTime: new Date()
    };

    this.rectangleHistory.unshift(record);
  }

  clearHistory(): void {
    this.rectangleHistory = [];
    this.currentRectangle = null;
    this.nextId = 1;
  }

  reset(): void {
    this.inputWidth = null;
    this.inputHeight = null;
    this.currentRectangle = null;
    this.showError = false;
    this.errorMessage = '';
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.createRectangle();
    }
  }

  // 获取SVG路径用于可视化
  getRectanglePath(): string {
    if (!this.currentRectangle) return '';
    
    const maxSize = 200;
    const padding = 20;
    const width = this.currentRectangle.getWidth();
    const height = this.currentRectangle.getHeight();
    const scale = (maxSize - padding * 2) / Math.max(width, height);
    
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    const x = (250 - scaledWidth) / 2;
    const y = (250 - scaledHeight) / 2;
    
    return `M ${x} ${y} L ${x + scaledWidth} ${y} L ${x + scaledWidth} ${y + scaledHeight} L ${x} ${y + scaledHeight} Z`;
  }
}