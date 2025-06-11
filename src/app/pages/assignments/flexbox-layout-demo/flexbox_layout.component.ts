import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flexbox-layout-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flexbox_layout.component.html',
  styleUrls: ['./flexbox_layout.component.css']
})
export class FlexboxLayoutDemoComponent {
  // Demo data for the three components
  cardData = [
    {
      id: 1,
      title: '组件一',
      subtitle: 'Component One',
      content: '这是第一个组件的内容，展示了基本的卡片布局和样式设计。',
      color: '#1890ff',
      icon: '🎯'
    },
    {
      id: 2,
      title: '组件二',
      subtitle: 'Component Two',
      content: '这是第二个组件的内容，可以包含更多的信息和交互元素。',
      color: '#52c41a',
      icon: '🚀'
    },
    {
      id: 3,
      title: '组件三',
      subtitle: 'Component Three',
      content: '这是第三个组件的内容，演示了组件之间的协调和布局效果。',
      color: '#fa8c16',
      icon: '⭐'
    }
  ];

  currentLayout = 'horizontal';

  setLayout(layout: string) {
    this.currentLayout = layout;
  }

  getLayoutName(): string {
    switch (this.currentLayout) {
      case 'horizontal':
        return '水平布局 (Horizontal Layout)';
      case 'mixed-horizontal':
        return '混合水平布局 (Mixed Horizontal Layout)';
      case 'mixed-vertical':
        return '混合垂直布局 (Mixed Vertical Layout)';
      default:
        return '未知布局';
    }
  }

  getLayoutDescription(): string {
    switch (this.currentLayout) {
      case 'horizontal':
        return '三个组件水平排列，等宽分布，适合展示并列的内容。';
      case 'mixed-horizontal':
        return '三个组件水平排列，但尺寸不同，第一个组件占据更多空间。';
      case 'mixed-vertical':
        return '三个组件垂直排列，高度不同，中间组件自动扩展填充剩余空间。';
      default:
        return '请选择一个布局方式。';
    }
  }

  getCurrentLayoutCode(): string {
    switch (this.currentLayout) {
      case 'horizontal':
        return `.layout-horizontal {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  gap: 16px;
}

.component-card {
  flex: 1; /* 等宽分布 */
  min-width: 250px;
}`;
      case 'mixed-horizontal':
        return `.layout-mixed-horizontal {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.component-1 { flex: 2; min-width: 300px; }
.component-2 { flex: 1; min-width: 200px; }
.component-3 { flex: 1; min-width: 200px; }`;
      case 'mixed-vertical':
        return `.layout-mixed-vertical {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;
  min-height: 600px;
}

.component-1 { flex: 0 0 auto; height: 150px; }
.component-2 { flex: 1; min-height: 200px; }
.component-3 { flex: 0 0 auto; height: 180px; }`;
      default:
        return '/* 请选择一个布局方式查看代码 */';
    }
  }
}