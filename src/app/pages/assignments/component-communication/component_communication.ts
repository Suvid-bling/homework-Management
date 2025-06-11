// src/app/pages/assignments/component-communication/component-communication.component.ts
import { Component, OnInit, OnDestroy, Injectable, Input, Output, EventEmitter, Component as NgComponent } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

// 1. 数据共享服务
@Injectable({
  providedIn: 'root'
})
export class DataShareService {
  private messageSource = new BehaviorSubject<string>('初始消息');
  currentMessage = this.messageSource.asObservable();

  private notificationSource = new Subject<{type: string, message: string, id: number}>();
  notifications$ = this.notificationSource.asObservable();

  private counterSource = new BehaviorSubject<number>(0);
  counter$ = this.counterSource.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  sendNotification(type: string, message: string) {
    this.notificationSource.next({ 
      type, 
      message, 
      id: Date.now() + Math.random()
    });
  }

  updateCounter(value: number) {
    this.counterSource.next(value);
  }

  incrementCounter() {
    const currentValue = this.counterSource.value;
    this.counterSource.next(currentValue + 1);
  }

  resetCounter() {
    this.counterSource.next(0);
  }
}

// 2. 子组件
@NgComponent({
  selector: 'app-child-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="child-card">
      <div class="card-header">
        <h3>子组件</h3>
        <span class="badge badge-success">Child</span>
      </div>
      
      <div class="card-body">
        <div class="communication-section">
          <h4>📥 接收父组件数据:</h4>
          <div class="received-data">
            <div class="data-item">
              <span class="data-label">父组件消息:</span>
              <span class="data-value">{{ parentMessage }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">父组件计数:</span>
              <span class="data-value">{{ parentCounter }}</span>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="communication-section">
          <h4>📤 向父组件发送数据:</h4>
          <div class="send-section">
            <input 
              type="text"
              [(ngModel)]="childMessage" 
              placeholder="输入要发送给父组件的消息"
              class="input-field">
            <button 
              class="btn btn-primary"
              (click)="sendToParent()">
              🚀 发送消息
            </button>
          </div>
          
          <div class="action-buttons">
            <button class="btn btn-secondary" (click)="requestIncrement()">
              ➕ 请求父组件计数+1
            </button>
            <button class="btn btn-secondary" (click)="requestReset()">
              🔄 请求重置计数
            </button>
          </div>
        </div>

        <div class="status-info">
          <small>子组件状态: 已渲染 {{ renderCount }} 次</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .child-card {
      border: 2px solid #52c41a;
      border-radius: 8px;
      margin: 16px 0;
      overflow: hidden;
    }
    .card-header {
      background: #f6ffed;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #d9f7be;
    }
    .card-header h3 {
      margin: 0;
      color: #52c41a;
    }
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    .badge-success {
      background: #52c41a;
      color: white;
    }
    .card-body {
      padding: 16px;
    }
    .communication-section {
      margin: 16px 0;
    }
    .communication-section h4 {
      margin-bottom: 12px;
      color: #333;
    }
    .received-data {
      background: #f9f9f9;
      padding: 12px;
      border-radius: 4px;
      border-left: 4px solid #52c41a;
    }
    .data-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .data-item:last-child {
      border-bottom: none;
    }
    .data-label {
      font-weight: 500;
      color: #666;
    }
    .data-value {
      color: #1890ff;
      font-weight: bold;
    }
    .send-section {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }
    .input-field {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    .btn-primary {
      background: #1890ff;
      color: white;
    }
    .btn-primary:hover {
      background: #40a9ff;
    }
    .btn-secondary {
      background: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }
    .btn-secondary:hover {
      background: #e6f7ff;
      border-color: #1890ff;
    }
    .action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .divider {
      height: 1px;
      background: #f0f0f0;
      margin: 16px 0;
    }
    .status-info {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
      color: #999;
      font-style: italic;
    }
  `]
})
export class ChildComponent implements OnInit {
  @Input() parentMessage: string = '';
  @Input() parentCounter: number = 0;
  
  @Output() messageToParent = new EventEmitter<string>();
  @Output() incrementRequest = new EventEmitter<void>();
  @Output() resetRequest = new EventEmitter<void>();

  childMessage: string = '';
  renderCount: number = 0;

  ngOnInit() {
    this.renderCount++;
  }

  ngOnChanges() {
    this.renderCount++;
  }

  sendToParent() {
    if (this.childMessage.trim()) {
      this.messageToParent.emit(this.childMessage);
      this.childMessage = '';
    }
  }

  requestIncrement() {
    this.incrementRequest.emit();
  }

  requestReset() {
    this.resetRequest.emit();
  }
}

// 3. 兄弟组件A
@NgComponent({
  selector: 'app-sibling-a',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sibling-card sibling-a">
      <div class="card-header">
        <h3>兄弟组件 A</h3>
        <span class="badge badge-primary">Sibling A</span>
      </div>

      <div class="card-body">
        <div class="communication-section">
          <h4>📡 通过服务与兄弟组件通信:</h4>
          
          <div class="send-section">
            <input 
              type="text"
              [(ngModel)]="messageToSend" 
              placeholder="发送消息给兄弟组件B"
              class="input-field">
            <button 
              class="btn btn-primary"
              (click)="sendMessage()">
              发送
            </button>
          </div>

          <div class="action-buttons">
            <button class="btn btn-success" (click)="sendNotification('success')">
              ✅ 发送成功通知
            </button>
            <button class="btn btn-warning" (click)="sendNotification('warning')">
              ⚠️ 发送警告通知
            </button>
            <button class="btn btn-danger" (click)="sendNotification('error')">
              ❌ 发送错误通知
            </button>
          </div>
        </div>

        <div class="divider"></div>

        <div class="received-section">
          <h4>📨 接收到的消息:</h4>
          <div class="message-display">
            <div class="message-content">{{ currentMessage }}</div>
            <div class="message-count" *ngIf="messageCount > 0">
              收到 {{ messageCount }} 条消息
            </div>
          </div>
        </div>

        <div class="counter-section">
          <h4>🔢 共享计数器:</h4>
          <div class="counter-display">
            <span class="counter-value">{{ sharedCounter }}</span>
            <button class="btn btn-small btn-primary" (click)="incrementSharedCounter()">
              +1
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sibling-a {
      border-color: #1890ff;
    }
    .sibling-a .card-header {
      background: #e6f7ff;
      border-bottom-color: #91d5ff;
    }
    .sibling-a .card-header h3 {
      color: #1890ff;
    }
    .badge-primary {
      background: #1890ff;
      color: white;
    }
    .btn-success {
      background: #52c41a;
      color: white;
    }
    .btn-success:hover {
      background: #73d13d;
    }
    .btn-warning {
      background: #faad14;
      color: white;
    }
    .btn-warning:hover {
      background: #ffc53d;
    }
    .btn-danger {
      background: #ff4d4f;
      color: white;
    }
    .btn-danger:hover {
      background: #ff7875;
    }
    .message-display {
      background: #f6ffed;
      border: 1px solid #b7eb8f;
      border-radius: 4px;
      padding: 12px;
      min-height: 60px;
    }
    .message-content {
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 8px;
    }
    .message-count {
      font-size: 12px;
      color: #52c41a;
      font-style: italic;
    }
    .counter-display {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .counter-value {
      font-size: 24px;
      font-weight: bold;
      color: #1890ff;
      background: #e6f7ff;
      padding: 8px 16px;
      border-radius: 4px;
    }
    .btn-small {
      padding: 4px 8px;
      font-size: 12px;
    }
  `]
})
export class SiblingAComponent implements OnInit, OnDestroy {
  messageToSend: string = '';
  currentMessage: string = '';
  messageCount: number = 0;
  sharedCounter: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private dataService: DataShareService) {}

  ngOnInit() {
    this.dataService.currentMessage
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        this.currentMessage = message;
        this.messageCount++;
      });

    this.dataService.counter$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.sharedCounter = count;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendMessage() {
    if (this.messageToSend.trim()) {
      this.dataService.changeMessage(`来自兄弟组件A: ${this.messageToSend}`);
      this.messageToSend = '';
    }
  }

  sendNotification(type: string) {
    const messages = {
      success: '兄弟组件A发送了成功通知！',
      warning: '兄弟组件A发送了警告通知！',
      error: '兄弟组件A发送了错误通知！'
    };
    this.dataService.sendNotification(type, messages[type as keyof typeof messages]);
  }

  incrementSharedCounter() {
    this.dataService.incrementCounter();
  }
}

