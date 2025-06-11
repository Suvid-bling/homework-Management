import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';

interface DataTypeExample {
  type: string;
  description: string;
  code: string;
  output: any;
}

@Component({
  selector: 'app-typescript-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzTabsModule,
    NzCodeEditorModule,
    NzButtonModule,
    NzAlertModule,
    NzDividerModule,
    NzTagModule,
    NzIconModule
  ],
  templateUrl: './typescript-demo.component.html',
  // styleUrls: ['./typescript-demo.component.css']
})
export class TypescriptDemoComponent implements OnInit {
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

  currentExample: DataTypeExample | null = null;
  executionResult: string = '';

  ngOnInit(): void {
    // 初始化时执行所有示例
    this.executeAllExamples();
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
    this.currentExample = example;
    this.executeCode(example);
    this.executionResult = example.output;
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      // 可以添加复制成功的提示
    });
  }
}