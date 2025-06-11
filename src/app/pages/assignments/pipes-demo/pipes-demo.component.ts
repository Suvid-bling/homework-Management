// src/app/pages/assignments/pipes-demo/pipes-demo.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  DatePipe, 
  UpperCasePipe, 
  LowerCasePipe, 
  TitleCasePipe,
  CurrencyPipe,
  DecimalPipe,
  PercentPipe,
  JsonPipe,
  SlicePipe,
  AsyncPipe
} from '@angular/common';
import { Observable, interval, map, startWith } from 'rxjs';

// Custom Pipes
import { Pipe, PipeTransform } from '@angular/core';

// 高亮文本管道
@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  transform(text: string, search: string): string {
    if (!search) return text;
    const re = new RegExp(search, 'gi');
    return text.replace(re, `<mark class="highlight">$&</mark>`);
  }
}

// 文件大小管道
@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// 时间距离管道
@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = new Date(value);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return '刚刚';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小时前`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} 天前`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} 个月前`;
    return `${Math.floor(diffInSeconds / 31536000)} 年前`;
  }
}

// 温度转换管道
@Pipe({
  name: 'temperature',
  standalone: true
})
export class TemperaturePipe implements PipeTransform {
  transform(value: number, fromUnit: string = 'C', toUnit: string = 'F'): string {
    let celsius = value;
    
    // 转换为摄氏度
    if (fromUnit === 'F') {
      celsius = (value - 32) * 5/9;
    } else if (fromUnit === 'K') {
      celsius = value - 273.15;
    }
    
    // 从摄氏度转换到目标单位
    let result = celsius;
    let unit = '°C';
    
    if (toUnit === 'F') {
      result = celsius * 9/5 + 32;
      unit = '°F';
    } else if (toUnit === 'K') {
      result = celsius + 273.15;
      unit = 'K';
    }
    
    return `${result.toFixed(1)}${unit}`;
  }
}

// 安全HTML管道
@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  transform(html: string): string {
    // 简单的HTML清理，实际项目中应使用DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  }
}

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  salary: number;
  joinDate: Date;
  avatar: string;
  isActive: boolean;
  skills: string[];
  lastLogin: Date;
}

interface PipeExample {
  title: string;
  description: string;
  input: any;
  pipe: string;
  output: any;
  code: string;
}

@Component({
  selector: 'app-pipes-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Built-in pipes
    DatePipe,
    UpperCasePipe,
    LowerCasePipe,
    TitleCasePipe,
    CurrencyPipe,
    DecimalPipe,
    PercentPipe,
    JsonPipe,
    SlicePipe,
    AsyncPipe,
    // Custom pipes
    HighlightPipe,
    FileSizePipe,
    TimeAgoPipe,
    TemperaturePipe,
    SafeHtmlPipe
  ],
//   template: `
  
//   `, // Large template string
  templateUrl: './pipes-demo.component.html',
  styleUrls: ['./pipes-demo.component.css']
})
export class PipesDemoComponent implements OnInit {
  // Tab management
  activeTab = 'builtin';
  tabs = [
    { id: 'builtin', title: '内置管道', icon: '🔧' },
    { id: 'custom', title: '自定义管道', icon: '⚙️' },
    { id: 'async', title: '异步管道', icon: '🔄' },
    { id: 'chaining', title: '链式调用', icon: '⛓️' },
    { id: 'examples', title: '实际应用', icon: '💡' }
  ];

  // Toast system
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'warning' | 'info' = 'info';

  // Demo data
  demoText = 'hello angular pipes world';
  demoNumber = 12345.6789;
  demoDate = new Date().toISOString().slice(0, 16);
  sliceStart = 0;
  sliceEnd = 5;

  // Custom pipe demos
  highlightText = 'Angular 是一个用于构建移动和桌面 Web 应用程序的平台和框架';
  searchKeyword = 'Angular';
  fileSizeBytes = 2048576;
  temperatureValue = 25;
  fromTempUnit = 'C';

  // Chaining demos
  chainText = 'complex pipe chaining example';
  chainNumber = 98765.4321;
  complexData = {
    user: { name: 'John Doe', age: 30 },
    settings: { theme: 'dark', language: 'en' }
  };

  // Async observables
  timer$: Observable<number>;
  currentTime$: Observable<Date>;
  asyncMessage$: Observable<string>;
  userPromise: Promise<any>;
  users$: Observable<User[]> | null = null;
  isLoading = false;

  // File size examples
  fileSizeExamples = [
    { label: '1 KB', bytes: 1024 },
    { label: '1 MB', bytes: 1048576 },
    { label: '1 GB', bytes: 1073741824 },
    { label: '大文件', bytes: 2684354560 },
    { label: '视频文件', bytes: 4294967296 }
  ];

  // Time ago examples
  timeAgoExamples: Array<{label: string, date: Date}> = [];

