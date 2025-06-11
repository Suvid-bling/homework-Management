// rectangle-class.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 矩形类定义
class Rectangle {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  setWidth(width: number): void {
    if (width > 0) {
      this.width = width;
    }
  }

  setHeight(height: number): void {
    if (height > 0) {
      this.height = height;
    }
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  display(): string {
    return `矩形 - 宽度: ${this.width}, 高度: ${this.height}, 面积: ${this.getArea()}, 周长: ${this.getPerimeter()}`;
  }

  isSquare(): boolean {
    return this.width === this.height;
  }

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
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <header class="page-header">
        <h1>📐 模块化编程 - 矩形类</h1>
        <p class="description">
          演示面向对象编程中的类定义和使用，包括属性、方法、构造函数等概念。
          通过创建矩形类来展示模块化编程的基本原理。
        </p>
      </header>

      <div class="tabs">
        <button 
          class="tab-button"
          [class.active]="activeTab === 'definition'"
          (click)="activeTab = 'definition'">
          类定义
        </button>
        <button 
          class="tab-button"
          [class.active]="activeTab === 'demo'"
          (click)="activeTab = 'demo'">
          交互演示
        </button>
        <button 
          class="tab-button"
          [class.active]="activeTab === 'history'"
          (click)="activeTab = 'history'">
          历史记录 <span class="badge" *ngIf="rectangleHistory.length > 0">{{rectangleHistory.length}}</span>
        </button>
      </div>

      <!-- 类定义标签页 -->
      <div class="tab-content" *ngIf="activeTab === 'definition'">
        <div class="code-section">
          <h3>矩形类源代码</h3>
          <pre class="code-block">{{classDefinitionCode}}</pre>
          
          <h3>使用示例</h3>
          <pre class="code-block">{{usageExampleCode}}</pre>
        </div>
      </div>

      <!-- 交互演示标签页 -->
      <div class="tab-content" *ngIf="activeTab === 'demo'">
        <div class="demo-grid">
          <!-- 输入区域 -->
          <div class="input-section">
            <div class="card">
              <h3>创建矩形对象</h3>
              <form (ngSubmit)="createRectangle()" #rectForm="ngForm">
                <div class="form-group">
                  <label for="width">宽度</label>
                  <input 
                    type="number" 
                    id="width"
                    name="width"
                    [(ngModel)]="inputWidth"
                    placeholder="请输入矩形宽度"
                    required
                    min="0.1"
                    step="0.1">
                </div>

                <div class="form-group">
                  <label for="height">高度</label>
                  <input 
                    type="number" 
                    id="height"
                    name="height"
                    [(ngModel)]="inputHeight"
                    placeholder="请输入矩形高度"
                    required
                    min="0.1"
                    step="0.1">
                </div>

                <div class="error-message" *ngIf="showError">
                  ❌ {{errorMessage}}
                </div>

                <div class="button-group">
                  <button type="submit" class="btn btn-primary">
                    ➕ 创建矩形
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="reset()">
                    🔄 重置
                  </button>
                </div>
              </form>
            </div>

            <!-- 当前矩形信息 -->
            <div class="card" *ngIf="currentRectangle">
              <h3>当前矩形信息</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">宽度:</span>
                  <span class="value">{{currentRectangle.getWidth()}}</span>
                </div>
                <div class="info-item">
                  <span class="label">高度:</span>
                  <span class="value">{{currentRectangle.getHeight()}}</span>
                </div>
                <div class="info-item">
                  <span class="label">面积:</span>
                  <span class="value highlight">{{currentRectangle.getArea()}}</span>
                </div>
                <div class="info-item">
                  <span class="label">周长:</span>
                  <span class="value highlight">{{currentRectangle.getPerimeter()}}</span>
                </div>
                <div class="info-item">
                  <span class="label">对角线:</span>
                  <span class="value">{{currentRectangle.getDiagonal().toFixed(2)}}</span>
                </div>
                <div class="info-item">
                  <span class="label">类型:</span>
                  <span class="tag" [class.square]="currentRectangle.isSquare()">
                    {{currentRectangle.isSquare() ? '正方形' : '矩形'}}
                  </span>
                </div>
              </div>
              
              <div class="display-result">
                <strong>display() 方法输出:</strong>
                <p>{{currentRectangle.display()}}</p>
              </div>
            </div>
          </div>

          <!-- 可视化区域 -->
          <div class="visualization-section">
            <div class="card">
              <h3>图形可视化</h3>
              <div class="svg-container" *ngIf="currentRectangle">
                <svg width="280" height="280" viewBox="0 0 280 280">
                  <!-- 网格背景 -->
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f0f0f0" stroke-width="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="280" height="280" fill="url(#grid)" />
                  
                  <!-- 矩形 -->
                  <rect 
                    [attr.x]="getRectangleX()" 
                    [attr.y]="getRectangleY()"
                    [attr.width]="getRectangleWidth()" 
                    [attr.height]="getRectangleHeight()"
                    fill="#4CAF50" 
                    fill-opacity="0.3"
                    stroke="#4CAF50" 
                    stroke-width="2"/>
                  
                  <!-- 标注 -->
                  <text x="140" y="270" text-anchor="middle" font-size="12" fill="#666">
                    宽: {{currentRectangle.getWidth()}} × 高: {{currentRectangle.getHeight()}}
                  </text>
                </svg>
              </div>
              
              <div class="no-data" *ngIf="!currentRectangle">
                <div class="no-data-icon">📊</div>
                <p>创建矩形后显示图形</p>
              </div>
            </div>

            <!-- 特性说明 -->
            <div class="card">
              <h3>面向对象特性</h3>
              <div class="features-list">
                <div class="feature-item">
                  <span class="feature-icon">🔒</span>
                  <div>
                    <h4>封装性</h4>
                    <p>属性设为私有，通过方法访问</p>
                  </div>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">⚙️</span>
                  <div>
                    <h4>方法</h4>
                    <p>提供计算面积、周长等功能</p>
                  </div>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🔧</span>
                  <div>
                    <h4>构造函数</h4>
                    <p>初始化对象的宽度和高度</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 历史记录标签页 -->
      <div class="tab-content" *ngIf="activeTab === 'history'">
        <div class="card">
          <div class="history-header">
            <h3>创建历史</h3>
            <button 
              class="btn btn-secondary btn-small" 
              (click)="clearHistory()" 
              [disabled]="rectangleHistory.length === 0">
              🗑️ 清空历史
            </button>
          </div>
          
          <div class="table-container" *ngIf="rectangleHistory.length > 0">
            <table class="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>宽度</th>
                  <th>高度</th>
                  <th>面积</th>
                  <th>周长</th>
                  <th>对角线</th>
                  <th>类型</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let record of rectangleHistory; let i = index">
                  <td>{{record.id}}</td>
                  <td>{{record.width}}</td>
                  <td>{{record.height}}</td>
                  <td><strong>{{record.area}}</strong></td>
                  <td>{{record.perimeter}}</td>
                  <td>{{record.diagonal.toFixed(2)}}</td>
                  <td>
                    <span class="tag" [class.square]="record.isSquare">
                      {{record.isSquare ? '正方形' : '矩形'}}
                    </span>
                  </td>
                  <td>{{record.createTime | date:'HH:mm:ss'}}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="no-data" *ngIf="rectangleHistory.length === 0">
            <div class="no-data-icon">📝</div>
            <p>暂无历史记录</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    }