// 4. 兄弟组件B
@NgComponent({
  selector: 'app-sibling-b',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sibling-card sibling-b">
      <div class="card-header">
        <h3>兄弟组件 B</h3>
        <span class="badge badge-orange">Sibling B</span>
      </div>

      <div class="card-body">
        <div class="communication-section">
          <h4>📤 发送数据:</h4>
          <div class="send-section">
            <input 
              type="text"
              [(ngModel)]="messageToSend" 
              placeholder="发送消息给兄弟组件A"
              class="input-field">
            <button 
              class="btn btn-primary"
              (click)="sendMessage()">
              发送
            </button>
          </div>
        </div>

        <div class="divider"></div>

        <div class="received-section">
          <h4>📨 接收消息:</h4>
          <div class="current-message">{{ currentMessage }}</div>
        </div>

        <div class="notifications-section">
          <h4>🔔 通知列表 ({{ notifications.length }}):</h4>
          <div class="notifications-container">
            <div class="notification-item" 
                 *ngFor="let notification of notifications; let i = index"
                 [class]="'notification-' + notification.type">
              <div class="notification-content">
                <div class="notification-message">{{ notification.message }}</div>
                <div class="notification-time">{{ notification.time }}</div>
              </div>
              <button class="btn-close" (click)="removeNotification(i)">×</button>
            </div>
            
            <div class="no-notifications" *ngIf="notifications.length === 0">
              暂无通知
            </div>
          </div>
          
          <div class="notification-actions" *ngIf="notifications.length > 0">
            <button class="btn btn-secondary btn-small" (click)="clearAllNotifications()">
              🗑️ 清空所有通知
            </button>
          </div>
        </div>

        <div class="counter-section">
          <h4>🔢 共享计数器控制:</h4>
          <div class="counter-controls">
            <span class="counter-value">当前值: {{ sharedCounter }}</span>
            <div class="counter-buttons">
              <button class="btn btn-primary btn-small" (click)="incrementCounter()">+1</button>
              <button class="btn btn-secondary btn-small" (click)="resetCounter()">重置</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sibling-b {
      border-color: #fa8c16;
    }
    .sibling-b .card-header {
      background: #fff7e6;
      border-bottom-color: #ffd591;
    }
    .sibling-b .card-header h3 {
      color: #fa8c16;
    }
    .badge-orange {
      background: #fa8c16;
      color: white;
    }
    .current-message {
      padding: 12px;
      background: #fff7e6;
      border: 1px solid #ffd591;
      border-radius: 4px;
      min-height: 60px;
      font-size: 14px;
      line-height: 1.5;
    }
    .notifications-container {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      margin: 12px 0;
    }
    .notification-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.3s ease;
    }
    .notification-item:last-child {
      border-bottom: none;
    }
    .notification-item:hover {
      background: #fafafa;
    }
    .notification-success {
      border-left: 4px solid #52c41a;
      background: #f6ffed;
    }
    .notification-warning {
      border-left: 4px solid #faad14;
      background: #fffbe6;
    }
    .notification-error {
      border-left: 4px solid #ff4d4f;
      background: #fff2f0;
    }
    .notification-content {
      flex: 1;
    }
    .notification-message {
      font-size: 14px;
      margin-bottom: 4px;
    }
    .notification-time {
      font-size: 12px;
      color: #999;
    }
    .btn-close {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-close:hover {
      color: #ff4d4f;
    }
    .no-notifications {
      padding: 20px;
      text-align: center;
      color: #999;
      font-style: italic;
    }
    .notification-actions {
      text-align: center;
      margin-top: 12px;
    }
    .counter-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fafafa;
      padding: 12px;
      border-radius: 4px;
    }
    .counter-controls .counter-value {
      font-weight: bold;
      color: #fa8c16;
    }
    .counter-buttons {
      display: flex;
      gap: 8px;
    }
  `]
})
export class SiblingBComponent implements OnInit, OnDestroy {
  messageToSend: string = '';
  currentMessage: string = '';
  notifications: any[] = [];
  sharedCounter: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private dataService: DataShareService) {}

  ngOnInit() {
    this.dataService.currentMessage
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        this.currentMessage = message;
      });

    this.dataService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        this.notifications.unshift({
          ...notification,
          time: new Date().toLocaleTimeString()
        });
      });

    this.dataService.counter$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.sharedCounter = count;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendMessage() {
    if (this.messageToSend.trim()) {
      this.dataService.changeMessage(`来自兄弟组件B: ${this.messageToSend}`);
      this.messageToSend = '';
    }
  }

  removeNotification(index: number) {
    this.notifications.splice(index, 1);
  }

  clearAllNotifications() {
    this.notifications = [];
  }

  incrementCounter() {
    this.dataService.incrementCounter();
  }

  resetCounter() {
    this.dataService.resetCounter();
  }
}

// 5. 主组件
@Component({
  selector: 'app-component-communication',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChildComponent,
    SiblingAComponent,
    SiblingBComponent
  ],
  templateUrl: './component_communication.html',
  styleUrls: ['./component_communication.css']
})
export class ComponentCommunicationComponent implements OnInit, OnDestroy {
  // 当前激活的标签页
  activeTab: string = 'parent-child';

  // 父组件数据
  parentMessage: string = '来自父组件的消息';
  parentCounter: number = 0;
  messageFromChild: string = '';
  childActions: string[] = [];

  // 通信统计
  parentChildCommunications: number = 0;
  siblingCommunications: number = 0;
  serviceCommunications: number = 0;

  private destroy$ = new Subject<void>();

  constructor(private dataService: DataShareService) {}

  ngOnInit() {
    // 监听服务通信以更新统计
    this.dataService.currentMessage
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.serviceCommunications++;
      });

    this.dataService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.serviceCommunications++;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 计算总通信次数
  get totalCommunications(): number {
    return this.parentChildCommunications + this.siblingCommunications + this.serviceCommunications;
  }

  // 切换标签页
  switchTab(tabName: string) {
    this.activeTab = tabName;
  }

  // 父组件方法
  incrementParentCounter() {
    this.parentCounter++;
  }

  receiveFromChild(message: string) {
    this.messageFromChild = message;
    this.parentChildCommunications++;
    
    // 3秒后清除消息
    setTimeout(() => {
      this.messageFromChild = '';
    }, 3000);
  }

  handleIncrementRequest() {
    this.parentCounter++;
    this.parentChildCommunications++;
    this.addChildAction('请求计数+1');
  }

  handleResetRequest() {
    this.parentCounter = 0;
    this.parentChildCommunications++;
    this.addChildAction('请求重置计数');
  }

  private addChildAction(action: string) {
    this.childActions.unshift(action);
    if (this.childActions.length > 3) {
      this.childActions.pop();
    }
    
    // 3秒后移除第一个动作
    setTimeout(() => {
      const index = this.childActions.indexOf(action);
      if (index > -1) {
        this.childActions.splice(index, 1);
      }
    }, 3000);
  }

  getActionColor(action: string): string {
    if (action.includes('计数+1')) return 'success';
    if (action.includes('重置')) return 'warning';
    return 'primary';
  }
}