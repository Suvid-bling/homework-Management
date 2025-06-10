import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: '首页概览 - Angular作业管理系统'
  },
  {
    path: 'innovation-intro',
    loadComponent: () => import('./pages/innovation-intro/innovation-intro.component').then(m => m.InnovationIntroComponent),
    title: '创新介绍 - Angular作业管理系统'
  },
  {
    path: 'author-intro',
    loadComponent: () => import('./pages/author-intro/author-intro.component').then(m => m.AuthorIntroComponent),
    title: '作者介绍 - Angular作业管理系统'
  },
  {
    path: 'assignments',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/assignments/assignments-list/assignments-list.component').then(m => m.AssignmentsListComponent),
        title: '平时作业 - Angular作业管理系统'
      },
      {
        path: 'typescript-demo',
        loadComponent: () => import('./pages/assignments/typescript-demo/typescript-demo.component').then(m => m.TypescriptDemoComponent),
        title: 'TypeScript数据类型演示 - Angular作业管理系统'
      },
      {
        path: 'rectangle-class',
        loadComponent: () => import('./pages/assignments/rectangle-class/rectangle-class.component').then(m => m.RectangleClassComponent),
        title: '模块化编程-矩形类 - Angular作业管理系统'
      },
      {
        path: 'cylinder-calculator',
        loadComponent: () => import('./pages/assignments/cylinder-calculator/cylinder-calculator.component').then(m => m.CylinderCalculatorComponent),
        title: '圆柱体计算器 - Angular作业管理系统'
      },
      {
        path: 'component-communication',
        loadComponent: () => import('./pages/assignments/component-communication/component-communication.component').then(m => m.ComponentCommunicationComponent),
        title: '组件通信演示 - Angular作业管理系统'
      },
      {
        path: 'service-di',
        loadComponent: () => import('./pages/assignments/service-di/service-di.component').then(m => m.ServiceDiComponent),
        title: '服务与依赖注入 - Angular作业管理系统'
      },
      {
        path: 'routing',
        loadComponent: () => import('./pages/assignments/routing/routing.component').then(m => m.RoutingComponent),
        title: '路由与导航 - Angular作业管理系统'
      },
      {
        path: 'form-validation',
        loadComponent: () => import('./pages/assignments/form-validation/form-validation.component').then(m => m.FormValidationComponent),
        title: '表单验证 - Angular作业管理系统'
      },
      {
        path: 'http-requests',
        loadComponent: () => import('./pages/assignments/http-requests/http-requests.component').then(m => m.HttpRequestsComponent),
        title: 'HTTP请求处理 - Angular作业管理系统'
      },
      {
        path: 'directives',
        loadComponent: () => import('./pages/assignments/directives/directives.component').then(m => m.DirectivesComponent),
        title: '指令使用 - Angular作业管理系统'
      },
      {
        path: 'pipes',
        loadComponent: () => import('./pages/assignments/pipes/pipes.component').then(m => m.PipesComponent),
        title: '管道应用 - Angular作业管理系统'
      }
    ]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/system-settings/system-settings.component').then(m => m.SystemSettingsComponent),
    title: '系统设置 - Angular作业管理系统'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '页面未找到 - Angular作业管理系统'
  }
];