  // Real world examples
  realWorldExamples = [
    {
      title: '用户名格式化',
      category: '用户界面',
      description: '在用户列表中显示格式化的用户名',
      hasInput: true,
      inputType: 'text',
      inputLabel: '用户名',
      inputValue: 'john_doe_123',
      inputPlaceholder: '输入用户名',
      code: "{{ username | titlecase | slice:0:15 }}",
      pipe: 'titlecase-slice'
    },
    {
      title: '价格显示',
      category: '电商',
      description: '在商品列表中显示格式化的价格',
      hasInput: true,
      inputType: 'number',
      inputLabel: '价格',
      inputValue: 299.99,
      inputPlaceholder: '输入价格',
      code: "{{ price | currency:'CNY':'symbol':'1.2-2' }}",
      pipe: 'currency'
    },
    {
      title: '文件大小显示',
      category: '文件管理',
      description: '在文件列表中显示可读的文件大小',
      hasInput: true,
      inputType: 'number',
      inputLabel: '文件大小(字节)',
      inputValue: 5242880,
      inputPlaceholder: '输入字节数',
      code: "{{ fileSize | fileSize }}",
      pipe: 'fileSize'
    },
    {
      title: '发布时间',
      category: '社交媒体',
      description: '显示帖子的相对发布时间',
      hasInput: false,
      inputValue: new Date(Date.now() - 3600000), // 1 hour ago
      code: "{{ publishTime | timeAgo }}",
      pipe: 'timeAgo'
    },
    {
      title: '搜索高亮',
      category: '搜索功能',
      description: '在搜索结果中高亮关键词',
      hasInput: true,
      inputType: 'text',
      inputLabel: '搜索关键词',
      inputValue: '管道',
      inputPlaceholder: '输入关键词',
      code: "{{ content | highlight:searchTerm }}",
      pipe: 'highlight',
      content: 'Angular 管道是一个很有用的功能，可以转换显示数据'
    }
  ];

  constructor() {
    // Initialize observables
    this.timer$ = interval(1000).pipe(
      startWith(0),
      map(count => count)
    );

    this.currentTime$ = interval(1000).pipe(
      startWith(0),
      map(() => new Date())
    );

    this.asyncMessage$ = interval(2000).pipe(
      startWith(0),
      map(count => `异步消息 #${count + 1} - ${new Date().toLocaleTimeString()}`)
    );

    this.userPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          name: 'Promise User',
          email: 'promise@example.com',
          id: 1
        });
      }, 3000);
    });
  }

  ngOnInit(): void {
    this.initializeTimeAgoExamples();
  }

  private initializeTimeAgoExamples(): void {
    const now = new Date();
    this.timeAgoExamples = [
      { label: '刚刚', date: new Date(now.getTime() - 30000) }, // 30 seconds ago
      { label: '几分钟前', date: new Date(now.getTime() - 300000) }, // 5 minutes ago
      { label: '几小时前', date: new Date(now.getTime() - 7200000) }, // 2 hours ago
      { label: '几天前', date: new Date(now.getTime() - 259200000) }, // 3 days ago
      { label: '几个月前', date: new Date(now.getTime() - 7776000000) }, // 3 months ago
      { label: '几年前', date: new Date(now.getTime() - 63072000000) } // 2 years ago
    ];
  }

  // Tab management
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // Toast system
  showToastMessage(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.hideToast();
    }, 3000);
  }

  hideToast(): void {
    this.showToast = false;
  }

  getToastIcon(): string {
    switch (this.toastType) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  }

  // Utility methods
  getTotalPipesCount(): number {
    return 15; // Built-in + Custom pipes count
  }

  // Async data loading
  loadUsers(): void {
    this.isLoading = true;
    
    // Simulate HTTP request
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: 'zhang san',
          email: 'zhangsan@example.com',
          age: 28,
          salary: 15000,
          joinDate: new Date('2022-03-15'),
          avatar: 'ZS',
          isActive: true,
          skills: ['JavaScript', 'Angular', 'TypeScript', 'Node.js', 'Python'],
          lastLogin: new Date(Date.now() - 1800000) // 30 minutes ago
        },
        {
          id: 2,
          name: 'li si',
          email: 'lisi@example.com',
          age: 32,
          salary: 22000,
          joinDate: new Date('2021-08-22'),
          avatar: 'LS',
          isActive: false,
          skills: ['React', 'Vue.js', 'CSS', 'HTML'],
          lastLogin: new Date(Date.now() - 7200000) // 2 hours ago
        },
        {
          id: 3,
          name: 'wang wu',
          email: 'wangwu@example.com',
          age: 25,
          salary: 12000,
          joinDate: new Date('2023-01-10'),
          avatar: 'WW',
          isActive: true,
          skills: ['Java', 'Spring', 'MySQL', 'Docker'],
          lastLogin: new Date(Date.now() - 600000) // 10 minutes ago
        }
      ];

      this.users$ = new Observable(observer => {
        observer.next(mockUsers);
        observer.complete();
      });
      
      this.isLoading = false;
      this.showToastMessage('用户数据加载成功', 'success');
    }, 2000);
  }

  clearUsers(): void {
    this.users$ = null;
    this.showToastMessage('用户数据已清空', 'info');
  }

  getExampleResult(example: any): string {
    switch (example.pipe) {
      case 'titlecase-slice':
        return (example.inputValue || '').toString().split(' ').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ').slice(0, 15);
        
      case 'currency':
        const price = parseFloat(example.inputValue) || 0;
        return new Intl.NumberFormat('zh-CN', {
          style: 'currency',
          currency: 'CNY'
        }).format(price);
        
      case 'fileSize':
        const bytes = parseInt(example.inputValue) || 0;
        return this.formatFileSize(bytes);
        
      case 'timeAgo':
        return this.formatTimeAgo(example.inputValue);
        
      case 'highlight':
        const content = example.content || '';
        const keyword = example.inputValue || '';
        if (!keyword) return content;
        const re = new RegExp(keyword, 'gi');
        return content.replace(re, `<mark class="highlight">          <!-- Examples Tab -->
          <div class="tab-pane"</mark>`);
        
      default:
        return String(example.inputValue);
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return '刚刚';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小时前`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} 天前`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} 个月前`;
    return `${Math.floor(diffInSeconds / 31536000)} 年前`;
  }
}