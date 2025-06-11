// src/app/pages/assignments/routing-demo/routing-demo.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface RouteInfo {
  path: string;
  name: string;
  description: string;
  timestamp: Date;
  params?: any;
  queryParams?: any;
}

interface NavigationEvent {
  id: number;
  from: string;
  to: string;
  timestamp: Date;
  type: 'programmatic' | 'user' | 'browser';
  success: boolean;
}

@Component({
  selector: 'app-routing-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink
  ],
  template: `
    <div class="routing-demo-container">
      <!-- Header -->
      <header class="page-header">
        <h1 class="page-title">
          <span class="title-icon">🧭</span>
          Angular 路由与导航演示
        </h1>
        <p class="page-description">
          全面演示Angular路由系统的各种功能，包括基础路由、嵌套路由、路由参数、查询参数、路由守卫等高级特性。
        </p>
      </header>

      <!-- Navigation Tabs -->
      <div class="tabs-container">
        <div class="tabs-header">
          <button 
            *ngFor="let tab of tabs" 
            class="tab-button"
            [class.active]="activeTab === tab.id"
            (click)="setActiveTab(tab.id)">
            <span class="tab-icon">{{ tab.icon }}</span>
            {{ tab.title }}
          </button>
          <div class="tab-extra">
            <span class="navigation-count">导航次数: {{ navigationHistory.length }}</span>
          </div>
        </div>

        <div class="tabs-content">
          
          <!-- Basic Navigation Tab -->
          <div class="tab-pane" [class.active]="activeTab === 'basic'" id="basic">
            <div class="content-grid">
              <!-- Navigation Controls -->
              <div class="card control-panel">
                <h3 class="card-title">导航控制面板</h3>
                <div class="card-content">
                  
                  <div class="control-group">
                    <h4>程序化导航</h4>
                    <div class="button-group">
                      <button class="btn btn-primary" (click)="navigateTo('/dashboard')">
                        <span class="btn-icon">🏠</span>
                        跳转到首页
                      </button>
                      <button class="btn btn-secondary" (click)="navigateTo('/author-intro')">
                        <span class="btn-icon">👤</span>
                        作者介绍
                      </button>
                      <button class="btn btn-secondary" (click)="navigateTo('/innovation-intro')">
                        <span class="btn-icon">💡</span>
                        创新介绍
                      </button>
                    </div>
                  </div>

                  <div class="control-group">
                    <h4>带参数导航</h4>
                    <div class="input-group">
                      <input 
                        type="text" 
                        class="form-input"
                        placeholder="输入用户ID"
                        [(ngModel)]="userId">
                      <button class="btn btn-primary" (click)="navigateWithParam()">
                        导航到用户页面
                      </button>
                    </div>
                  </div>

                  <div class="control-group">
                    <h4>查询参数导航</h4>
                    <div class="query-group">
                      <input 
                        type="text" 
                        class="form-input"
                        placeholder="搜索关键词"
                        [(ngModel)]="searchQuery">
                      <select class="form-select" [(ngModel)]="sortBy">
                        <option value="name">按名称</option>
                        <option value="date">按日期</option>
                        <option value="type">按类型</option>
                      </select>
                      <button class="btn btn-primary" (click)="navigateWithQuery()">
                        搜索
                      </button>
                    </div>
                  </div>

                  <div class="control-group">
                    <h4>浏览器导航</h4>
                    <div class="button-group">
                      <button class="btn btn-outline" (click)="goBack()">
                        <span class="btn-icon">←</span>
                        后退
                      </button>
                      <button class="btn btn-outline" (click)="goForward()">
                        <span class="btn-icon">→</span>
                        前进
                      </button>
                      <button class="btn btn-outline" (click)="reload()">
                        <span class="btn-icon">↻</span>
                        刷新
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Current Route Info -->
              <div class="card route-info">
                <h3 class="card-title">当前路由信息</h3>
                <div class="card-content">
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">当前路径:</span>
                      <span class="tag tag-blue">{{ currentRoute.path }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">路由参数:</span>
                      <div class="tags-group">
                        <span 
                          *ngFor="let param of getRouteParamsArray()" 
                          class="tag tag-green">
                          {{ param.key }}: {{ param.value }}
                        </span>
                        <span *ngIf="getRouteParamsArray().length === 0" class="no-data">无</span>
                      </div>
                    </div>
                    <div class="info-item">
                      <span class="info-label">查询参数:</span>
                      <div class="tags-group">
                        <span 
                          *ngFor="let param of getQueryParamsArray()" 
                          class="tag tag-orange">
                          {{ param.key }}: {{ param.value }}
                        </span>
                        <span *ngIf="getQueryParamsArray().length === 0" class="no-data">无</span>
                      </div>
                    </div>
                    <div class="info-item">
                      <span class="info-label">访问时间:</span>
                      <span class="timestamp">{{ currentRoute.timestamp | date:'yyyy-MM-dd HH:mm:ss' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation History Tab -->
          <div class="tab-pane" [class.active]="activeTab === 'history'" id="history">
            <div class="content-grid">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">导航历史记录</h3>
                  <button class="btn btn-outline btn-sm" (click)="clearHistory()">
                    <span class="btn-icon">🗑️</span>
                    清空历史
                  </button>
                </div>
                <div class="card-content">
                  <div class="table-container">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>时间</th>
                          <th>从</th>
                          <th>到</th>
                          <th>类型</th>
                          <th>状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let event of navigationHistory; let i = index" [class.highlight]="i === 0">
                          <td>{{ event.timestamp | date:'HH:mm:ss' }}</td>
                          <td>
                            <span class="tag tag-purple">{{ event.from || '外部' }}</span>
                          </td>
                          <td>
                            <span class="tag tag-blue">{{ event.to }}</span>
                          </td>
                          <td>
                            <span class="tag" [class]="'tag-' + getNavigationTypeColor(event.type)">
                              {{ getNavigationTypeText(event.type) }}
                            </span>
                          </td>
                          <td>
                            <span class="status-badge" [class.success]="event.success" [class.error]="!event.success">
                              {{ event.success ? '成功' : '失败' }}
                            </span>
                          </td>
                        </tr>
                        <tr *ngIf="navigationHistory.length === 0">
                          <td colspan="5" class="empty-state">暂无导航记录</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Route Timeline -->
              <div class="card">
                <h3 class="card-title">路由访问时间线</h3>
                <div class="card-content">
                  <div class="timeline">
                    <div 
                      *ngFor="let route of routeHistory; let i = index; let first = first" 
                      class="timeline-item"
                      [class.current]="first">
                      <div class="timeline-marker" [class.current]="first"></div>
                      <div class="timeline-content">
                        <div class="timeline-time">{{ route.timestamp | date:'HH:mm:ss' }}</div>
                        <div class="timeline-path">{{ route.path }}</div>
                        <div class="timeline-desc" *ngIf="route.description">{{ route.description }}</div>
                      </div>
                    </div>
                    <div *ngIf="routeHistory.length === 0" class="empty-timeline">
                      <div class="empty-icon">📍</div>
                      <p>开始导航后将显示时间线</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Route Configuration Tab -->
          <div class="tab-pane" [class.active]="activeTab === 'config'" id="config">
            <div class="content-grid">
              <div class="card">
                <h3 class="card-title">应用路由结构</h3>
                <div class="card-content">
                  <div class="route-tree">
                    <div class="route-node" *ngFor="let route of routeConfig">
                      <div class="route-item">
                        <span class="route-path">{{ route.path || '/' }}</span>
                        <span class="tag tag-cyan">{{ route.component }}</span>
                        <span class="route-desc">{{ route.description }}</span>
                      </div>
                      <div class="child-routes" *ngIf="route.children && route.children.length > 0">
                        <div class="child-route" *ngFor="let child of route.children">
                          <span class="child-path">{{ route.path }}/{{ child.path }}</span>
                          <span class="tag tag-blue tag-sm">{{ child.component }}</span>
                          <span class="child-desc">{{ child.description }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Route Features -->
              <div class="card">
                <h3 class="card-title">路由特性演示</h3>
                <div class="card-content">
                  <div class="features-grid">
                    <div class="feature-item">
                      <div class="feature-header">
                        <span class="feature-icon">🔗</span>
                        <h4>懒加载路由</h4>
                      </div>
                      <p>使用 loadComponent 实现按需加载，提高应用性能</p>
                      <div class="code-block">
                        <pre><code>{{ lazyLoadingExample }}</code></pre>
                      </div>
                    </div>

                    <div class="feature-item">
                      <div class="feature-header">
                        <span class="feature-icon">🌳</span>
                        <h4>嵌套路由</h4>
                      </div>
                      <p>支持多层级路由结构，实现复杂的页面布局</p>
                      <div class="code-block">
                        <pre><code>{{ nestedRoutingExample }}</code></pre>
                      </div>
                    </div>

                    <div class="feature-item">
                      <div class="feature-header">
                        <span class="feature-icon">🛡️</span>
                        <h4>路由守卫</h4>
                      </div>
                      <p>控制路由访问权限，实现认证和授权</p>
                      <div class="code-block">
                        <pre><code>{{ routeGuardExample }}</code></pre>
                      </div>
                    </div>

                    <div class="feature-item">
                      <div class="feature-header">
                        <span class="feature-icon">⚡</span>
                        <h4>路由解析器</h4>
                      </div>
                      <p>在路由激活前预加载数据</p>
                      <div class="code-block">
                        <pre><code>{{ resolverExample }}</code></pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Advanced Features Tab -->
          <div class="tab-pane" [class.active]="activeTab === 'advanced'" id="advanced">
            <div class="content-grid">
              <!-- Guards Demo -->
              <div class="card">
                <h3 class="card-title">路由守卫演示</h3>
                <div class="card-content">
                  <div class="alert alert-info">
                    <span class="alert-icon">ℹ️</span>
                    <div class="alert-content">
                      <strong>路由守卫演示</strong>
                      <p>以下功能模拟了真实应用中的路由保护机制</p>
                    </div>
                  </div>

                  <div class="guards-section">
                    <div class="guard-item">
                      <h4>CanActivate 守卫</h4>
                      <p>控制是否可以访问路由</p>
                      <div class="guard-demo">
                        <label class="checkbox-label">
                          <input type="checkbox" [(ngModel)]="isAuthenticated">
                          <span class="checkmark"></span>
                          用户已登录
                        </label>
                        <button class="btn btn-primary" (click)="testCanActivate()">
                          测试访问受保护页面
                        </button>
                      </div>
                    </div>

                    <div class="guard-item">
                      <h4>CanDeactivate 守卫</h4>
                      <p>控制是否可以离开当前路由</p>
                      <div class="guard-demo">
                        <label class="checkbox-label">
                          <input type="checkbox" [(ngModel)]="hasUnsavedChanges">
                          <span class="checkmark"></span>
                          有未保存的更改
                        </label>
                        <button class="btn btn-primary" (click)="testCanDeactivate()">
                          测试离开页面
                        </button>
                      </div>
                    </div>

                    <div class="guard-item">
                      <h4>Resolve 守卫</h4>
                      <p>在路由激活前预加载数据</p>
                      <div class="guard-demo">
                        <button 
                          class="btn btn-primary"
                          [class.loading]="isResolving"
                          (click)="testResolve()">
                          <span *ngIf="isResolving" class="loading-spinner"></span>
                          测试数据预加载
                        </button>
                        <div *ngIf="resolvedData" class="resolved-data">
                          <div class="success-icon">✅</div>
                          <p>预加载的数据: {{ resolvedData }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- URL Manipulation -->
              <div class="card">
                <h3 class="card-title">URL 操作演示</h3>
                <div class="card-content">
                  <div class="url-builder">
                    <h4>URL 构建与解析</h4>
                    <div class="url-form">
                      <div class="form-row">
                        <label class="form-label">基础路径:</label>
                        <input 
                          type="text" 
                          class="form-input"
                          [(ngModel)]="urlBuilder.basePath" 
                          placeholder="/assignments">
                      </div>
                      <div class="form-row">
                        <label class="form-label">路由参数:</label>
                        <input 
                          type="text" 
                          class="form-input"
                          [(ngModel)]="urlBuilder.params" 
                          placeholder="id=123">
                      </div>
                      <div class="form-row">
                        <label class="form-label">查询参数:</label>
                        <input 
                          type="text" 
                          class="form-input"
                          [(ngModel)]="urlBuilder.queryParams" 
                          placeholder="search=angular&sort=date">
                      </div>
                      <div class="form-row">
                        <label class="form-label">片段:</label>
                        <input 
                          type="text" 
                          class="form-input"
                          [(ngModel)]="urlBuilder.fragment" 
                          placeholder="section1">
                      </div>
                      <button class="btn btn-primary btn-full" (click)="buildAndNavigate()">
                        构建并导航
                      </button>
                    </div>
                    <div class="built-url" *ngIf="builtUrl">
                      <h5>构建的URL:</h5>
                      <div class="url-display">{{ builtUrl }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Best Practices Tab -->
          <div class="tab-pane" [class.active]="activeTab === 'practices'" id="practices">
            <div class="content-grid">
              <div class="card">
                <h3 class="card-title">Angular 路由最佳实践</h3>
                <div class="card-content">
                  <div class="steps-container">
                    <div class="step-item completed">
                      <div class="step-number">1</div>
                      <div class="step-content">
                        <h4>路由结构设计</h4>
                        <p>设计清晰的路由层次结构，避免过深嵌套</p>
                      </div>
                    </div>
                    <div class="step-item completed">
                      <div class="step-number">2</div>
                      <div class="step-content">
                        <h4>懒加载实现</h4>
                        <p>为每个功能模块实现懒加载，提高应用启动速度</p>
                      </div>
                    </div>
                    <div class="step-item active">
                      <div class="step-number">3</div>
                      <div class="step-content">
                        <h4>路由守卫使用</h4>
                        <p>合理使用各种路由守卫保护应用安全</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">4</div>
                      <div class="step-content">
                        <h4>错误处理</h4>
                        <p>实现全局错误处理和404页面</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">5</div>
                      <div class="step-content">
                        <h4>SEO优化</h4>
                        <p>使用Angular Universal实现服务端渲染</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Code Examples -->
              <div class="card">
                <h3 class="card-title">代码示例</h3>
                <div class="card-content">
                  <div class="code-tabs">
                    <div class="code-tabs-header">
                      <button 
                        *ngFor="let example of codeExamples"
                        class="code-tab"
                        [class.active]="activeCodeTab === example.id"
                        (click)="setActiveCodeTab(example.id)">
                        {{ example.title }}
                      </button>
                    </div>
                    <div class="code-tabs-content">
                      <div 
                        *ngFor="let example of codeExamples"
                        class="code-panel"
                        [class.active]="activeCodeTab === example.id">
                        <div class="code-block">
                          <pre><code>{{ example.code }}</code></pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Performance Tips -->
              <div class="card">
                <h3 class="card-title">性能优化建议</h3>
                <div class="card-content">
                  <div class="tips-grid">
                    <div class="tip-item">
                      <div class="tip-icon">⚡</div>
                      <div class="tip-content">
                        <h4>懒加载</h4>
                        <p>使用 loadComponent 实现路由级别的代码分割，减少初始包大小</p>
                      </div>
                    </div>
                    <div class="tip-item">
                      <div class="tip-icon">🛡️</div>
                      <div class="tip-content">
                        <h4>路由守卫</h4>
                        <p>合理使用守卫避免不必要的组件加载和数据请求</p>
                      </div>
                    </div>
                    <div class="tip-item">
                      <div class="tip-icon">🚀</div>
                      <div class="tip-content">
                        <h4>预加载策略</h4>
                        <p>使用 PreloadAllModules 或自定义预加载策略优化用户体验</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast Messages -->
      <div class="toast-container" [class.show]="showToast">
        <div class="toast" [class]="'toast-' + toastType">
          <span class="toast-icon">{{ getToastIcon() }}</span>
          <span class="toast-message">{{ toastMessage }}</span>
          <button class="toast-close" (click)="hideToast()">×</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./routing_native.css']
})
export class RoutingDemoComponent implements OnInit, OnDestroy {
  private routerSubscription!: Subscription;
  private navigationId = 0;

  // Tab management
  activeTab = 'basic';
  activeCodeTab = 'basic-routing';

  tabs = [
    { id: 'basic', title: '基础导航', icon: '🧭' },
    { id: 'history', title: '导航历史', icon: '📊' },
    { id: 'config', title: '路由配置', icon: '⚙️' },
    { id: 'advanced', title: '高级特性', icon: '🔧' },
    { id: 'practices', title: '最佳实践', icon: '💡' }
  ];

  // Toast system
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'warning' | 'info' = 'info';

  // Current route information
  currentRoute: RouteInfo = {
    path: '',
    name: '',
    description: '',
    timestamp: new Date()
  };

  // Navigation history
  navigationHistory: NavigationEvent[] = [];
  routeHistory: RouteInfo[] = [];

  // Form controls
  userId = '';
  searchQuery = '';
  sortBy = 'name';

  // Guard simulation
  isAuthenticated = true;
  hasUnsavedChanges = false;
  isResolving = false;
  resolvedData = '';

  // URL builder
  urlBuilder = {
    basePath: '/assignments',
    params: '',
    queryParams: '',
    fragment: ''
  };
  builtUrl = '';

  // Route configuration for display
  routeConfig = [
    {
      path: '',
      component: 'AppComponent',
      description: '应用根组件',
      children: [
        { path: 'dashboard', component: 'DashboardComponent', description: '首页概览' },
        { path: 'author-intro', component: 'AuthorIntroComponent', description: '作者介绍' },
        { path: 'innovation-intro', component: 'InnovationIntroComponent', description: '创新介绍' }
      ]
    },
    {
      path: 'assignments',
      component: 'AssignmentsModule',
      description: '作业模块',
      children: [
        { path: 'typescript-demo', component: 'TypescriptDemoComponent', description: 'TypeScript演示' },
        { path: 'routing-demo', component: 'RoutingDemoComponent', description: '路由演示' },
        { path: 'ts-canvas', component: 'TsCanvasComponent', description: 'TS画布' }
      ]
    }
  ];

  // Code examples
  codeExamples = [
    {
      id: 'basic-routing',
      title: '基础路由配置',
      code: `const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user/:id', component: UserComponent },
  { path: '**', component: NotFoundComponent }
];`
    },
    {
      id: 'route-guards',
      title: '路由守卫',
      code: `@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    return this.authService.isAuthenticated();
  }
}`
    },
    {
      id: 'programmatic-nav',
      title: '程序化导航',
      code: `constructor(private router: Router) {}

