// system-settings.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzRadioModule } from 'ng-zorro-antd/radio';

interface UserSettings {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  notifications: boolean;
  autoSave: boolean;
  fontSize: number;
  compactMode: boolean;
  showAnimations: boolean;
  username: string;
  email: string;
  avatar: string;
}

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSwitchModule,
    NzSelectModule,
    NzSliderModule,
    NzIconModule,
    NzGridModule,
    NzDividerModule,
    NzUploadModule,
    NzAvatarModule,
    NzRadioModule
  ],
  template: `
    <div class="settings-container">
      <div nz-row [nzGutter]="24">
        <!-- 个人信息设置 -->
        <div nz-col [nzSpan]="12" [nzXs]="24" [nzSm]="24" [nzMd]="12">
          <nz-card nzTitle="个人信息" class="settings-card">
            <form nz-form [nzLayout]="'vertical'">
              <!-- 头像设置 -->
              <nz-form-item>
                <nz-form-label>头像</nz-form-label>
                <nz-form-control>
                  <div class="avatar-upload-section">
                    <!-- <nz-avatar 
                      [nzSize]="80" 
                      [nzSrc]="settings.avatar || null"
                      [nzText]="!settings.avatar ? settings.username[0] : null"
                      class="user-avatar">
                    </nz-avatar> -->
                    <div class="upload-actions">
                      <nz-upload
                        nzAction=""
                        nzListType="picture"
                        [nzShowUploadList]="false"
                        [nzBeforeUpload]="beforeUpload"
                        (nzChange)="handleUpload($event)">
                        <button nz-button nzType="default" nzSize="small">
                          <span nz-icon nzType="upload"></span>
                          上传头像
                        </button>
                      </nz-upload>
                      <button 
                        nz-button 
                        nzType="default" 
                        nzSize="small" 
                        nzDanger
                        *ngIf="settings.avatar"
                        (click)="removeAvatar()">
                        <span nz-icon nzType="delete"></span>
                        移除头像
                      </button>
                    </div>
                  </div>
                  <div class="upload-tip">
                    支持 JPG、PNG 格式，文件大小不超过 2MB
                  </div>
                </nz-form-control>
              </nz-form-item>

              <!-- 用户名 -->
              <nz-form-item>
                <nz-form-label>用户名</nz-form-label>
                <nz-form-control>
                  <input 
                    nz-input 
                    [(ngModel)]="settings.username" 
                    placeholder="请输入用户名"
                    name="username">
                </nz-form-control>
              </nz-form-item>

              <!-- 邮箱 -->
              <nz-form-item>
                <nz-form-label>邮箱</nz-form-label>
                <nz-form-control>
                  <input 
                    nz-input 
                    [(ngModel)]="settings.email" 
                    placeholder="请输入邮箱"
                    type="email"
                    name="email">
                </nz-form-control>
              </nz-form-item>
            </form>
          </nz-card>
        </div>

        <!-- 系统设置 -->
        <div nz-col [nzSpan]="12" [nzXs]="24" [nzSm]="24" [nzMd]="12">
          <nz-card nzTitle="系统设置" class="settings-card">
            <form nz-form [nzLayout]="'vertical'">
              <!-- 主题设置 -->
              <nz-form-item>
                <nz-form-label>主题模式</nz-form-label>
                <nz-form-control>
                  <nz-radio-group [(ngModel)]="settings.theme" name="theme">
                    <label nz-radio nzValue="light">
                      <span nz-icon nzType="sun"></span>
                      浅色模式
                    </label>
                    <label nz-radio nzValue="dark">
                      <span nz-icon nzType="moon"></span>
                      深色模式
                    </label>
                  </nz-radio-group>
                </nz-form-control>
              </nz-form-item>

              <!-- 语言设置 -->
              <nz-form-item>
                <nz-form-label>语言</nz-form-label>
                <nz-form-control>
                  <nz-select [(ngModel)]="settings.language" nzPlaceHolder="选择语言" name="language">
                    <nz-option nzValue="zh" nzLabel="简体中文"></nz-option>
                    <nz-option nzValue="en" nzLabel="English"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>

              <!-- 字体大小 -->
              <nz-form-item>
                <nz-form-label>字体大小</nz-form-label>
                <nz-form-control>
                  <nz-slider 
                    [(ngModel)]="settings.fontSize"
                    [nzMin]="12"
                    [nzMax]="20"
                    [nzStep]="1"
                    [nzMarks]="fontSizeMarks"
                    name="fontSize">
                  </nz-slider>
                </nz-form-control>
              </nz-form-item>

              <nz-divider></nz-divider>

              <!-- 功能开关 -->
              <nz-form-item>
                <nz-form-label>功能设置</nz-form-label>
                <nz-form-control>
                  <div class="switch-item">
                    <span class="switch-label">
                      <span nz-icon nzType="notification"></span>
                      桌面通知
                    </span>
                    <nz-switch 
                      [(ngModel)]="settings.notifications"
                      name="notifications">
                    </nz-switch>
                  </div>

                  <div class="switch-item">
                    <span class="switch-label">
                      <span nz-icon nzType="save"></span>
                      自动保存
                    </span>
                    <nz-switch 
                      [(ngModel)]="settings.autoSave"
                      name="autoSave">
                    </nz-switch>
                  </div>

                  <div class="switch-item">
                    <span class="switch-label">
                      <span nz-icon nzType="compress"></span>
                      紧凑模式
                    </span>
                    <nz-switch 
                      [(ngModel)]="settings.compactMode"
                      name="compactMode">
                    </nz-switch>
                  </div>

                  <div class="switch-item">
                    <span class="switch-label">
                      <span nz-icon nzType="play-circle"></span>
                      显示动画
                    </span>
                    <nz-switch 
                      [(ngModel)]="settings.showAnimations"
                      name="showAnimations">
                    </nz-switch>
                  </div>
                </nz-form-control>
              </nz-form-item>
            </form>
          </nz-card>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div nz-row [nzGutter]="16" class="action-section">
        <div nz-col [nzSpan]="24">
          <nz-card>
            <div class="action-buttons">
              <button 
                nz-button 
                nzType="primary" 
                nzSize="large"
                (click)="saveSettings()">
                <span nz-icon nzType="save"></span>
                保存设置
              </button>
              <button 
                nz-button 
                nzSize="large"
                (click)="resetSettings()">
                <span nz-icon nzType="reload"></span>
                重置默认
              </button>
              <button 
                nz-button 
                nzType="default" 
                nzSize="large"
                (click)="exportSettings()">
                <span nz-icon nzType="download"></span>
                导出设置
              </button>
              <nz-upload
                nzAction=""
                [nzShowUploadList]="false"
                [nzBeforeUpload]="beforeImportSettings"
                (nzChange)="importSettings($event)">
                <button nz-button nzType="default" nzSize="large">
                  <span nz-icon nzType="upload"></span>
                  导入设置
                </button>
              </nz-upload>
            </div>
          </nz-card>
        </div>
      </div>

      <!-- 预览区域 -->
      <div nz-row [nzGutter]="16" class="preview-section">
        <div nz-col [nzSpan]="24">
          <nz-card nzTitle="设置预览" class="preview-card">
            <div class="preview-content" [style.font-size.px]="settings.fontSize">
              <div class="preview-item">
                <h4>当前设置概览</h4>
                <ul class="settings-list">
                  <li>主题模式: {{ settings.theme === 'light' ? '浅色模式' : '深色模式' }}</li>
                  <li>语言: {{ settings.language === 'zh' ? '简体中文' : 'English' }}</li>
                  <li>字体大小: {{ settings.fontSize }}px</li>
                  <li>桌面通知: {{ settings.notifications ? '已开启' : '已关闭' }}</li>
                  <li>自动保存: {{ settings.autoSave ? '已开启' : '已关闭' }}</li>
                  <li>紧凑模式: {{ settings.compactMode ? '已开启' : '已关闭' }}</li>
                  <li>显示动画: {{ settings.showAnimations ? '已开启' : '已关闭' }}</li>
                </ul>
              </div>
            </div>
          </nz-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 0;
    }

    .settings-card {
      height: 100%;
      margin-bottom: 24px;
    }

    .avatar-upload-section {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }

    .user-avatar {
      flex-shrink: 0;
    }

    .upload-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .upload-tip {
      font-size: 12px;
      color: #999;
      margin-top: 8px;
    }

    .switch-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .switch-item:last-child {
      border-bottom: none;
    }

    .switch-label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(0, 0, 0, 0.85);
    }

    .action-section {
      margin: 24px 0;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .preview-section {
      margin-top: 24px;
    }

    .preview-card {
      background: #fafafa;
    }

    .preview-content {
      transition: font-size 0.3s ease;
    }

    .preview-item h4 {
      margin-bottom: 16px;
      color: #1890ff;
    }

    .settings-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .settings-list li {
      padding: 8px 0;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      justify-content: space-between;
    }

    .settings-list li:last-child {
      border-bottom: none;
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
      .avatar-upload-section {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .action-buttons button {
        width: 100%;
      }
    }
  `]
})
export class SystemSettingsComponent {
  settings: UserSettings = {
    theme: 'light',
    language: 'zh',
    notifications: true,
    autoSave: true,
    fontSize: 14,
    compactMode: false,
    showAnimations: true,
    username: '苏子毅',
    email: 'suziyi@example.com',
    avatar: ''
  };

