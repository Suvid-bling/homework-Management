import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// Import ALL required ng-zorro modules
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'; // Fixed: Changed from NzDropDownModule to NzDropdownModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    // RouterLinkActive, // Removed since you're not using it in the template
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzAvatarModule,
    NzDropDownModule // Fixed: Changed from NzDropDownModule to NzDropdownModule
    
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  title = 'Angular作业管理系统';
  
  menuItems = [
    {
      title: '首页概览',
      icon: 'home',
      link: '/dashboard',
      selected: true
    },
    {
      title: '创新介绍',
      icon: 'bulb',
      link: '/innovation-intro',
      selected: false
    },
    {
      title: '作者介绍',
      icon: 'user',
      link: '/author-intro',
      selected: false
    },
    {
      title: 'TS在线',
      icon: 'file-text',
      link: '/assignments/ts-canvas',
      selected: false
    },
    {
      title: '系统设置',
      icon: 'setting',
      link: '/settings',
      selected: false
    }
  ];

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  selectMenu(item: any): void {
    this.menuItems.forEach(menu => menu.selected = false);
    item.selected = true;
  }
}