navigateToUser(id: number) {
  this.router.navigate(['/user', id]);
}

navigateWithQuery() {
  this.router.navigate(['/search'], {
    queryParams: { q: 'angular', sort: 'date' }
  });
}`
    },
    {
      id: 'route-params',
      title: '路由参数',
      code: `constructor(private route: ActivatedRoute) {}

ngOnInit() {
  // 获取路由参数
  const id = this.route.snapshot.params['id'];
  
  // 订阅参数变化
  this.route.params.subscribe(params => {
    console.log(params['id']);
  });
}`
    }
  ];

  // Feature examples
  lazyLoadingExample = `{
  path: 'feature',
  loadComponent: () => import('./feature/feature.component')
    .then(m => m.FeatureComponent)
}`;

  nestedRoutingExample = `{
  path: 'parent',
  component: ParentComponent,
  children: [
    { path: 'child1', component: Child1Component },
    { path: 'child2', component: Child2Component }
  ]
}`;

  routeGuardExample = `{
  path: 'protected',
  component: ProtectedComponent,
  canActivate: [AuthGuard],
  canDeactivate: [CanDeactivateGuard]
}`;

  resolverExample = `{
  path: 'user/:id',
  component: UserComponent,
  resolve: {
    user: UserResolver
  }
}`;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initCurrentRoute();
    this.subscribeToRouterEvents();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Tab management
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  setActiveCodeTab(tabId: string): void {
    this.activeCodeTab = tabId;
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

  // Router event handling
  private initCurrentRoute(): void {
    this.updateCurrentRoute();
  }

  private subscribeToRouterEvents(): void {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(event => event as NavigationEnd)
      )
      .subscribe(event => {
        this.addNavigationEvent(event);
        this.updateCurrentRoute();
      });
  }

  private updateCurrentRoute(): void {
    this.currentRoute = {
      path: this.router.url,
      name: this.getRouteName(),
      description: this.getRouteDescription(),
      timestamp: new Date(),
      params: this.route.snapshot.params,
      queryParams: this.route.snapshot.queryParams
    };

    this.routeHistory.unshift({...this.currentRoute});
    if (this.routeHistory.length > 10) {
      this.routeHistory = this.routeHistory.slice(0, 10);
    }
  }

  private getRouteName(): string {
    const path = this.router.url.split('?')[0];
    const segments = path.split('/').filter(s => s);
    return segments[segments.length - 1] || 'root';
  }

  private getRouteDescription(): string {
    const path = this.router.url;
    if (path.includes('dashboard')) return '首页概览';
    if (path.includes('routing-demo')) return '路由演示';
    if (path.includes('author-intro')) return '作者介绍';
    return '未知页面';
  }

  private addNavigationEvent(event: NavigationEnd): void {
    const previousUrl = this.navigationHistory.length > 0 
      ? this.navigationHistory[this.navigationHistory.length - 1].to 
      : '';

    this.navigationHistory.push({
      id: ++this.navigationId,
      from: previousUrl,
      to: event.url,
      timestamp: new Date(),
      type: 'user',
      success: true
    });
  }

  // Navigation methods
  navigateTo(path: string): void {
    this.addProgrammaticNavigation(path);
    this.router.navigate([path]);
    this.showToastMessage(`导航到: ${path}`, 'success');
  }

  navigateWithParam(): void {
    if (!this.userId) {
      this.showToastMessage('请输入用户ID', 'warning');
      return;
    }
    const path = `/user/${this.userId}`;
    this.addProgrammaticNavigation(path);
    this.showToastMessage(`模拟导航到用户页面: ${path}`, 'success');
    this.simulateNavigation(path);
  }

  navigateWithQuery(): void {
    const queryParams: any = {};
    if (this.searchQuery) queryParams.search = this.searchQuery;
    if (this.sortBy) queryParams.sort = this.sortBy;

    this.addProgrammaticNavigation('/assignments', 'query');
    this.router.navigate(['/assignments'], { queryParams });
    this.showToastMessage('导航到作业页面并应用查询参数', 'success');
  }

  goBack(): void {
    window.history.back();
    this.addNavigationHistoryEvent('browser', 'back');
    this.showToastMessage('执行后退操作', 'info');
  }

  goForward(): void {
    window.history.forward();
    this.addNavigationHistoryEvent('browser', 'forward');
    this.showToastMessage('执行前进操作', 'info');
  }

  reload(): void {
    window.location.reload();
  }

  // Guard simulation methods
  testCanActivate(): void {
    if (this.isAuthenticated) {
      this.showToastMessage('CanActivate: 允许访问，用户已认证', 'success');
      this.simulateNavigation('/protected-page');
    } else {
      this.showToastMessage('CanActivate: 拒绝访问，用户未认证', 'error');
    }
  }

  testCanDeactivate(): void {
    if (this.hasUnsavedChanges) {
      this.showToastMessage('CanDeactivate: 检测到未保存的更改，是否确认离开？', 'warning');
      setTimeout(() => {
        this.showToastMessage('用户确认离开页面', 'info');
      }, 1500);
    } else {
      this.showToastMessage('CanDeactivate: 允许离开，没有未保存的更改', 'success');
    }
  }

  testResolve(): void {
    this.isResolving = true;
    this.showToastMessage('Resolve: 开始预加载数据...', 'info');
    
    setTimeout(() => {
      this.resolvedData = `用户数据加载完成 - ${new Date().toLocaleTimeString()}`;
      this.isResolving = false;
      this.showToastMessage('Resolve: 数据预加载完成，可以导航了', 'success');
    }, 2000);
  }

  // URL builder methods
  buildAndNavigate(): void {
    let url = this.urlBuilder.basePath || '/';
    
    if (this.urlBuilder.params) {
      const params = this.urlBuilder.params.split('&');
      params.forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          url += `/${value}`;
        }
      });
    }

    const queryParams: any = {};
    if (this.urlBuilder.queryParams) {
      const queries = this.urlBuilder.queryParams.split('&');
      queries.forEach(query => {
        const [key, value] = query.split('=');
        if (key && value) {
          queryParams[key] = value;
        }
      });
    }

    this.builtUrl = url;
    if (Object.keys(queryParams).length > 0) {
      const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      this.builtUrl += `?${queryString}`;
    }
    if (this.urlBuilder.fragment) {
      this.builtUrl += `#${this.urlBuilder.fragment}`;
    }

    this.showToastMessage(`构建的URL: ${this.builtUrl}`, 'success');
    
    if (url.startsWith('/assignments') || url.startsWith('/dashboard')) {
      const navigationExtras: any = {};
      if (Object.keys(queryParams).length > 0) {
        navigationExtras.queryParams = queryParams;
      }
      if (this.urlBuilder.fragment) {
        navigationExtras.fragment = this.urlBuilder.fragment;
      }
      
      this.addProgrammaticNavigation(this.builtUrl);
      this.router.navigate([url], navigationExtras);
    }
  }

  // Utility methods
  private addProgrammaticNavigation(path: string, type: string = 'programmatic'): void {
    this.navigationHistory.push({
      id: ++this.navigationId,
      from: this.router.url,
      to: path,
      timestamp: new Date(),
      type: type as any,
      success: true
    });
  }

  private addNavigationHistoryEvent(type: string, action: string): void {
    this.navigationHistory.push({
      id: ++this.navigationId,
      from: this.router.url,
      to: `${action} navigation`,
      timestamp: new Date(),
      type: type as any,
      success: true
    });
  }

  private simulateNavigation(path: string): void {
    this.currentRoute = {
      path: path,
      name: this.extractRouteName(path),
      description: `模拟页面: ${path}`,
      timestamp: new Date(),
      params: this.extractParams(path),
      queryParams: {}
    };

    this.routeHistory.unshift({...this.currentRoute});
    if (this.routeHistory.length > 10) {
      this.routeHistory = this.routeHistory.slice(0, 10);
    }
  }

  private extractRouteName(path: string): string {
    const segments = path.split('/').filter(s => s);
    return segments[segments.length - 1] || 'root';
  }

  private extractParams(path: string): any {
    const segments = path.split('/');
    const params: any = {};
    
    if (path.includes('/user/')) {
      const userIdIndex = segments.indexOf('user') + 1;
      if (userIdIndex < segments.length) {
        params.id = segments[userIdIndex];
      }
    }
    
    return params;
  }

