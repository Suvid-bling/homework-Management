// form_validation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// 自定义验证器
export class CustomValidators {
  // 密码强度验证
  static passwordStrength(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasUppercase = /[A-Z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    const passwordValid = hasNumber && hasLowercase && hasUppercase && hasSpecial && isValidLength;

    if (!passwordValid) {
      return {
        passwordStrength: {
          hasNumber,
          hasLowercase,
          hasUppercase,
          hasSpecial,
          isValidLength
        }
      };
    }

    return null;
  }

  // 手机号验证
  static phoneNumber(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^1[3-9]\d{9}$/;
    const valid = phoneRegex.test(control.value);
    return valid ? null : { phoneNumber: true };
  }

  // 身份证号验证
  static idCard(control: AbstractControl): ValidationErrors | null {
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    const valid = idCardRegex.test(control.value);
    return valid ? null : { idCard: true };
  }

  // 年龄范围验证
  static ageRange(min: number, max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const age = parseInt(control.value);
      if (isNaN(age)) return { ageInvalid: true };
      if (age < min || age > max) {
        return { ageRange: { min, max, actual: age } };
      }
      return null;
    };
  }

  // 确认密码验证
  static confirmPassword(passwordField: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
      const password = control.parent.get(passwordField);
      const confirmPassword = control;
      
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { confirmPassword: true };
      }
      return null;
    };
  }

  // 异步邮箱验证（模拟服务器验证）
  static asyncEmailValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingEmails = ['admin@test.com', 'user@test.com', 'demo@test.com'];
        if (existingEmails.includes(control.value)) {
          resolve({ emailExists: true });
        } else {
          resolve(null);
        }
      }, 1000); // 模拟网络延迟
    });
  }
}

interface Student {
  name: string;
  email: string;
  phone: string;
  age: number;
  grade: string;
  subjects: string[];
}

interface TemplateFormData {
  username: string;
  email: string;
  phone: string;
  message: string;
  agreement: boolean;
}

@Component({
  selector: 'app-form-validation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form_validation.component.html',
  styleUrls: ['./form_validation.component.css']
})
export class FormValidationComponent implements OnInit {
  // 活动标签页
  activeTab = 'reactive';

  // 响应式表单
  studentForm!: FormGroup;
  isSubmitting = false;
  submittedData: any = null;

  // 模板驱动表单
  templateFormData: TemplateFormData = {
    username: '',
    email: '',
    phone: '',
    message: '',
    agreement: false
  };
  templateFormSubmitted = false;
  templateSubmittedData: any = null;

  // 表单验证状态
  validationStats = {
    reactive: { valid: 0, invalid: 0, pending: 0 },
    template: { valid: 0, invalid: 0, touched: 0 }
  };

  // 年级选项
  gradeOptions = [
    { value: 'freshman', label: '大一' },
    { value: 'sophomore', label: '大二' },
    { value: 'junior', label: '大三' },
    { value: 'senior', label: '大四' }
  ];

  // 科目选项
  subjectOptions = [
    { value: 'math', label: '数学' },
    { value: 'physics', label: '物理' },
    { value: 'chemistry', label: '化学' },
    { value: 'biology', label: '生物' },
    { value: 'computer', label: '计算机' },
    { value: 'english', label: '英语' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initReactiveForm();
    this.updateValidationStats();
  }

  // 初始化响应式表单
  initReactiveForm() {
    this.studentForm = this.fb.group({
      // 基本信息
      personalInfo: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email], [CustomValidators.asyncEmailValidator]],
        phone: ['', [Validators.required, CustomValidators.phoneNumber]],
        idCard: ['', [Validators.required, CustomValidators.idCard]],
        age: ['', [Validators.required, CustomValidators.ageRange(16, 65)]],
        gender: ['', Validators.required],
        birthday: ['', Validators.required]
      }),

