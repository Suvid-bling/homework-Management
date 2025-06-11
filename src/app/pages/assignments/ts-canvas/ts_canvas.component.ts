// src/app/pages/assignments/ts-canvas/ts-canvas.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-ts-canvas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzTabsModule,
    NzSelectModule,
    NzToolTipModule,
    NzDividerModule,
    NzAlertModule
  ],
  // styleUrls: ['./ts_canavas.css']
  template: `
    <div class="ts-canvas-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="title-icon">🎨</span>
          TypeScript Canvas - 在线代码执行器
        </h1>
        <p class="page-description">
          实时编写和执行TypeScript代码，支持语法高亮、错误提示和多种预设示例。
        </p>
      </div>

      <!-- Main Canvas Area -->
      <nz-card class="canvas-card">
        <nz-tabset nzTabPosition="top" [nzTabBarExtraContent]="extraTemplate">
          <!-- Code Editor Tab -->
          <nz-tab nzTitle="代码编辑器">
            <div class="editor-container">
              <div class="editor-toolbar">
                <div class="toolbar-left">
                  <nz-select 
                    [(ngModel)]="selectedExample" 
                    (ngModelChange)="loadExample()"
                    nzPlaceHolder="选择示例代码"
                    style="width: 200px;">
                    <nz-option 
                      *ngFor="let example of codeExamples" 
                      [nzValue]="example.key" 
                      [nzLabel]="example.name">
                    </nz-option>
                  </nz-select>
                  <button 
                    nz-button 
                    nzType="primary" 
                    (click)="runCode()"
                    [nzLoading]="isRunning">
                    <span nz-icon nzType="play-circle"></span>
                    运行代码
                  </button>
                  <button 
                    nz-button 
                    nzType="default" 
                    (click)="clearCode()">
                    <span nz-icon nzType="clear"></span>
                    清空
                  </button>
                </div>
                <div class="toolbar-right">
                  <button 
                    nz-button 
                    nzType="default" 
                    nz-tooltip 
                    nzTooltipTitle="复制代码"
                    (click)="copyCode()">
                    <span nz-icon nzType="copy"></span>
                  </button>
                  <button 
                    nz-button 
                    nzType="default" 
                    nz-tooltip 
                    nzTooltipTitle="全屏"
                    (click)="toggleFullscreen()">
                    <span nz-icon [nzType]="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"></span>
                  </button>
                </div>
              </div>

              <div class="code-editor-wrapper" [class.fullscreen]="isFullscreen">
                <textarea 
                  #codeEditor
                  class="code-editor"
                  [(ngModel)]="currentCode"
                  placeholder="在这里输入您的TypeScript代码..."
                  spellcheck="false"
                  (input)="onCodeChange()"
                  (keydown)="onKeyDown($event)">
                </textarea>
                <div class="line-numbers" #lineNumbers></div>
              </div>

              <!-- Error Display -->
              <div class="error-panel" *ngIf="hasError">
                <nz-alert 
                  nzType="error" 
                  [nzMessage]="errorMessage" 
                  nzShowIcon 
                  nzCloseable 
                  (nzOnClose)="clearError()">
                </nz-alert>
              </div>
            </div>
          </nz-tab>

          <!-- Output Tab -->
          <nz-tab nzTitle="运行结果">
            <div class="output-container">
              <div class="output-toolbar">
                <span class="output-label">
                  <span nz-icon nzType="code"></span>
                  执行结果
                </span>
                <button 
                  nz-button 
                  nzType="default" 
                  nzSize="small"
                  (click)="clearOutput()">
                  <span nz-icon nzType="clear"></span>
                  清空输出
                </button>
              </div>
              <div class="output-content" #outputContent>
                <div 
                  *ngFor="let log of outputLogs; let i = index" 
                  class="output-line"
                  [class]="getLogClass(log.type)">
                  <span class="log-timestamp">{{ log.timestamp }}</span>
                  <span class="log-type">[{{ log.type.toUpperCase() }}]</span>
                  <span class="log-message">{{ log.message }}</span>
                </div>
                <div *ngIf="outputLogs.length === 0" class="no-output">
                  <span nz-icon nzType="info-circle"></span>
                  运行代码后将在这里显示结果
                </div>
              </div>
            </div>
          </nz-tab>

          <!-- Canvas Tab -->
          <nz-tab nzTitle="图形输出">
            <div class="canvas-container">
              <div class="canvas-toolbar">
                <span class="canvas-label">
                  <span nz-icon nzType="picture"></span>
                  Canvas 画布
                </span>
                <button 
                  nz-button 
                  nzType="default" 
                  nzSize="small"
                  (click)="clearCanvas()">
                  <span nz-icon nzType="clear"></span>
                  清空画布
                </button>
              </div>
              <canvas 
                #canvas 
                class="drawing-canvas"
                width="800" 
                height="400">
                您的浏览器不支持Canvas
              </canvas>
            </div>
          </nz-tab>

          <!-- Help Tab -->
          <nz-tab nzTitle="使用帮助">
            <div class="help-container">
              <div class="help-section">
                <h3>🚀 快速开始</h3>
                <ul>
                  <li>在代码编辑器中输入TypeScript代码</li>
                  <li>点击"运行代码"按钮执行</li>
                  <li>在"运行结果"标签页查看输出</li>
                  <li>如果代码涉及Canvas绘图，请查看"图形输出"标签页</li>
                </ul>
              </div>

              <div class="help-section">
                <h3>💡 可用的API</h3>
                <ul>
                  <li><code>console.log()</code> - 输出信息到控制台</li>
                  <li><code>console.warn()</code> - 输出警告信息</li>
                  <li><code>console.error()</code> - 输出错误信息</li>
                  <li><code>drawPixel(x, y, color)</code> - 在Canvas上绘制像素点</li>
                  <li><code>drawLine(x1, y1, x2, y2, color)</code> - 绘制直线</li>
                  <li><code>drawRect(x, y, width, height, color)</code> - 绘制矩形</li>
                  <li><code>drawCircle(x, y, radius, color)</code> - 绘制圆形</li>
                  <li><code>clearCanvas()</code> - 清空画布</li>
                </ul>
              </div>

              <div class="help-section">
                <h3>⌨️ 快捷键</h3>
                <ul>
                  <li><kbd>Ctrl + Enter</kbd> - 运行代码</li>
                  <li><kbd>Tab</kbd> - 插入缩进</li>
                  <li><kbd>Ctrl + A</kbd> - 全选代码</li>
                  <li><kbd>F11</kbd> - 切换全屏模式</li>
                </ul>
              </div>

              <div class="help-section">
                <h3>📝 示例代码</h3>
                <p>选择上方的示例代码快速体验不同功能：</p>
                <ul>
                  <li><strong>基础输出</strong> - 学习如何使用console输出</li>
                  <li><strong>数据类型</strong> - 了解TypeScript的数据类型</li>
                  <li><strong>函数定义</strong> - 学习函数的定义和调用</li>
                  <li><strong>Canvas绘图</strong> - 体验图形绘制功能</li>
                  <li><strong>算法演示</strong> - 查看算法的执行过程</li>
                </ul>
              </div>
            </div>
          </nz-tab>
        </nz-tabset>

        <!-- Extra Template for Tab Bar -->
        <ng-template #extraTemplate>
          <div class="tab-extra">
            <span class="execution-status" [class]="executionStatus">
              <span nz-icon [nzType]="getStatusIcon()"></span>
              {{ getStatusText() }}
            </span>
          </div>
        </ng-template>
      </nz-card>
    </div>
  `,
  styles: [`
.ts-canvas-container {
  padding: 0;
  height: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 32px;
}

.page-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.canvas-card {
  height: calc(100vh - 150px);
  min-height: 700px;
}

.canvas-card ::ng-deep .ant-card-body {
  height: 100%;
  padding: 0;
}

.canvas-card ::ng-deep .ant-tabs {
  height: 100%;
}

.canvas-card ::ng-deep .ant-tabs-content-holder {
  height: calc(100% - 46px);
}

.canvas-card ::ng-deep .ant-tabs-tabpane {
  height: 100%;
  overflow: hidden;
}

/* Editor Styles */
.editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.toolbar-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.code-editor-wrapper {
  flex: 1;
  position: relative;
  background: #1e1e1e;
  overflow: hidden;
  min-height: 500px;
}

.code-editor-wrapper.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}

.code-editor {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border: none;
  outline: none;
  padding: 16px 16px 16px 60px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: #1e1e1e;
  color: #d4d4d4;
  resize: none;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
  overflow-y: auto;
}

.line-numbers {
  position: absolute;
  top: 16px;
  left: 0;
  width: 50px;
  height: calc(100% - 32px);
  min-height: 468px;
  background: #252526;
  border-right: 1px solid #3e3e42;
  color: #858585;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  text-align: right;
  padding: 0 8px;
  pointer-events: none;
  overflow: hidden;
}

.error-panel {
  padding: 16px;
  background: #fff2f0;
  border-top: 1px solid #ffccc7;
}

/* Output Styles */
.output-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.output-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.output-label, .canvas-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.output-content {
  flex: 1;
  padding: 16px;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  overflow-y: auto;
}

.output-line {
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.output-line.log {
  color: #d4d4d4;
}

.output-line.warn {
  color: #ffa500;
}

.output-line.error {
  color: #ff6b6b;
}

.log-timestamp {
  color: #858585;
  font-size: 12px;
  min-width: 80px;
}

.log-type {
  color: #4fc3f7;
  font-weight: 600;
  min-width: 60px;
}

.log-message {
  flex: 1;
  word-break: break-word;
}

.no-output {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  font-style: italic;
}

/* Canvas Styles */
.canvas-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.canvas-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.drawing-canvas {
  flex: 1;
  border: 1px solid #d9d9d9;
  background: white;
  margin: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Help Styles */
.help-container {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.help-section {
  margin-bottom: 32px;
}

.help-section h3 {
  color: #1890ff;
  margin-bottom: 16px;
  font-size: 18px;
}

.help-section ul {
  line-height: 1.8;
}

.help-section code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.help-section kbd {
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  padding: 2px 6px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
}

/* Tab Extra */
.tab-extra {
  display: flex;
  align-items: center;
  gap: 12px;
}

.execution-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.execution-status.idle {
  background: #f0f2f5;
  color: #666;
}

.execution-status.running {
  background: #e6f7ff;
  color: #1890ff;
}

.execution-status.success {
  background: #f6ffed;
  color: #52c41a;
}

.execution-status.error {
  background: #fff2f0;
  color: #ff4d4f;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
    flex-direction: column;
    gap: 8px;
  }

  .editor-toolbar, .output-toolbar, .canvas-toolbar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .toolbar-left, .toolbar-right {
    justify-content: center;
  }

  .code-editor {
    padding-left: 16px;
    min-height: 300px;
  }

  .line-numbers {
    display: none;
  }

  .canvas-card {
    height: calc(100vh - 100px);
    min-height: 500px;
  }

  .code-editor-wrapper {
    min-height: 300px;
  }
}
  `]
})
export class TsCanvasComponent implements AfterViewInit {
  @ViewChild('codeEditor', { static: true }) codeEditor!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('lineNumbers', { static: true }) lineNumbers!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('outputContent', { static: true }) outputContent!: ElementRef<HTMLDivElement>;