  fontSizeMarks = {
    12: '小',
    14: '中',
    16: '大',
    18: '较大',
    20: '最大'
  };

  constructor(private message: NzMessageService) {
    this.loadSettings();
  }

  // 加载设置
  loadSettings(): void {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }

  // 保存设置
  saveSettings(): void {
    try {
      localStorage.setItem('userSettings', JSON.stringify(this.settings));
      this.message.success('设置保存成功！');
      this.applySettings();
    } catch (error) {
      this.message.error('设置保存失败！');
      console.error('Failed to save settings:', error);
    }
  }

  // 应用设置
  applySettings(): void {
    // 应用字体大小
    document.documentElement.style.fontSize = this.settings.fontSize + 'px';
    
    // 应用主题（这里可以扩展主题切换逻辑）
    if (this.settings.theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    // 应用紧凑模式
    if (this.settings.compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
  }

  // 重置设置
  resetSettings(): void {
    this.settings = {
      theme: 'light',
      language: 'zh',
      notifications: true,
      autoSave: true,
      fontSize: 14,
      compactMode: false,
      showAnimations: true,
      username: '苏子毅',
      email: 'suziyi@example.com',
      avatar: ''
    };
    this.message.info('设置已重置为默认值');
  }

  // 导出设置
  exportSettings(): void {
    const dataStr = JSON.stringify(this.settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings.json';
    link.click();
    URL.revokeObjectURL(url);
    this.message.success('设置已导出！');
  }

  // 头像上传前验证
  beforeUpload = (file: any): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.message.error('只能上传 JPG/PNG 格式的图片！');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.message.error('图片大小不能超过 2MB！');
      return false;
    }
    return false; // 阻止自动上传，手动处理
  };

  // 处理头像上传
  handleUpload(info: any): void {
    const file = info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.settings.avatar = e.target.result;
        this.message.success('头像上传成功！');
      };
      reader.readAsDataURL(file);
    }
  }

  // 移除头像
  removeAvatar(): void {
    this.settings.avatar = '';
    this.message.success('头像已移除！');
  }

  // 导入设置前验证
  beforeImportSettings = (file: any): boolean => {
    const isJson = file.type === 'application/json' || file.name.endsWith('.json');
    if (!isJson) {
      this.message.error('只能导入 JSON 格式的设置文件！');
      return false;
    }
    return false; // 阻止自动上传，手动处理
  };

  // 导入设置
  importSettings(info: any): void {
    const file = info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          this.settings = { ...this.settings, ...importedSettings };
          this.message.success('设置导入成功！');
        } catch (error) {
          this.message.error('设置文件格式错误！');
          console.error('Failed to import settings:', error);
        }
      };
      reader.readAsText(file);
    }
  }
}