// typescript-demo.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DataTypeExample {
  type: string;
  description: string;
  code: string;
  output: any;
}

@Component({
  selector: 'app-typescript-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <header class="page-header">
        <h1>💻 TypeScript 数据类型演示</h1>
        <p class="description">
          本页面展示了 TypeScript 中的各种数据类型，包括基本类型、复合类型和高级类型。
          每个示例都可以实时运行并查看结果。
        </p>
      </header>

      <div class="tabs">
        <button 
          *ngFor="let example of dataTypes; let i = index"
          class="tab-button"
          [class.active]="activeTabIndex === i"
          (click)="selectTab(i)">
          {{example.type}}
        </button>
      </div>

      <div class="tab-content" *ngIf="selectedExample">
        <div class="example-container">
          <div class="example-header">
            <h2>{{selectedExample.type}}</h2>
            <p class="example-description">{{selectedExample.description}}</p>
          </div>

          <div class="code-section">
            <div class="code-toolbar">
              <div class="code-label">
                <span class="icon">💻</span> 示例代码
              </div>
              <div class="code-actions">
                <button class="btn btn-small btn-secondary" (click)="copyCode(selectedExample.code)">
                  📋 复制
                </button>
                <button class="btn btn-small btn-primary" (click)="runExample(selectedExample)">
                  ▶️ 运行
                </button>
              </div>
            </div>
            
            <pre class="code-block"><code>{{selectedExample.code}}</code></pre>
          </div>

          <div class="output-section" *ngIf="selectedExample.output">
            <div class="output-header">
              <div class="output-label">
                <span class="icon">🖥️</span> 输出结果
              </div>
            </div>
            <pre class="output-block">{{selectedExample.output}}</pre>
          </div>

          <div class="no-output" *ngIf="!selectedExample.output">
            <div class="no-data">
              <div class="no-data-icon">🎯</div>
              <p>点击"运行"按钮查看输出结果</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用提示 -->
      <div class="card tips-card">
        <h3>💡 使用提示</h3>
        <ul class="tips-list">
          <li>TypeScript 是 JavaScript 的超集，添加了类型系统和其他特性</li>
          <li>使用类型注解可以提高代码的可维护性和可读性</li>
          <li>TypeScript 的类型系统在编译时进行检查，运行时会被擦除</li>
          <li>合理使用 any 类型，尽量使用更具体的类型</li>
          <li>善用联合类型和交叉类型来构建复杂的类型结构</li>
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

    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      border-bottom: 2px solid #e1e5e9;
      margin-bottom: 30px;
      padding-bottom: 10px;
    }

    .tab-button {
      background: #f8f9fa;
      border: 1px solid #e1e5e9;
      padding: 10px 16px;
      cursor: pointer;
      font-size: 0.9rem;
      color: #666;
      border-radius: 6px;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .tab-button:hover {
      color: #007bff;
      background: #e3f2fd;
      border-color: #007bff;
    }

    .tab-button.active {
      color: white;
      background: #007bff;
      border-color: #007bff;
      font-weight: 600;
    }

    .tab-content {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .example-container {
      background: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 1px solid #e1e5e9;
      margin-bottom: 30px;
    }

    .example-header {
      margin-bottom: 25px;
    }

    .example-header h2 {
      font-size: 1.8rem;
      color: #333;
      margin: 0 0 10px 0;
    }

    .example-description {
      font-size: 1rem;
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    .code-section {
      margin-bottom: 25px;
    }

    .code-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8f9fa;
      padding: 12px 16px;
      border-radius: 6px 6px 0 0;
      border: 1px solid #e9ecef;
      border-bottom: none;
    }

    .code-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #333;
    }

    .icon {
      font-size: 1.1rem;
    }

    .code-actions {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .btn-small {
      padding: 4px 8px;
      font-size: 0.8rem;
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

    .code-block {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-top: none;
      border-radius: 0 0 6px 6px;
      padding: 20px;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      overflow-x: auto;
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .output-section {
      margin-top: 20px;
    }

    .output-header {
      background: #e8f5e8;
      padding: 12px 16px;
      border-radius: 6px 6px 0 0;
      border: 1px solid #c3e6c3;
      border-bottom: none;
    }

    .output-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #333;
    }

    .output-block {
      background: #f8fffe;
      border: 1px solid #c3e6c3;
      border-top: none;
      border-radius: 0 0 6px 6px;
      padding: 20px;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
      color: #28a745;
      overflow-x: auto;
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      min-height: 60px;
    }

    .no-output {
      margin-top: 20px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 40px;
    }

    .no-data {
      text-align: center;
      color: #999;
    }

    .no-data-icon {
      font-size: 3rem;
      margin-bottom: 15px;
    }

    .card {
      background: white;
      border-radius: 10px;
      padding: 25px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 1px solid #e1e5e9;
    }

    .tips-card {
      background: linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%);
      border: 1px solid #91d5ff;
    }

    .tips-card h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.3rem;
    }

    .tips-list {
      margin: 0;
      padding-left: 25px;
      color: #666;
    }

    .tips-list li {
      margin-bottom: 12px;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .container {
        padding: 15px;
      }
      
      .page-header h1 {
        font-size: 2rem;
      }
      
      .example-container {
        padding: 20px;
      }
      
      .code-toolbar {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
      }
      
      .code-actions {
        width: 100%;
        justify-content: flex-end;
      }
      
      .tabs {
        justify-content: center;
      }
      
      .tab-button {
        font-size: 0.8rem;
        padding: 8px 12px;
      }
    }
  `]
})
export class TypescriptDemoComponent implements OnInit {
  activeTabIndex = 0;
  selectedExample: DataTypeExample | null = null;

  dataTypes: DataTypeExample[] = [
    {
      type: 'Boolean 布尔类型',
      description: '布尔类型表示逻辑值：true 和 false',
      code: `// Boolean 类型示例
let isDone: boolean = false;
let isActive: boolean = true;

// 类型推断
let isComplete = true; // TypeScript 会推断为 boolean

console.log('isDone:', isDone);
console.log('isActive:', isActive);
console.log('isComplete:', isComplete);`,
      output: null
    },
    {
      type: 'Number 数值类型',
      description: '所有数字都是浮点数，支持十进制、十六进制、二进制和八进制',
      code: `// Number 类型示例
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let float: number = 3.14;

console.log('十进制:', decimal);
console.log('十六进制:', hex);
console.log('二进制:', binary);
console.log('八进制:', octal);
console.log('浮点数:', float);`,
      output: null
    },
    {
      type: 'String 字符串类型',
      description: '使用单引号、双引号或模板字符串',
      code: `// String 类型示例
let color: string = "blue";
let fullName: string = '苏子毅';
let age: number = 22;

// 模板字符串
let sentence: string = \`Hello, my name is \${fullName}.
I'll be \${age + 1} years old next year.\`;

console.log('color:', color);
console.log('fullName:', fullName);
console.log('sentence:', sentence);`,
      output: null
    },
    {
      type: 'Array 数组类型',
      description: '有两种方式定义数组类型',
      code: `// Array 类型示例
// 方式一：使用元素类型后面接 []
let list1: number[] = [1, 2, 3];

// 方式二：使用数组泛型
let list2: Array<number> = [4, 5, 6];

// 混合类型数组
let list3: (string | number)[] = ['hello', 123, 'world'];

console.log('list1:', list1);
console.log('list2:', list2);
console.log('list3:', list3);`,
      output: null
    },
    {
      type: 'Tuple 元组类型',
      description: '元组类型允许表示一个已知元素数量和类型的数组',
      code: `// Tuple 类型示例
// 声明一个元组类型
let x: [string, number];
x = ['hello', 10]; // 正确

// 访问元组元素
console.log('第一个元素:', x[0]);
console.log('第二个元素:', x[1]);

// 带标签的元组（TypeScript 4.0+）
let student: [name: string, age: number, grade: string] = ['苏子毅', 22, 'A+'];
console.log('学生信息:', student);`,
      output: null
    },
    {
      type: 'Enum 枚举类型',
      description: '枚举是对 JavaScript 标准数据类型的补充',
      code: `// Enum 类型示例
enum Color {
  Red,
  Green,
  Blue
}

let c: Color = Color.Green;
console.log('选择的颜色索引:', c);

// 手动设置枚举值
enum Status {
  Success = 200,
  NotFound = 404,
  ServerError = 500
}

console.log('Success:', Status.Success);
console.log('NotFound:', Status.NotFound);

// 字符串枚举
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

console.log('Direction.Up:', Direction.Up);`,
      output: null
    },
    {
      type: 'Any 任意类型',
      description: '可以表示任何类型的值，通常用于与第三方库交互',
      code: `// Any 类型示例
let notSure: any = 4;
console.log('初始值:', notSure);

notSure = "maybe a string instead";
console.log('改为字符串:', notSure);

notSure = false;
console.log('改为布尔值:', notSure);

// any 类型的数组
let list: any[] = [1, true, "free"];
console.log('混合数组:', list);`,
      output: null
    },
    {
      type: 'Void 空类型',
      description: '表示没有任何类型，通常用于函数没有返回值',
      code: `// Void 类型示例
function warnUser(): void {
    console.log("This is my warning message");
}

warnUser();

// void 类型的变量只能赋值 undefined 或 null
let unusable: void = undefined;
console.log('unusable:', unusable);`,
      output: null
    },
    {
      type: 'Object 对象类型',
      description: '表示非原始类型，即除了 number、string、boolean、symbol、null 或 undefined 之外的类型',
      code: `// Object 类型示例
interface Person {
  name: string;
  age: number;
  hobbies?: string[]; // 可选属性
}

let person: Person = {
  name: '苏子毅',
  age: 22,
  hobbies: ['跑步', '游泳', '阅读']
};

console.log('Person:', person);

// 使用类型别名
type Point = {
  x: number;
  y: number;
};

let point: Point = { x: 10, y: 20 };
console.log('Point:', point);`,
      output: null
    },
    {
      type: 'Union 联合类型',
      description: '表示一个值可以是几种类型之一',
      code: `// Union 类型示例
let myValue: string | number;

myValue = 'Hello TypeScript';
console.log('字符串值:', myValue);

myValue = 123;
console.log('数字值:', myValue);

// 联合类型的类型保护
function printId(id: number | string) {
  if (typeof id === 'string') {
    console.log('字符串 ID:', id.toUpperCase());
  } else {
    console.log('数字 ID:', id.toFixed(2));
  }
}

printId('abc123');
printId(456);`,
      output: null
    }
  ];

  ngOnInit(): void {
    this.selectedExample = this.dataTypes[0];
    // 初始化时执行所有示例
    this.executeAllExamples();
  }

  selectTab(index: number): void {
    this.activeTabIndex = index;
    this.selectedExample = this.dataTypes[index];
  }

  executeAllExamples(): void {
    this.dataTypes.forEach(example => {
      this.executeCode(example);
    });
  }

  executeCode(example: DataTypeExample): void {
    try {
      // 创建一个新的函数来执行代码，并捕获 console.log 输出
      const logs: string[] = [];
      const originalLog = console.log;
      
      console.log = (...args) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      // 使用 Function 构造函数执行代码
      const func = new Function(example.code);
      func();

      // 恢复原始的 console.log
      console.log = originalLog;

      // 设置输出结果
      example.output = logs.join('\n');
    } catch (error) {
      example.output = `错误: ${error}`;
    }
  }

  runExample(example: DataTypeExample): void {
    this.executeCode(example);
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      // 可以添加复制成功的提示
      console.log('代码已复制到剪贴板');
    }).catch(err => {
      console.error('复制失败:', err);
    });
  }
}