  currentCode = '';
  selectedExample = '';
  outputLogs: Array<{type: 'log' | 'warn' | 'error', message: string, timestamp: string}> = [];
  hasError = false;
  errorMessage = '';
  isRunning = false;
  isFullscreen = false;
  executionStatus: 'idle' | 'running' | 'success' | 'error' = 'idle';

  private ctx!: CanvasRenderingContext2D;
  private originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error
  };

  codeExamples = [
    {
      key: 'basic',
      name: '基础输出',
      code: `// 基础输出示例
console.log('Hello, TypeScript Canvas!');
console.log('当前时间:', new Date().toLocaleString());

// 数字计算
const a = 10;
const b = 20;
console.log(\`\${a} + \${b} = \${a + b}\`);

// 数组操作
const numbers = [1, 2, 3, 4, 5];
console.log('数组:', numbers);
console.log('数组和:', numbers.reduce((sum, num) => sum + num, 0));`
    },
    {
      key: 'types',
      name: '数据类型',
      code: `// TypeScript 数据类型演示
let isActive: boolean = true;
let count: number = 42;
let name: string = "TypeScript";
let items: number[] = [1, 2, 3, 4, 5];
let person: {name: string, age: number} = {name: "张三", age: 25};

console.log('布尔值:', isActive);
console.log('数字:', count);
console.log('字符串:', name);
console.log('数组:', items);
console.log('对象:', person);

// 枚举类型
enum Color {Red, Green, Blue}
let favoriteColor: Color = Color.Blue;
console.log('枚举值:', Color[favoriteColor]);

// 联合类型
let value: string | number = "Hello";
console.log('联合类型 (字符串):', value);
value = 123;
console.log('联合类型 (数字):', value);`
    },
    {
      key: 'functions',
      name: '函数定义',
      code: `// 函数定义和调用
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

// 箭头函数
const add = (x: number, y: number): number => x + y;

// 可选参数
function introduce(name: string, age?: number): string {
    if (age) {
        return \`我是\${name}，今年\${age}岁\`;
    }
    return \`我是\${name}\`;
}

// 函数调用
console.log(greet('TypeScript'));
console.log('计算结果:', add(15, 25));
console.log(introduce('小明', 20));
console.log(introduce('小红'));

// 高阶函数
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);

console.log('原数组:', numbers);
console.log('翻倍后:', doubled);
console.log('偶数:', evens);`
    },
    {
      key: 'canvas',
      name: 'Canvas绘图',
      code: `// Canvas 绘图示例
console.log('开始绘制图形...');

// 清空画布
clearCanvas();

// 绘制彩色矩形
drawRect(50, 50, 100, 80, '#ff6b6b');
drawRect(170, 50, 100, 80, '#4ecdc4');
drawRect(290, 50, 100, 80, '#45b7d1');

// 绘制圆形
drawCircle(100, 200, 40, '#96ceb4');
drawCircle(220, 200, 40, '#feca57');
drawCircle(340, 200, 40, '#ff9ff3');

// 绘制线条连接
drawLine(100, 160, 220, 160, '#2d3436');
drawLine(220, 160, 340, 160, '#2d3436');
drawLine(100, 240, 340, 240, '#2d3436');

// 绘制像素点组成的图案
for (let i = 0; i < 50; i++) {
    const x = 450 + Math.random() * 100;
    const y = 150 + Math.random() * 100;
    const colors = ['#e17055', '#74b9ff', '#00b894', '#fdcb6e'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    drawPixel(x, y, color);
}

console.log('绘制完成！');`
    },
    {
      key: 'algorithm',
      name: '算法演示',
      code: `// 算法演示 - 冒泡排序可视化
console.log('冒泡排序算法演示');

const array = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50];
console.log('原始数组:', array.join(', '));

function bubbleSort(arr: number[]): void {
    const n = arr.length;
    let step = 0;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            step++;
            if (arr[j] > arr[j + 1]) {
                // 交换元素
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                console.log(\`步骤 \${step}: 交换 \${arr[j + 1]} 和 \${arr[j]} -> [\${arr.join(', ')}]\`);
            }
        }
        console.log(\`第 \${i + 1} 轮完成: [\${arr.join(', ')}]\`);
    }
}

// 执行排序
bubbleSort([...array]);
console.log('排序完成！');

// 斐波那契数列
console.log('\\n斐波那契数列前10项:');
function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const fibSequence = [];
for (let i = 0; i < 10; i++) {
    fibSequence.push(fibonacci(i));
}
console.log(fibSequence.join(', '));`
    }
  ];

  constructor(private message: NzMessageService) {}

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.setupCanvasAPI();
    this.setupConsoleOverride();
    this.updateLineNumbers();
    this.loadExample('basic');
  }

  loadExample(key?: string): void {
    const exampleKey = key || this.selectedExample;
    const example = this.codeExamples.find(ex => ex.key === exampleKey);
    if (example) {
      this.currentCode = example.code;
      this.selectedExample = exampleKey;
      this.updateLineNumbers();
    }
  }

  onCodeChange(): void {
    this.updateLineNumbers();
    this.clearError();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = this.codeEditor.nativeElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      this.currentCode = textarea.value;
      this.updateLineNumbers();
    }
    
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.runCode();
    }
    
    if (event.key === 'F11') {
      event.preventDefault();
      this.toggleFullscreen();
    }
  }

  updateLineNumbers(): void {
    const lines = this.currentCode.split('\n').length;
    const lineNumbersText = Array.from({length: lines}, (_, i) => i + 1).join('\n');
    this.lineNumbers.nativeElement.textContent = lineNumbersText;
  }

  runCode(): void {
    if (!this.currentCode.trim()) {
      this.message.warning('请输入代码后再运行');
      return;
    }

    this.isRunning = true;
    this.executionStatus = 'running';
    this.clearError();
    
    try {
      // 模拟异步执行
      setTimeout(() => {
        try {
          this.executeCode(this.currentCode);
          this.executionStatus = 'success';
          this.message.success('代码执行成功');
        } catch (error: any) {
          this.handleExecutionError(error);
          this.executionStatus = 'error';
        } finally {
          this.isRunning = false;
          setTimeout(() => {
            this.executionStatus = 'idle';
          }, 3000);
        }
      }, 500);
    } catch (error: any) {
      this.handleExecutionError(error);
      this.executionStatus = 'error';
      this.isRunning = false;
    }
  }

  private executeCode(code: string): void {
    try {
      // 创建一个安全的执行环境
      const wrappedCode = `
        (function() {
          ${code}
        })();
      `;
      
      // 使用Function构造函数执行代码
      const func = new Function(wrappedCode);
      func();
    } catch (error: any) {
      throw new Error(`执行错误: ${error.message}`);
    }
  }

  private setupConsoleOverride(): void {
    // 重写console方法以捕获输出
    const self = this;
    
    console.log = (...args: any[]) => {
      self.addLog('log', args.join(' '));
      self.originalConsole.log(...args);
    };
    
    console.warn = (...args: any[]) => {
      self.addLog('warn', args.join(' '));
      self.originalConsole.warn(...args);
    };
    
    console.error = (...args: any[]) => {
      self.addLog('error', args.join(' '));
      self.originalConsole.error(...args);
    };
  }

  private setupCanvasAPI(): void {
    // 在全局作用域添加Canvas绘图API
    (window as any).drawPixel = (x: number, y: number, color: string) => {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, 1, 1);
    };

    (window as any).drawLine = (x1: number, y1: number, x2: number, y2: number, color: string) => {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    };

    (window as any).drawRect = (x: number, y: number, width: number, height: number, color: string) => {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, width, height);
    };

    (window as any).drawCircle = (x: number, y: number, radius: number, color: string) => {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.fill();
    };

    (window as any).clearCanvas = () => {
      this.clearCanvas();
    };
  }

  private addLog(type: 'log' | 'warn' | 'error', message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.outputLogs.push({ type, message, timestamp });
    
    // 自动滚动到底部
    setTimeout(() => {
      const outputElement = this.outputContent.nativeElement;
      outputElement.scrollTop = outputElement.scrollHeight;
    }, 0);
  }

  private handleExecutionError(error: any): void {
    this.hasError = true;
    this.errorMessage = error.message || '代码执行出错';
    this.addLog('error', this.errorMessage);
    this.message.error('代码执行失败');
  }

  clearCode(): void {
    this.currentCode = '';
    this.selectedExample = '';
    this.updateLineNumbers();
    this.clearError();
  }

  clearOutput(): void {
    this.outputLogs = [];
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  clearError(): void {
    this.hasError = false;
    this.errorMessage = '';
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.currentCode).then(() => {
      this.message.success('代码已复制到剪贴板');
    }).catch(() => {
      this.message.error('复制失败，请手动选择代码复制');
    });
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  getLogClass(type: string): string {
    return type;
  }

  getStatusIcon(): string {
    switch (this.executionStatus) {
      case 'running': return 'loading';
      case 'success': return 'check-circle';
      case 'error': return 'close-circle';
      default: return 'clock-circle';
    }
  }

  getStatusText(): string {
    switch (this.executionStatus) {
      case 'running': return '执行中...';
      case 'success': return '执行成功';
      case 'error': return '执行失败';
      default: return '就绪';
    }
  }

  ngOnDestroy(): void {
    // 恢复原始console方法
    console.log = this.originalConsole.log;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
    
    // 清理全局API
    delete (window as any).drawPixel;
    delete (window as any).drawLine;
    delete (window as any).drawRect;
    delete (window as any).drawCircle;
    delete (window as any).clearCanvas;
    
    // 恢复body样式
    document.body.style.overflow = '';
  }
}