//   clearHistory(): void {
//     this.navigationHistory = [];
//     this.routeHistory = [];
//     this.showToastMessage('历史记录已清空', 'success');
//   }

//   getRouteParamsArray(): Array<{key: string, value: any}> {
//     return Object.entries(this.currentRoute.params || {})
//       .map(([key, value]) => ({key, value}));
//   }

//   getQueryParamsArray(): Array<{key: string, value: any}> {
//     return Object.entries(this.currentRoute.queryParams || {})
//       .map(([key, value]) => ({key, value}));
//   }

//   getNavigationTypeColor(type: string): string {
//     switch (type) {
//       case 'programmatic': return 'blue';
//       case 'user': return 'green';
//       case 'browser': return 'orange';
//       default: return 'gray';
//     }
//   }

//   getNavigationTypeText(type: string): string {
//     switch (type) {
//       case 'programmatic': return '程序化';
//       case 'user': return '用户操作';
//       case 'browser': return '浏览器';
//       default: return '未知';
//     }
//   }

//   // Utility methods
//   private addProgrammaticNavigation(path: string, type: string = 'programmatic'): void {
//     this.navigationHistory.push({
//       id: ++this.navigationId,
//       from: this.router.url,
//       to: path,
//       timestamp: new Date(),
//       type: type as any,
//       success: true
//     });
//   }

