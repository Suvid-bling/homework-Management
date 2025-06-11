// cylinder-calculator.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cylinder-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <header class="page-header">
        <h1>🧮 圆柱体计算器</h1>
        <p class="description">
          输入圆柱体的半径和高度，计算其表面积和体积。支持实时计算和可视化展示。
        </p>
      </header>

      <div class="calculator-grid">
        <!-- 输入区域 -->
        <div class="input-section">
          <div class="card">
            <h3>输入参数</h3>
            <form (ngSubmit)="calculate()" #calcForm="ngForm">
              <div class="form-group">
                <label for="radius">半径 (r)</label>
                <div class="input-with-unit">
                  <input 
                    type="number" 
                    id="radius"
                    name="radius"
                    [(ngModel)]="radius"
                    placeholder="请输入半径"
                    (keypress)="handleKeyPress($event)"
                    required
                    min="0.1"
                    step="0.1">
                  <span class="unit">单位</span>
                </div>
              </div>

              <div class="form-group">
                <label for="height">高度 (h)</label>
                <div class="input-with-unit">
                  <input 
                    type="number" 
                    id="height"
                    name="height"
                    [(ngModel)]="height"
                    placeholder="请输入高度"
                    (keypress)="handleKeyPress($event)"
                    required
                    min="0.1"
                    step="0.1">
                  <span class="unit">单位</span>
                </div>
              </div>

              <div class="error-message" *ngIf="showError">
                ❌ {{errorMessage}}
              </div>

              <div class="button-group">
                <button type="submit" class="btn btn-primary">
                  🧮 计算
                </button>
                <button type="button" class="btn btn-secondary" (click)="reset()">
                  🔄 重置
                </button>
              </div>
            </form>
          </div>

          <!-- 公式说明 -->
          <div class="card formula-card">
            <h3>计算公式</h3>
            <div class="formula-item">
              <h4>表面积公式：</h4>
              <div class="formula">S = 2πr² + 2πrh = 2πr(r + h)</div>
            </div>
            <div class="formula-item">
              <h4>体积公式：</h4>
              <div class="formula">V = πr²h</div>
            </div>
            <div class="formula-note">
              <p>其中：r 为底面半径，h 为高度，π ≈ 3.14159</p>
            </div>
          </div>
        </div>

        <!-- 结果展示区域 -->
        <div class="result-section">
          <div class="card result-card">
            <h3>计算结果</h3>
            <div class="results-grid">
              <div class="result-item">
                <div class="result-label">表面积</div>
                <div class="result-value surface-area">
                  {{formatNumber(surfaceArea)}}
                  <span class="result-unit" *ngIf="surfaceArea">平方单位</span>
                </div>
              </div>
              <div class="result-item">
                <div class="result-label">体积</div>
                <div class="result-value volume">
                  {{formatNumber(volume)}}
                  <span class="result-unit" *ngIf="volume">立方单位</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 可视化展示 -->
          <div class="card visualization-card" *ngIf="showVisualization">
            <h3>图形展示</h3>
            <div class="svg-container">
              <svg width="300" height="300" viewBox="0 0 300 300">
                <!-- 网格背景 -->
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f0f0f0" stroke-width="0.5"/>
                  </pattern>
                </defs>
                <rect width="300" height="300" fill="url(#grid)" />
                
                <!-- 圆柱体 -->
                <g transform="translate(0, 0)">
                  <!-- 主体 -->
                  <path [attr.d]="getCylinderPath()" fill="#2196F3" opacity="0.7" stroke="#1976D2" stroke-width="2"/>
                  <!-- 顶部 -->
                  <path [attr.d]="getTopEllipsePath()" fill="#42A5F5" stroke="#1976D2" stroke-width="2"/>
                </g>
                
                <!-- 标注 -->
                <text x="150" y="280" text-anchor="middle" font-size="14" fill="#333">
                  r = {{radius || 0}}, h = {{height || 0}}
                </text>
              </svg>
            </div>
          </div>

          <div class="card no-result" *ngIf="!showVisualization">
            <h3>图形展示</h3>
            <div class="no-data">
              <div class="no-data-icon">📊</div>
              <p>输入数据并计算后显示图形</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="card usage-card">
        <h3>💡 使用说明</h3>
        <ul class="usage-list">
          <li>输入圆柱体的半径和高度，单位自定</li>
          <li>点击"计算"按钮或按回车键进行计算</li>
          <li>系统会自动计算表面积和体积</li>
          <li>计算结果会以可视化形式展示</li>
          <li>点击"重置"按钮可清空所有数据</li>
        </ul>
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

    .calculator-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
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

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }

    .input-with-unit {
      display: flex;
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
      transition: border-color 0.3s ease;
    }

    .input-with-unit:focus-within {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .input-with-unit input {
      flex: 1;
      padding: 12px;
      border: none;
      outline: none;
      font-size: 1rem;
    }

    .unit {
      background: #f8f9fa;
      padding: 12px 15px;
      color: #666;
      border-left: 1px solid #ddd;
      font-size: 0.9rem;
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

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 6px;
      margin: 15px 0;
      border: 1px solid #f5c6cb;
    }

    .formula-card {
      background: linear-gradient(135deg, #f6f8ff 0%, #e3f2fd 100%);
    }

    .formula-item {
      margin-bottom: 16px;
    }

    .formula-item h4 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    .formula {
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 1.1rem;
      color: #007bff;
      background: white;
      padding: 12px 15px;
      border-radius: 6px;
      display: inline-block;
      border: 1px solid #e3f2fd;
    }

    .formula-note {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e3f2fd;
    }

    .formula-note p {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
      font-style: italic;
    }

    .result-card {
      background: linear-gradient(135deg, #f6ffed 0%, #f0f8ff 100%);
    }

    .results-grid {
      display: grid;
      gap: 20px;
    }

    .result-item {
      text-align: center;
      padding: 20px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e8f5e8;
    }

    .result-label {
      font-size: 1rem;
      font-weight: 600;
      color: #666;
      margin-bottom: 10px;
    }

    .result-value {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .result-value.surface-area {
      color: #28a745;
    }

    .result-value.volume {
      color: #dc3545;
    }

    .result-unit {
      font-size: 0.9rem;
      font-weight: 400;
      color: #666;
      margin-left: 5px;
    }

    .visualization-card, .no-result {
      background: #fafafa;
    }

    .svg-container {
      text-align: center;
      background: white;
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

    .usage-card {
      background: linear-gradient(135deg, #fffbe6 0%, #fff7e6 100%);
      border: 1px solid #ffe58f;
    }

    .usage-list {
      margin: 0;
      padding-left: 25px;
      color: #666;
    }

    .usage-list li {
      margin-bottom: 10px;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .calculator-grid {
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
      
      .result-value {
        font-size: 1.5rem;
      }
    }
  `]
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