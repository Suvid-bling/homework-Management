// directives-demo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
  score: number;
  subjects: string[];
}

interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'array';
}

@Component({
  selector: 'app-directives-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <header class="page-header">
        <h1>📋 指令使用演示</h1>
        <p class="description">
          展示Angular内置指令的使用，包括ngFor指令打印数据表格和四个方向的九九乘法表。
        </p>
      </header>

      <div class="tabs">
        <button 
          class="tab-button"
          [class.active]="activeTab === 'table'"
          (click)="activeTab = 'table'">
          📊 数据表格
        </button>
        <button 
          class="tab-button"
          [class.active]="activeTab === 'multiplication'"
          (click)="activeTab = 'multiplication'">
          🔢 九九乘法表
        </button>
        <button 
          class="tab-button"
          [class.active]="activeTab === 'directives'"
          (click)="activeTab = 'directives'">
          ⚙️ 指令说明
        </button>
      </div>

      <!-- 数据表格标签页 -->
      <div class="tab-content" *ngIf="activeTab === 'table'">
        <div class="card">
          <div class="table-header">
            <h3>🎓 学生信息表格</h3>
            <div class="table-controls">
              <button class="btn btn-primary btn-small" (click)="addRandomStudent()">
                ➕ 添加学生
              </button>
              <button class="btn btn-secondary btn-small" (click)="clearStudents()" [disabled]="students.length === 0">
                🗑️ 清空数据
              </button>
            </div>
          </div>

          <div class="table-container" *ngIf="students.length > 0">
            <table class="data-table">
              <thead>
                <tr>
                  <th *ngFor="let column of tableColumns">{{column.label}}</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let student of students; let i = index; let isFirst = first; let isLast = last; let isEven = even; let isOdd = odd; trackBy: trackByStudentId"
                    [class.even-row]="isEven"
                    [class.odd-row]="isOdd"
                    [class.first-row]="isFirst"
                    [class.last-row]="isLast">
                  <td>{{student.id}}</td>
                  <td>{{student.name}}</td>
                  <td>{{student.age}}</td>
                  <td>
                    <span class="grade-badge" [class]="'grade-' + student.grade.toLowerCase()">
                      {{student.grade}}
                    </span>
                  </td>
                  <td [class.high-score]="student.score >= 90" [class.low-score]="student.score < 60">
                    {{student.score}}
                  </td>
                  <td>
                    <span class="subject-tag" *ngFor="let subject of student.subjects; let last = last">
                      {{subject}}<span *ngIf="!last">, </span>
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-tiny" (click)="removeStudent(i)">
                      ❌
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="table-stats">
              <div class="stat-item">
                <span class="stat-label">总学生数:</span>
                <span class="stat-value">{{students.length}}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">平均分:</span>
                <span class="stat-value">{{getAverageScore().toFixed(1)}}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">优秀学生:</span>
                <span class="stat-value">{{getExcellentCount()}}</span>
              </div>
            </div>
          </div>

          <div class="no-data" *ngIf="students.length === 0">
            <div class="no-data-icon">📝</div>
            <p>暂无学生数据，点击"添加学生"按钮添加数据</p>
          </div>

          <div class="code-example">
            <h4>💻 ngFor 使用示例：</h4>
            <pre class="code-block">{{ngForExample}}</pre>
          </div>
        </div>
      </div>

      <!-- 九九乘法表标签页 -->
      <div class="tab-content" *ngIf="activeTab === 'multiplication'">
        <div class="multiplication-controls">
          <div class="card control-panel">
            <h3>🎛️ 控制面板</h3>
            <div class="direction-selector">
              <label>选择显示方向：</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="direction" value="normal" [(ngModel)]="selectedDirection">
                  <span>正常 (1×1 到 9×9)</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="direction" value="reverse" [(ngModel)]="selectedDirection">
                  <span>倒序 (9×9 到 1×1)</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="direction" value="vertical" [(ngModel)]="selectedDirection">
                  <span>竖向 (按列显示)</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="direction" value="diagonal" [(ngModel)]="selectedDirection">
                  <span>对角线 (斜向显示)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="multiplication-tables">
          <!-- 正常方向 -->
          <div class="card multiplication-card" *ngIf="selectedDirection === 'normal'">
            <h3>🔢 正常九九乘法表 (1×1 到 9×9)</h3>
            <div class="multiplication-grid">
              <div class="multiplication-row" *ngFor="let i of numbers; let row = index">
                <div class="multiplication-cell" *ngFor="let j of numbers.slice(0, row + 1); let col = index"
                     [class.diagonal]="row === col">
                  <span class="equation">{{i}} × {{j + 1}} = </span>
                  <span class="result">{{i * (j + 1)}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 倒序方向 -->
          <div class="card multiplication-card" *ngIf="selectedDirection === 'reverse'">
            <h3>🔢 倒序九九乘法表 (9×9 到 1×1)</h3>
            <div class="multiplication-grid">
              <div class="multiplication-row" *ngFor="let i of reverseNumbers; let row = index">
                <div class="multiplication-cell" *ngFor="let j of reverseNumbers.slice(row); let col = index"
                     [class.diagonal]="row === col">
                  <span class="equation">{{i}} × {{reverseNumbers[row + col]}} = </span>
                  <span class="result">{{i * reverseNumbers[row + col]}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 竖向方向 -->
          <div class="card multiplication-card" *ngIf="selectedDirection === 'vertical'">
            <h3>🔢 竖向九九乘法表 (按列显示)</h3>
            <div class="multiplication-vertical">
              <div class="multiplication-column" *ngFor="let col of numbers; let colIndex = index">
                <h4>{{col}}的乘法</h4>
                <div class="vertical-cell" *ngFor="let row of numbers.slice(0, colIndex + 1)"
                     [class.highlight]="row === col">
                  <span class="equation">{{col}} × {{row}} = </span>
                  <span class="result">{{col * row}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 对角线方向 -->
          <div class="card multiplication-card" *ngIf="selectedDirection === 'diagonal'">
            <h3>🔢 对角线九九乘法表 (斜向显示)</h3>
            <div class="multiplication-diagonal">
              <div class="diagonal-group" *ngFor="let sum of diagonalSums; let groupIndex = index">
                <h4>和为 {{sum}} 的组合</h4>
                <div class="diagonal-row">
                  <div class="diagonal-cell" *ngFor="let pair of getDiagonalPairs(sum)"
                       [class.perfect-square]="pair.x === pair.y">
                    <span class="equation">{{pair.x}} × {{pair.y}} = </span>
                    <span class="result">{{pair.x * pair.y}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="code-example">
          <h4>💻 九九乘法表代码示例：</h4>
          <pre class="code-block">{{multiplicationExample}}</pre>
        </div>
      </div>

      <!-- 指令说明标签页 -->
      <div class="tab-content" *ngIf="activeTab === 'directives'">
        <div class="card">
          <h3>📚 Angular 指令说明</h3>
          
          <div class="directive-section">
            <h4>🔄 *ngFor 指令</h4>
            <p class="directive-description">
              *ngFor 是 Angular 最常用的结构指令之一，用于遍历数组或可迭代对象，为每个元素创建一个模板实例。
            </p>
            
            <div class="syntax-examples">
              <h5>基本语法：</h5>
              <pre class="code-block">*ngFor="let item of items"</pre>
              
              <h5>获取索引和其他变量：</h5>
              <pre class="code-block">*ngFor="let item of items; let i = index; let first = first; let last = last; let even = even; let odd = odd"</pre>
              
              <h5>使用 trackBy 优化性能：</h5>
              <pre class="code-block">*ngFor="let item of items; trackBy: trackByFn"</pre>
            </div>
          </div>

          <div class="directive-section">
            <h4>🎯 *ngIf 指令</h4>
            <p class="directive-description">
              *ngIf 是条件渲染指令，根据表达式的结果决定是否在 DOM 中创建或销毁元素。
            </p>
            
            <div class="syntax-examples">
              <h5>基本语法：</h5>
              <pre class="code-block">*ngIf="condition"</pre>
              
              <h5>if-else 语法：</h5>
              <pre class="code-block">*ngIf="condition; else elseTemplate"</pre>
            </div>
          </div>

          <div class="directive-section">
            <h4>🎨 属性指令</h4>
            <p class="directive-description">
              属性指令用于改变元素的外观或行为，常见的有 [class]、[style]、[attr] 等。
            </p>
            
            <div class="syntax-examples">
              <h5>class 绑定：</h5>
              <pre class="code-block">[class.active]="isActive"
[class]="classExpression"</pre>
              
              <h5>style 绑定：</h5>
              <pre class="code-block">[style.color]="color"
[style]="styleExpression"</pre>
            </div>
          </div>

          <div class="feature-list">
            <h4>✨ 本演示展示的特性：</h4>
            <ul>
              <li>使用 *ngFor 遍历学生数组生成表格</li>
              <li>获取 index、first、last、even、odd 等变量</li>
              <li>使用 trackBy 函数优化列表性能</li>
              <li>条件类名绑定 [class.xxx]</li>
              <li>*ngIf 条件渲染</li>
              <li>嵌套 *ngFor 实现九九乘法表</li>
              <li>模板引用变量的使用</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1400px;
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

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .table-controls {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .btn-small {
      padding: 6px 12px;
      font-size: 0.8rem;
    }

    .btn-tiny {
      padding: 4px 8px;
      font-size: 0.7rem;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background: #c82333;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .table-container {
      overflow-x: auto;
      margin-bottom: 20px;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .data-table th,
    .data-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .data-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
    }

    .data-table tr.even-row {
      background: #f8f9fa;
    }

    .data-table tr.odd-row {
      background: white;
    }

    .data-table tr.first-row {
      background: #e3f2fd;
    }

    .data-table tr.last-row {
      background: #f3e5f5;
    }

    .data-table tr:hover {
      background: #e8f4fd;
    }

    .grade-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .grade-a { background: #d4edda; color: #155724; }
    .grade-b { background: #d1ecf1; color: #0c5460; }
    .grade-c { background: #fff3cd; color: #856404; }
    .grade-d { background: #f8d7da; color: #721c24; }

    .high-score {
      color: #28a745;
      font-weight: 600;
    }

    .low-score {
      color: #dc3545;
      font-weight: 600;
    }

    .subject-tag {
      color: #007bff;
      font-size: 0.9rem;
    }

    .table-stats {
      display: flex;
      gap: 30px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 5px;
    }

    .stat-value {
      font-size: 1.2rem;
      font-weight: 600;
      color: #007bff;
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

    .multiplication-controls {
      margin-bottom: 20px;
    }

    .control-panel {
      background: linear-gradient(135deg, #f6f8ff 0%, #e3f2fd 100%);
    }

    .direction-selector label {
      display: block;
      margin-bottom: 15px;
      font-weight: 600;
      color: #333;
    }

    .radio-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .radio-option:hover {
      background: #e3f2fd;
    }

    .radio-option input[type="radio"] {
      margin: 0;
    }

    .multiplication-card {
      background: linear-gradient(135deg, #fff9e6 0%, #f0f8ff 100%);
    }

    .multiplication-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .multiplication-row {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
    }

    .multiplication-cell {
      background: white;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #e1e5e9;
      min-width: 120px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .multiplication-cell:hover {
      background: #e3f2fd;
      transform: translateY(-2px);
    }

    .multiplication-cell.diagonal {
      background: #fff3cd;
      border-color: #ffc107;
    }

    .equation {
      color: #666;
      font-size: 0.9rem;
    }

    .result {
      color: #007bff;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .multiplication-vertical {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .multiplication-column {
      background: white;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e1e5e9;
    }

    .multiplication-column h4 {
      margin: 0 0 15px 0;
      color: #007bff;
      text-align: center;
      font-size: 1.1rem;
    }

    .vertical-cell {
      padding: 6px;
      margin-bottom: 8px;
      background: #f8f9fa;
      border-radius: 4px;
      text-align: center;
    }

    .vertical-cell.highlight {
      background: #fff3cd;
      border: 1px solid #ffc107;
    }

    .multiplication-diagonal {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .diagonal-group {
      background: white;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e1e5e9;
    }

    .diagonal-group h4 {
      margin: 0 0 15px 0;
      color: #007bff;
      font-size: 1.1rem;
    }

    .diagonal-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .diagonal-cell {
      background: #f8f9fa;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #e1e5e9;
      text-align: center;
      transition: all 0.3s ease;
    }

    .diagonal-cell.perfect-square {
      background: #d4edda;
      border-color: #28a745;
    }

    .code-example {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .code-example h4 {
      margin: 0 0 15px 0;
      color: #333;
    }

    .code-block {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 15px;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #333;
      overflow-x: auto;
      white-space: pre-wrap;
    }

    .directive-section {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .directive-section h4 {
      color: #007bff;
      margin: 0 0 10px 0;
    }

    .directive-description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 15px;
    }

    .syntax-examples h5 {
      color: #333;
      margin: 15px 0 10px 0;
      font-size: 1rem;
    }

    .feature-list ul {
      padding-left: 25px;
      color: #666;
    }

    .feature-list li {
      margin-bottom: 8px;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .container {
        padding: 15px;
      }

      .page-header h1 {
        font-size: 2rem;
      }

      .table-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      .table-stats {
        flex-direction: column;
        gap: 15px;
      }

      .radio-group {
        grid-template-columns: 1fr;
      }

      .multiplication-vertical {
        grid-template-columns: 1fr;
      }

      .diagonal-row {
        justify-content: center;
      }
    }
  `]
})
export class DirectivesDemoComponent {
  activeTab = 'table';
  selectedDirection = 'normal';

  students: Student[] = [
    {
      id: 1,
      name: '张小明',
      age: 18,
      grade: 'A',
      score: 95,
      subjects: ['数学', '物理', '化学']
    },
    {
      id: 2,
      name: '李小红',
      age: 17,
      grade: 'B',
      score: 88,
      subjects: ['语文', '英语', '历史']
    },
    {
      id: 3,
      name: '王小强',
      age: 19,
      grade: 'A',
      score: 92,
      subjects: ['计算机', '数学']
    }
  ];

  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'name', label: '姓名', type: 'text' },
    { key: 'age', label: '年龄', type: 'number' },
    { key: 'grade', label: '等级', type: 'text' },
    { key: 'score', label: '分数', type: 'number' },
    { key: 'subjects', label: '科目', type: 'array' }
  ];

  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  reverseNumbers = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  diagonalSums = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  private namePool = ['赵一', '钱二', '孙三', '李四', '周五', '吴六', '郑七', '王八', '冯九', '陈十'];
  private subjectPool = ['数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '计算机'];
  private gradePool = ['A', 'B', 'C', 'D'];

  ngForExample = `<!-- 基本使用 -->
<tr *ngFor="let student of students">
  <td>{{student.name}}</td>
</tr>

<!-- 获取索引和状态变量 -->
<tr *ngFor="let student of students; let i = index; let isFirst = first; let isLast = last; let isEven = even"
    [class.even-row]="isEven"
    [class.first-row]="isFirst"
    [class.last-row]="isLast">
  <td>{{i + 1}}</td>
  <td>{{student.name}}</td>
</tr>

<!-- 使用 trackBy 优化性能 -->
<tr *ngFor="let student of students; trackBy: trackByStudentId">
  <td>{{student.name}}</td>
</tr>`;

  multiplicationExample = `<!-- 嵌套 ngFor 实现九九乘法表 -->
<div class="multiplication-row" *ngFor="let i of numbers; let row = index">
  <div class="multiplication-cell" *ngFor="let j of numbers.slice(0, row + 1); let col = index">
    <span>{{i}} × {{j + 1}} = {{i * (j + 1)}}</span>
  </div>
</div>

<!-- 条件类名绑定 -->
<div [class.diagonal]="row === col"
     [class.highlight]="result > 50">
  {{result}}
</div>`;

  trackByStudentId(index: number, student: Student): number {
    return student.id;
  }

  addRandomStudent(): void {
    const randomName = this.namePool[Math.floor(Math.random() * this.namePool.length)];
    const randomGrade = this.gradePool[Math.floor(Math.random() * this.gradePool.length)];
    const randomSubjects = this.getRandomSubjects();
    
    const newStudent: Student = {
      id: Math.max(...this.students.map(s => s.id), 0) + 1,
      name: randomName + (Math.floor(Math.random() * 100) + 1),
      age: Math.floor(Math.random() * 5) + 16, // 16-20岁
      grade: randomGrade,
      score: Math.floor(Math.random() * 40) + 60, // 60-100分
      subjects: randomSubjects
    };

    this.students.push(newStudent);
  }

  private getRandomSubjects(): string[] {
    const count = Math.floor(Math.random() * 3) + 1; // 1-3个科目
    const shuffled = [...this.subjectPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  removeStudent(index: number): void {
    this.students.splice(index, 1);
  }

  clearStudents(): void {
    this.students = [];
  }

  getAverageScore(): number {
    if (this.students.length === 0) return 0;
    const total = this.students.reduce((sum, student) => sum + student.score, 0);
    return total / this.students.length;
  }

  getExcellentCount(): number {
    return this.students.filter(student => student.score >= 90).length;
  }

  getDiagonalPairs(sum: number): { x: number, y: number }[] {
    const pairs: { x: number, y: number }[] = [];
    for (let x = 1; x <= 9; x++) {
      const y = sum - x;
      if (y >= 1 && y <= 9 && x <= y) {
        pairs.push({ x, y });
      }
    }
    return pairs;
  }
}