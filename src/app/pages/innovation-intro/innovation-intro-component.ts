import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

interface Feature {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface TechStack {
  name: string;
  version: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-innovation-intro',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzTimelineModule,
    NzTagModule,
    NzDividerModule,
    NzGridModule,
    NzIconModule,
    NzListModule,
    NzTypographyModule
  ],
  templateUrl: './innovation-intro.component.html',
  styleUrls: ['./innovation-intro.component.css']
})
export class InnovationIntroComponent {
  features: Feature[] = [
    {
      title: '现代化架构',
      description: '基于Angular 17最新版本，采用独立组件和新的控制流语法，提供更好的性能和开发体验',
      icon: 'apartment',
      color: '#1890ff'
    },
    {
      title: '响应式设计',
      description: '完美适配各种设备尺寸，从手机到桌面电脑都能提供最佳的用户体验',
      icon: 'mobile',
      color: '#52c41a'
    },
    {
      title: '模块化管理',
      description: '将各个作业模块化，便于管理和扩展，每个作业都是独立的组件',
      icon: 'block',
      color: '#fa8c16'
    },
    {
      title: '交互式演示',
      description: '不仅展示代码，还能实时运行和查看结果，提供更直观的学习体验',
      icon: 'interaction',
      color: '#722ed1'
    },
    {
      title: '优雅的UI',
      description: '使用ng-zorro-antd组件库，提供统一、美观的用户界面',
      icon: 'bg-colors',
      color: '#eb2f96'
    },
    {
      title: '完整的功能',
      description: '包含作业管理、分类筛选、搜索等完整功能，满足实际使用需求',
      icon: 'appstore',
      color: '#13c2c2'
    }
  ];

  techStack: TechStack[] = [
    {
      name: 'Angular',
      version: '17.x',
      description: '现代化的前端框架，提供完整的开发解决方案',
      link: 'https://angular.io'
    },
    {
      name: 'TypeScript',
      version: '5.x',
      description: '为JavaScript添加静态类型，提高代码质量和可维护性',
      link: 'https://www.typescriptlang.org'
    },
    {
      name: 'ng-zorro-antd',
      version: '17.x',
      description: '企业级UI组件库，提供丰富的组件和优秀的设计',
      link: 'https://ng.ant.design'
    },
    {
      name: 'RxJS',
      version: '7.x',
      description: '响应式编程库，处理异步数据流',
      link: 'https://rxjs.dev'
    }
  ];

  developmentProcess = [
    {
      phase: '需求分析',
      description: '分析项目要求，确定功能模块和技术选型',
      status: 'finish'
    },
    {
      phase: '架构设计',
      description: '设计系统架构，规划模块结构和路由配置',
      status: 'finish'
    },
    {
      phase: '界面设计',
      description: '设计用户界面，确保良好的用户体验',
      status: 'finish'
    },
    {
      phase: '功能开发',
      description: '实现各个功能模块，包括作业展示和管理功能',
      status: 'process'
    },
    {
      phase: '测试优化',
      description: '进行功能测试和性能优化',
      status: 'wait'
    },
    {
      phase: '部署上线',
      description: '项目部署和文档编写',
      status: 'wait'
    }
  ];

  innovations = [
    '使用Angular 17的最新特性，如独立组件和新的控制流语法',
    '实现了完整的作业管理系统，不仅仅是作业展示',
    '每个作业都有交互式演示，可以实时运行代码查看结果',
    '采用懒加载技术，提高应用性能',
    '响应式设计，完美适配移动端',
    '使用TypeScript严格模式，确保代码质量',
    '模块化设计，便于扩展和维护',
    '统一的UI风格，提供良好的视觉体验'
  ];

  challenges = [
    {
      challenge: 'Angular 17新特性学习',
      solution: '查阅官方文档，参考社区最佳实践，逐步迁移到新语法'
    },
    {
      challenge: 'ng-zorro-antd组件定制',
      solution: '深入研究组件API，通过自定义样式实现个性化需求'
    },
    {
      challenge: '代码实时执行功能',
      solution: '使用Function构造函数安全执行代码，捕获console输出'
    },
    {
      challenge: '响应式布局实现',
      solution: '使用Grid系统和媒体查询，确保各种设备的适配'
    }
  ];
}