    .page-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      font-size: 2.5rem;
      color: #333;
      margin: 0 0 15px 0;
    }

    .description {
      font-size: 1.1rem;
      color: #666;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
    }

    .tabs {
      display: flex;
      border-bottom: 2px solid #e1e5e9;
      margin-bottom: 30px;
    }

    .tab-button {
      background: none;
      border: none;
      padding: 12px 24px;
      cursor: pointer;
      font-size: 1rem;
      color: #666;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
      position: relative;
    }

    .tab-button:hover {
      color: #007bff;
      background: #f8f9fa;
    }

    .tab-button.active {
      color: #007bff;
      border-bottom-color: #007bff;
      font-weight: 600;
    }

    .badge {
      background: #dc3545;
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 0.8rem;
      margin-left: 5px;
    }

    .tab-content {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card {
      background: white;
      border-radius: 10px;
      padding: 25px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      border: 1px solid #e1e5e9;
    }

    .card h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.3rem;
    }

    .code-section {
      max-width: 1000px;
      margin: 0 auto;
    }

    .code-block {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      overflow-x: auto;
      margin-bottom: 25px;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .button-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-top: 20px;
    }

    .btn {
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .btn-small {
      padding: 8px 16px;
      font-size: 0.9rem;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 6px;
      margin: 15px 0;
      border: 1px solid #f5c6cb;
    }

    .info-grid {
      display: grid;
      gap: 15px;
      margin-bottom: 20px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-item .label {
      font-weight: 600;
      color: #666;
    }

    .info-item .value {
      font-weight: 600;
      color: #333;
    }

    .info-item .value.highlight {
      color: #28a745;
      font-size: 1.1rem;
    }

    .tag {
      background: #007bff;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .tag.square {
      background: #28a745;
    }

    .display-result {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #e9ecef;
      margin-top: 15px;
    }

    .display-result strong {
      display: block;
      margin-bottom: 10px;
      color: #333;
    }

    .display-result p {
      margin: 0;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      color: #007bff;
      background: white;
      padding: 10px;
      border-radius: 4px;
    }

    .svg-container {
      text-align: center;
      background: #fafafa;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    .no-data-icon {
      font-size: 3rem;
      margin-bottom: 15px;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 15px;
    }

    .feature-icon {
      font-size: 1.5rem;
      margin-top: 5px;
    }

    .feature-item h4 {
      margin: 0 0 5px 0;
      color: #333;
      font-size: 1rem;
    }

    .feature-item p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .table-container {
      overflow-x: auto;
    }

    .history-table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }

    .history-table th,
    .history-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .history-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
    }

    .history-table tr:hover {
      background: #f8f9fa;
    }

    @media (max-width: 768px) {
      .demo-grid {
        grid-template-columns: 1fr;
      }
      
      .button-group {
        grid-template-columns: 1fr;
      }
      
      .container {
        padding: 15px;
      }
      
      .page-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class RectangleClassComponent {
  activeTab = 'definition';
  inputWidth: number | null = null;
  inputHeight: number | null = null;
  currentRectangle: Rectangle | null = null;
  rectangleHistory: RectangleRecord[] = [];
  showError: boolean = false;
  errorMessage: string = '';
  nextId: number = 1;

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

    this.currentRectangle = new Rectangle(this.inputWidth, this.inputHeight);

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

  getRectangleX(): number {
    if (!this.currentRectangle) return 0;
    const maxSize = 200;
    const width = this.currentRectangle.getWidth();
    const height = this.currentRectangle.getHeight();
    const scale = maxSize / Math.max(width, height);
    const scaledWidth = width * scale;
    return (280 - scaledWidth) / 2;
  }

  getRectangleY(): number {
    if (!this.currentRectangle) return 0;
    const maxSize = 200;
    const width = this.currentRectangle.getWidth();
    const height = this.currentRectangle.getHeight();
    const scale = maxSize / Math.max(width, height);
    const scaledHeight = height * scale;
    return (280 - scaledHeight) / 2;
  }

  getRectangleWidth(): number {
    if (!this.currentRectangle) return 0;
    const maxSize = 200;
    const width = this.currentRectangle.getWidth();
    const height = this.currentRectangle.getHeight();
    const scale = maxSize / Math.max(width, height);
    return width * scale;
  }

  getRectangleHeight(): number {
    if (!this.currentRectangle) return 0;
    const maxSize = 200;
    const width = this.currentRectangle.getWidth();
    const height = this.currentRectangle.getHeight();
    const scale = maxSize / Math.max(width, height);
    return height * scale;
  }
}