import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzProgressModule } from 'ng-zorro-antd/progress';

interface Skill {
  name: string;
  level: number;
  color: string;
}

interface Hobby {
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-author-intro',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzAvatarModule,
    NzTagModule,
    NzIconModule,
    NzGridModule,
    NzDescriptionsModule,
    NzBadgeModule,
    NzTimelineModule,
    NzProgressModule
  ],
  templateUrl: './author-intro.component.html',
  styleUrls: ['./author-intro.component.css']
})
export class AuthorIntroComponent {
  personalInfo = {
    name: '苏子毅',
    gender: '男',
    class: '计算机科学与技术2021级',
    studentId: '202100000000',
    email: 'suziyi@example.com',
    github: 'github.com/suziyi',
    motto: '热爱编程，追求卓越'
  };

  hobbies: Hobby[] = [
    { name: '跑步', icon: 'thunderbolt', color: 'green' },
    { name: '游泳', icon: 'crown', color: 'blue' },
    { name: '阅读', icon: 'read', color: 'orange' },
    { name: '打游戏', icon: 'play-circle', color: 'purple' }
  ];

  skills: Skill[] = [
    { name: 'Angular', level: 85, color: '#dd0031' },
    { name: 'TypeScript', level: 90, color: '#007acc' },
    { name: 'JavaScript', level: 95, color: '#f7df1e' },
    { name: 'HTML/CSS', level: 88, color: '#e34c26' },
    { name: 'Node.js', level: 75, color: '#339933' },
    { name: 'Git', level: 80, color: '#f05032' }
  ];

  timeline = [
    {
      date: '2021年9月',
      event: '进入大学，开始学习计算机科学',
      color: 'green'
    },
    {
      date: '2022年3月',
      event: '开始学习前端开发，接触Angular框架',
      color: 'blue'
    },
    {
      date: '2023年6月',
      event: '参加前端开发实习，积累项目经验',
      color: 'orange'
    },
    {
      date: '2024年12月',
      event: '完成Angular作业管理系统项目',
      color: 'red'
    }
  ];
}