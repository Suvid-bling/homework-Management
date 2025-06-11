import { Component, OnInit, OnDestroy, Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, Observable, takeUntil } from 'rxjs';

// 1. 基础数据服务
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<string[]>(['初始数据1', '初始数据2']);
  public data$ = this.dataSubject.asObservable();

  private logSubject = new Subject<string>();
  public logs$ = this.logSubject.asObservable();

  constructor() {
    this.log('DataService 初始化完成');
  }

  addData(item: string): void {
    const currentData = this.dataSubject.value;
    this.dataSubject.next([...currentData, item]);
    this.log(`添加数据: ${item}`);
  }

  removeData(index: number): void {
    const currentData = this.dataSubject.value;
    if (index >= 0 && index < currentData.length) {
      const removedItem = currentData[index];
      const newData = currentData.filter((_, i) => i !== index);
      this.dataSubject.next(newData);
      this.log(`删除数据: ${removedItem}`);
    }
  }

  clearData(): void {
    this.dataSubject.next([]);
    this.log('清空所有数据');
  }

  private log(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.logSubject.next(`[${timestamp}] ${message}`);
  }
}

// 2. 配置接口和令牌
export interface AppConfig {
  apiUrl: string;
  timeout: number;
  debugMode: boolean;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const DEFAULT_CONFIG: AppConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  debugMode: true
};

// 3. HTTP模拟服务
@Injectable({
  providedIn: 'root'
})
export class MockHttpService {
  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}

  async get(url: string): Promise<any> {
    await this.delay(1000);
    return {
      success: true,
      data: `Mock data from ${url}`,
      timestamp: new Date().toISOString()
    };
  }

  async post(url: string, data: any): Promise<any> {
    await this.delay(1000);
    return {
      success: true,
      message: 'Data posted successfully',
      receivedData: data,
      id: Math.floor(Math.random() * 1000)
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 4. 通知服务
interface NotificationItem {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<NotificationItem[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  addNotification(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    const notification: NotificationItem = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    };

    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...current].slice(0, 5));

    // 自动删除通知
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 3000);
  }

  removeNotification(id: number): void {
    const current = this.notificationsSubject.value;
    const filtered = current.filter(n => n.id !== id);
    this.notificationsSubject.next(filtered);
  }
}

// 5. 用户服务
@Injectable()
export class UserService {
  private users = [
    { id: 1, name: '张三', role: 'admin' },
    { id: 2, name: '李四', role: 'user' }
  ];

  constructor(@Optional() private notificationService?: NotificationService) {}

  getUsers() {
    if (this.notificationService) {
      this.notificationService.addNotification('info', '获取用户列表');
    }
    return [...this.users];
  }

  addUser(name: string, role: string) {
    const newUser = {
      id: Math.max(...this.users.map(u => u.id)) + 1,
      name,
      role
    };
    this.users.push(newUser);
    
    if (this.notificationService) {
      this.notificationService.addNotification('success', `用户 ${name} 添加成功`);
    }
    
    return newUser;
  }
}

// 6. 主组件
@Component({
  selector: 'app-service-di',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    UserService,
    { provide: APP_CONFIG, useValue: DEFAULT_CONFIG }
  ],
  templateUrl: './service_di.component.html',
  styleUrls: ['./service_di.component.css'],
})
export class ServiceDiComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Tab management
  activeTab = 'data';

  // Data service related
  dataItems: string[] = [];
  logs: string[] = [];
  newDataItem = '';

  // HTTP service related
  apiEndpoint = '/users';
  postData = 'Hello World';
  httpResponse: any = null;
  isLoading = false;

  // User management
  users: any[] = [];
  newUser = { name: '', role: 'user' };

  // Notifications
  notifications: NotificationItem[] = [];

  // Configuration
  appConfig: AppConfig;

  constructor(
    private dataService: DataService,
    private mockHttpService: MockHttpService,
    private userService: UserService,
    private notificationService: NotificationService,
    @Inject(APP_CONFIG) appConfig: AppConfig
  ) {
    this.appConfig = appConfig;
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.subscribeToServices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.users = this.userService.getUsers();
  }

  private subscribeToServices(): void {
    // 订阅数据服务
    this.dataService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.dataItems = data;
      });

    // 订阅日志
    this.dataService.logs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(log => {
        this.logs.unshift(log);
        if (this.logs.length > 10) {
          this.logs = this.logs.slice(0, 10);
        }
      });

    // 订阅通知
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });
  }

  // Tab management
  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  // Data service methods
  addDataItem(): void {
    if (this.newDataItem.trim()) {
      this.dataService.addData(this.newDataItem.trim());
      this.newDataItem = '';
    }
  }

  removeDataItem(index: number): void {
    this.dataService.removeData(index);
  }

  clearAllData(): void {
    this.dataService.clearData();
  }

  // HTTP service methods
  async performGetRequest(): Promise<void> {
    this.isLoading = true;
    
    try {
      this.httpResponse = await this.mockHttpService.get(this.apiEndpoint);
      this.notificationService.addNotification('success', 'GET请求成功完成');
    } catch (error) {
      this.notificationService.addNotification('error', 'GET请求失败');
    } finally {
      this.isLoading = false;
    }
  }

  async performPostRequest(): Promise<void> {
    this.isLoading = true;
    
    try {
      this.httpResponse = await this.mockHttpService.post('/api/data', this.postData);
      this.notificationService.addNotification('success', 'POST请求成功完成');
    } catch (error) {
      this.notificationService.addNotification('error', 'POST请求失败');
    } finally {
      this.isLoading = false;
    }
  }

  // User management methods
  addUser(): void {
    if (this.newUser.name.trim()) {
      this.userService.addUser(this.newUser.name.trim(), this.newUser.role);
      this.users = this.userService.getUsers();
      this.newUser = { name: '', role: 'user' };
    }
  }

  // Notification methods
  removeNotification(id: number): void {
    this.notificationService.removeNotification(id);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  }
}