//   private addNavigationHistoryEvent(type: string, action: string): void {
//     this.navigationHistory.push({
//       id: ++this.navigationId,
//       from: this.router.url,
//       to: `${action} navigation`,
//       timestamp: new Date(),
//       type: type as any,
//       success: true
//     });
//   }

//   private simulateNavigation(path: string): void {
//     this.currentRoute = {
//       path: path,
//       name: this.extractRouteName(path),
//       description: `模拟页面: ${path}`,
//       timestamp: new Date(),
//       params: this.extractParams(path),
//       queryParams: {}
//     };

//     this.routeHistory.unshift({...this.currentRoute});
//     if (this.routeHistory.length > 10) {
//       this.routeHistory = this.routeHistory.slice(0, 10);
//     }
//   }

//   private extractRouteName(path: string): string {
//     const segments = path.split('/').filter(s => s);
//     return segments[segments.length - 1] || 'root';
//   }

//   private extractParams(path: string): any {
//     const segments = path.split('/');
//     const params: any = {};
    
//     if (path.includes('/user/')) {
//       const userIdIndex = segments.indexOf('user') + 1;
//       if (userIdIndex < segments.length) {
//         params.id = segments[userIdIndex];
//       }
//     }
    
//     return params;
//   }

//   clearHistory(): void {
//     this.navigationHistory = [];
//     this.routeHistory = [];
//     this.showToastMessage('历史记录已清空', 'success');
//   }

//   getRouteParamsArray(): Array<{key: string, value: any}> {
//     return Object.entries(this.currentRoute.params || {})
//       .map(([key, value]) => ({key, value}));
//   }

//   getQueryParamsArray(): Array<{key: string, value: any}> {
//     return Object.entries(this.currentRoute.queryParams || {})
//       .map(([key, value]) => ({key, value}));
//   }

//   getNavigationTypeColor(type: string): string {
//     switch (type) {
//       case 'programmatic': return 'blue';
//       case 'user': return 'green';
//       case 'browser': return 'orange';
//       default: return 'gray';
//     }
//   }

//   getNavigationTypeText(type: string): string {
//     switch (type) {
//       case 'programmatic': return '程序化';
//       case 'user': return '用户操作';
//       case 'browser': return '浏览器';
//       default: return '未知';
//     }
//   }
// }