      // 账户信息
      accountInfo: this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        password: ['', [Validators.required, CustomValidators.passwordStrength]],
        confirmPassword: ['', [Validators.required, CustomValidators.confirmPassword('password')]],
        securityQuestion: ['', Validators.required],
        securityAnswer: ['', [Validators.required, Validators.minLength(3)]]
      }),

      // 学习信息
      academicInfo: this.fb.group({
        grade: ['', Validators.required],
        major: ['', [Validators.required, Validators.minLength(2)]],
        gpa: ['', [Validators.required, Validators.min(0), Validators.max(4)]],
        subjects: this.fb.array([], Validators.required),
        hasScholarship: [false],
        scholarshipAmount: [{ value: '', disabled: true }]
      }),

      // 联系信息
      contactInfo: this.fb.group({
        address: this.fb.group({
          country: ['中国', Validators.required],
          province: ['', Validators.required],
          city: ['', Validators.required],
          street: ['', Validators.required],
          zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
        }),
        emergencyContact: this.fb.group({
          name: ['', Validators.required],
          relationship: ['', Validators.required],
          phone: ['', [Validators.required, CustomValidators.phoneNumber]]
        })
      }),

      // 其他信息
      preferences: this.fb.group({
        newsletter: [true],
        notifications: [true],
        theme: ['light'],
        language: ['zh'],
        comments: ['', Validators.maxLength(500)]
      })
    });

    // 监听奖学金状态变化
    this.studentForm.get('academicInfo.hasScholarship')?.valueChanges.subscribe(hasScholarship => {
      const scholarshipAmountControl = this.studentForm.get('academicInfo.scholarshipAmount');
      if (hasScholarship) {
        scholarshipAmountControl?.enable();
        scholarshipAmountControl?.setValidators([Validators.required, Validators.min(1000)]);
      } else {
        scholarshipAmountControl?.disable();
        scholarshipAmountControl?.clearValidators();
        scholarshipAmountControl?.setValue('');
      }
      scholarshipAmountControl?.updateValueAndValidity();
    });

    // 监听表单状态变化
    this.studentForm.statusChanges.subscribe(() => {
      this.updateValidationStats();
    });
  }

  // 获取科目表单数组
  get subjectsFormArray(): FormArray {
    return this.studentForm.get('academicInfo.subjects') as FormArray;
  }

  // 添加科目
  addSubject() {
    const subjectGroup = this.fb.group({
      subject: ['', Validators.required],
      score: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      credit: ['', [Validators.required, Validators.min(1), Validators.max(10)]]
    });
    this.subjectsFormArray.push(subjectGroup);
  }

  // 移除科目
  removeSubject(index: number) {
    this.subjectsFormArray.removeAt(index);
  }

  // 获取表单控件
  getFormControl(path: string): AbstractControl | null {
    return this.studentForm.get(path);
  }

  // 检查字段是否有错误
  hasError(path: string, errorType?: string): boolean {
    const control = this.getFormControl(path);
    if (!control) return false;
    
    if (errorType) {
      return control.hasError(errorType) && (control.dirty || control.touched);
    }
    return control.invalid && (control.dirty || control.touched);
  }

  // 获取错误信息
  getErrorMessage(path: string): string {
    const control = this.getFormControl(path);
    if (!control || control.valid) return '';

    const errors = control.errors;
    if (!errors) return '';

    // 根据错误类型返回对应的错误信息
    if (errors['required']) return '此字段为必填项';
    if (errors['email']) return '请输入有效的邮箱地址';
    if (errors['minlength']) return `最少需要${errors['minlength'].requiredLength}个字符`;
    if (errors['maxlength']) return `最多只能输入${errors['maxlength'].requiredLength}个字符`;
    if (errors['min']) return `最小值为${errors['min'].min}`;
    if (errors['max']) return `最大值为${errors['max'].max}`;
    if (errors['pattern']) return '格式不正确';
    if (errors['phoneNumber']) return '请输入有效的手机号码';
    if (errors['idCard']) return '请输入有效的身份证号码';
    if (errors['emailExists']) return '该邮箱已被注册';
    if (errors['confirmPassword']) return '两次输入的密码不一致';
    if (errors['ageRange']) return `年龄必须在${errors['ageRange'].min}-${errors['ageRange'].max}岁之间`;
    
    if (errors['passwordStrength']) {
      const requirements = errors['passwordStrength'];
      const missing = [];
      if (!requirements.hasNumber) missing.push('数字');
      if (!requirements.hasLowercase) missing.push('小写字母');
      if (!requirements.hasUppercase) missing.push('大写字母');
      if (!requirements.hasSpecial) missing.push('特殊字符');
      if (!requirements.isValidLength) missing.push('至少8位');
      return `密码必须包含：${missing.join('、')}`;
    }

    return '输入格式不正确';
  }

  // 获取密码强度
  getPasswordStrength(): number {
    const control = this.getFormControl('accountInfo.password');
    if (!control || !control.value) return 0;

    const value = control.value;
    let strength = 0;

    if (/[0-9]/.test(value)) strength += 20;
    if (/[a-z]/.test(value)) strength += 20;
    if (/[A-Z]/.test(value)) strength += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) strength += 20;
    if (value.length >= 8) strength += 20;

    return strength;
  }

  // 获取密码强度文本
  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 20) return '很弱';
    if (strength <= 40) return '弱';
    if (strength <= 60) return '中等';
    if (strength <= 80) return '强';
    return '很强';
  }

  // 获取密码强度颜色
  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 20) return '#ff4d4f';
    if (strength <= 40) return '#ff7a45';
    if (strength <= 60) return '#ffa940';
    if (strength <= 80) return '#52c41a';
    return '#389e0d';
  }

  // 提交响应式表单
  onSubmitReactiveForm() {
    if (this.studentForm.valid) {
      this.isSubmitting = true;
      
      // 模拟提交延迟
      setTimeout(() => {
        this.submittedData = this.studentForm.value;
        this.isSubmitting = false;
        console.log('响应式表单提交数据:', this.submittedData);
      }, 2000);
    } else {
      // 标记所有字段为touched以显示验证错误
      this.markFormGroupTouched(this.studentForm);
    }
  }

  // 重置响应式表单
  resetReactiveForm() {
    this.studentForm.reset();
    this.submittedData = null;
    this.subjectsFormArray.clear();
    this.initReactiveForm();
  }

  // 标记表单组为touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  // 提交模板驱动表单
  onSubmitTemplateForm(form: any) {
    this.templateFormSubmitted = true;
    if (form.valid) {
      this.templateSubmittedData = { ...this.templateFormData };
      console.log('模板驱动表单提交数据:', this.templateSubmittedData);
    }
  }

  // 重置模板驱动表单
  resetTemplateForm(form: any) {
    this.templateFormData = {
      username: '',
      email: '',
      phone: '',
      message: '',
      agreement: false
    };
    this.templateFormSubmitted = false;
    this.templateSubmittedData = null;
    form.resetForm();
  }

  // 切换标签页
  switchTab(tab: string) {
    this.activeTab = tab;
  }

  // 更新验证统计
  updateValidationStats() {
    if (this.studentForm) {
      this.validationStats.reactive = this.getFormValidationStats(this.studentForm);
    }
  }

  // 获取表单验证统计
  getFormValidationStats(form: FormGroup): { valid: number, invalid: number, pending: number } {
    let valid = 0;
    let invalid = 0;
    let pending = 0;

    const countControls = (control: AbstractControl) => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach(countControls);
      } else if (control instanceof FormArray) {
        control.controls.forEach(countControls);
      } else {
        if (control.pending) pending++;
        else if (control.valid) valid++;
        else invalid++;
      }
    };

    countControls(form);
    return { valid, invalid, pending };
  }

  // 获取表单完成百分比
  getFormCompletionPercentage(): number {
    const stats = this.validationStats.reactive;
    const total = stats.valid + stats.invalid + stats.pending;
    return total > 0 ? Math.round((stats.valid / total) * 100) : 0;
  }
}