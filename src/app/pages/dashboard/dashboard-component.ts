import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

interface Assignment {
  id: number;
  title: string;
  description: string;
  tags: string[];
  status: 'completed' | 'pending' | 'in-progress';
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzCardModule,
    NzGridModule,
    NzStatisticModule,
    NzIconModule,
    NzTagModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzToolTipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  assignments: Assignment[] = [
    {
      id: 1,
      title: 'TypeScript数据类型演示',
      description: '演示各种数据类型的定义、赋值和使用方法，包括布尔型、数值型、字符串、数组、元组、枚举等类型。',
      tags: ['TypeScript', '数据类型'],
      status: 'completed',
      route: '/assignments/typescript-demo'
    },
    {
      id: 2,
      title: '模块化编程 - 矩形类',
      description: '实现矩形类的定义和使用，包含属性（宽度、高度）和方法（构造、求面积、求周长、显示）。',
      tags: ['模块化', '面向对象'],
      status: 'completed',
      route: '/assignments/rectangle-class'
    },
    {
      id: 3,
      title: '圆柱体计算器',
      description: '使用双向数据绑定实现圆柱体表面积和体积计算，支持回车键和按钮触发计算。',
      tags: ['组件', '数据绑定'],
      status: 'completed',
      route: '/assignments/cylinder-calculator'
    },
    {
      id: 4,
      title: '组件通信演示',
      description: '展示Angular组件间的通信方式，包括父子组件通信、兄弟组件通信等。',
      tags: ['组件通信', '待完成'],
      status: 'pending',
      route: '/assignments/component-communication'
    },
    {
      id: 5,
      title: '服务与依赖注入',
      description: '演示Angular服务的创建和使用，以及依赖注入的实现方式和最佳实践。',
      tags: ['服务', '依赖注入', '待完成'],
      status: 'pending',
      route: '/assignments/service-di'
    },
    {
      id: 6,
      title: '路由与导航',
      description: '实现单页应用的路由配置和导航功能，包括嵌套路由、路由守卫等高级特性。',
      tags: ['路由', '导航', '待完成'],
      status: 'pending',
      route: '/assignments/routing'
    },
    {
      id: 7,
      title: '表单验证',
      description: '展示Angular响应式表单和模板驱动表单的验证功能。',
      tags: ['表单', '验证', '待完成'],
      status: 'pending',
      route: '/assignments/form-validation'
    },
    {
      id: 8,
      title: 'HTTP请求处理',
      description: '演示如何使用HttpClient进行API调用和数据处理。',
      tags: ['HTTP', 'API', '待完成'],
      status: 'pending',
      route: '/assignments/http-requests'
    },
    {
      id: 9,
      title: '指令使用',
      description: '展示Angular内置指令和自定义指令的使用方法。',
      tags: ['指令', '待完成'],
      status: 'pending',
      route: '/assignments/directives'
    },
    {
      id: 10,
      title: '管道应用',
      description: '演示Angular管道的使用，包括内置管道和自定义管道。',
      tags: ['管道', '数据转换', '待完成'],
      status: 'pending',
      route: '/assignments/pipes'
    }
  ];

  stats = {
    totalAssignments: 10,
    completedModules: 3,
    completionRate: 100,
    expectedGrade: 'A+'
  };

  ngOnInit(): void {
    // 初始化数据或获取数据
  }

  getTagColor(tag: string): string {
    const colorMap: { [key: string]: string } = {
      'TypeScript': 'orange',
      '数据类型': 'blue',
      '模块化': 'red',
      '面向对象': 'green',
      '组件': 'cyan',
      '数据绑定': 'purple',
      '待完成': 'default',
      '服务': 'gold',
      '路由': 'lime',
      '表单': 'magenta'
    };
    return colorMap[tag] || 'default';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'check-circle';
      case 'in-progress':
        return 'sync';
      case 'pending':
        return 'clock-circle';
      default:
        return 'question-circle';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return '#52c41a';
      case 'in-progress':
        return '#1890ff';
      case 'pending':
        return '#d9d9d9';
      default:
        return '#d9d9d9';
    }
  }
}