// src/app/pages/assignments/http-requests/http-requests.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { map, filter, catchError, retry, timeout, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

// 接口定义
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

interface HttpRequestLog {
  id: number;
  method: string;
  url: string;
  status: string;
  timestamp: Date;
  duration: number;
  success: boolean;
}

@Component({
  selector: 'app-http-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './http-requests.component.html',
  styleUrls: ['./http-requests.component.css']
})
export class HttpRequestsComponent implements OnInit, OnDestroy {
  // 当前激活的标签页
  activeTab: string = 'get-requests';

  // 数据存储
  users: User[] = [];
  posts: Post[] = [];
  comments: Comment[] = [];
  todos: Todo[] = [];
  
  // 加载状态
  loading = {
    users: false,
    posts: false,
    comments: false,
    todos: false,
    creating: false,
    updating: false,
    deleting: false
  };

  // 错误信息
  errorMessage: string = '';
  
  // 搜索和过滤
  searchTerm: string = '';
  selectedUserId: number | null = null;
  
  // 表单数据
  newPost = {
    title: '',
    body: '',
    userId: 1
  };
  
  newUser = {
    name: '',
    username: '',
    email: '',
    phone: '',
    website: ''
  };
  
  editingPost: Post | null = null;
  
  // 请求日志
  requestLogs: HttpRequestLog[] = [];
  private logIdCounter = 1;
  
  // 统计数据
  stats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0
  };
  
  // 销毁主题
  private destroy$ = new Subject<void>();
  
  // 搜索主题
  private searchSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.setupSearch();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 设置搜索防抖
  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  // 执行搜索
  private performSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.loadPosts();
      return;
    }
    
    this.loading.posts = true;
    const startTime = Date.now();
    
    this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts').pipe(
      map(posts => posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
      )),
      catchError(this.handleError.bind(this)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (filteredPosts) => {
        this.posts = filteredPosts;
        this.loading.posts = false;
        this.logRequest('GET', 'posts/search', 'success', Date.now() - startTime);
      },
      error: () => {
        this.loading.posts = false;
        this.logRequest('GET', 'posts/search', 'error', Date.now() - startTime);
      }
    });
  }

  // 切换标签页
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.clearError();
    
    switch (tab) {
      case 'get-requests':
        if (this.users.length === 0) this.loadUsers();
        break;
      case 'post-requests':
        if (this.posts.length === 0) this.loadPosts();
        break;
      case 'put-delete':
        if (this.todos.length === 0) this.loadTodos();
        break;
    }
  }

  // GET 请求演示
  loadUsers(): void {
    this.loading.users = true;
    this.clearError();
    const startTime = Date.now();

    this.http.get<User[]>('https://jsonplaceholder.typicode.com/users').pipe(
      retry(2),
      timeout(10000),
      catchError(this.handleError.bind(this)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (users) => {
        this.users = users;
        this.loading.users = false;
        this.logRequest('GET', 'users', 'success', Date.now() - startTime);
      },
      error: () => {
        this.loading.users = false;
        this.logRequest('GET', 'users', 'error', Date.now() - startTime);
      }
    });
  }

  loadPosts(): void {
    this.loading.posts = true;
    this.clearError();
    const startTime = Date.now();

    let url = 'https://jsonplaceholder.typicode.com/posts';
    if (this.selectedUserId) {
      url += `?userId=${this.selectedUserId}`;
    }

    this.http.get<Post[]>(url).pipe(
      catchError(this.handleError.bind(this)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading.posts = false;
        this.logRequest('GET', 'posts', 'success', Date.now() - startTime);
      },
      error: () => {
        this.loading.posts = false;
        this.logRequest('GET', 'posts', 'error', Date.now() - startTime);
      }
    });
  }

  loadComments(postId: number): void {
    this.loading.comments = true;
    this.clearError();
    const startTime = Date.now();

    this.http.get<Comment[]>(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`).pipe(
      catchError(this.handleError.bind(this)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.loading.comments = false;
        this.logRequest('GET', `posts/${postId}/comments`, 'success', Date.now() - startTime);
      },
      error: () => {
        this.loading.comments = false;
        this.logRequest('GET', `posts/${postId}/comments`, 'error', Date.now() - startTime);
      }
    });
  }

  // POST 请求演示
  createPost(): void {
    if (!this.newPost.title.trim() || !this.newPost.body.trim()) {
      this.setError('请填写标题和内容');
      return;
    }

    this.loading.creating = true;
    this.clearError();
    const startTime = Date.now();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post<Post>('https://jsonplaceholder.typicode.com/posts', this.newPost, { headers }).pipe(
      catchError(this.handleError.bind(this)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (newPost) => {
        // 在实际应用中，服务器会返回带有真实ID的新帖子
        newPost.id = Date.now(); // 模拟ID
        this.posts.unshift(newPost);
        this.resetNewPost();
        this.loading.creating = false;
        this.logRequest('POST', 'posts', 'success', Date.now() - startTime);
      },
      error: () => {
        this.loading.creating = false;
        this.logRequest('POST', 'posts', 'error', Date.now() - startTime);
      }
    });
  }

  createUser(): void {
    if (!this.newUser.name.trim() || !this.newUser.email.trim()) {
      this.setError('请填写姓名和邮箱');
      return;
    }

    this.loading.creating = true;
    this.clearError();
    const startTime = Date.now();

    const userData = {
      ...this.newUser,
      company: { name: '', catchPhrase: '', bs: '' },
      address: {
        street: '', suite: '', city: '', zipcode: '',
        geo: { lat: '', lng: '' }
      }
    };

    this.http.post<User>('https://jsonplaceholder.typicode.com/users', userData).pipe(
      catchError(this.handleError.bind(this)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (newUser) => {
        newUser.id = Date.now();
        this.users.unshift(newUser);
        this.resetNewUser();
        this.loading.creating = false;
        this.logRequest('POST', 'users', 'success', Date.now() - startTime);
      },
      error: () => {
        this.loading.creating = false;
        this.logRequest('POST', 'users', 'error', Date.now() - startTime);
      }
    });
  }

  // PUT 请求演示
  loadTodos(): void {
    this.loading.todos = true;
    this.clearError();
    const startTime = Date.now();

    this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').pipe(
      map(todos => todos.slice(0, 20)), // 只显示前20个
      catchError(this.handleError.bind(this)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading.todos = false;
        this.logRequest('GET', 'todos', 'success', Date.now() - startTime);
      },
      error: () => {
        this.loading.todos = false;
        this.logRequest('GET', 'todos', 'error', Date.now() - startTime);
      }
    });
  }

  updateTodo(todo: Todo): void {
    this.loading.updating = true;
    this.clearError();
    const startTime = Date.now();

    const updatedTodo = { ...todo, completed: !todo.completed };

    this.http.put<Todo>(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, updatedTodo).pipe(
      catchError(this.handleError.bind(this)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updated) => {
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = { ...this.todos[index], completed: !this.todos[index].completed };
        }
        this.loading.updating = false;
        this.logRequest('PUT', `todos/${todo.id}`, 'success', Date.now() - startTime);
      },
      error: () => {
        this.loading.updating = false;
        this.logRequest('PUT', `todos/${todo.id}`, 'error', Date.now() - startTime);
      }
    });
  }

  editPost(post: Post): void {
    this.editingPost = { ...post };
  }

  updatePost(): void {
    if (!this.editingPost) return;

    this.loading.updating = true;
    this.clearError();
    const startTime = Date.now();

    this.http.put<Post>(`https://jsonplaceholder.typicode.com/posts/${this.editingPost.id}`, this.editingPost).pipe(
      catchError(this.handleError.bind(this)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updated) => {
        const index = this.posts.findIndex(p => p.id === this.editingPost!.id);
        if (index !== -1) {
          this.posts[index] = { ...this.editingPost! };
        }
        this.editingPost = null;
        this.loading.updating = false;
        this.logRequest('PUT', `posts/${updated.id}`, 'success', Date.now() - startTime);
      },
      error: () => {
        this.loading.updating = false;
        this.logRequest('PUT', `posts/${this.editingPost!.id}`, 'error', Date.now() - startTime);
      }
    });
  }

  cancelEdit(): void {
    this.editingPost = null;
  }

  // DELETE 请求演示
  deletePost(postId: number): void {
    if (!confirm('确定要删除这篇帖子吗？')) return;

    this.loading.deleting = true;
    this.clearError();
    const startTime = Date.now();

    this.http.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`).pipe(
      catchError(this.handleError.bind(this)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== postId);
        this.loading.deleting = false;
        this.logRequest('DELETE', `posts/${postId}`, 'success', Date.now() - startTime);
      },
      error: () => {
        this.loading.deleting = false;
        this.logRequest('DELETE', `posts/${postId}`, 'error', Date.now() - startTime);
      }
    });
  }

  deleteTodo(todoId: number): void {
    if (!confirm('确定要删除这个待办事项吗？')) return;

    this.loading.deleting = true;
    this.clearError();
    const startTime = Date.now();

    this.http.delete(`https://jsonplaceholder.typicode.com/todos/${todoId}`).pipe(
      catchError(this.handleError.bind(this)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.todos = this.todos.filter(t => t.id !== todoId);
        this.loading.deleting = false;
        this.logRequest('DELETE', `todos/${todoId}`, 'success', Date.now() - startTime);
      },
      error: () => {
        this.loading.deleting = false;
        this.logRequest('DELETE', `todos/${todoId}`, 'error', Date.now() - startTime);
      }
    });
  }

  // 搜索功能
  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  // 过滤功能
  onUserFilterChange(): void {
    this.loadPosts();
  }

  clearFilter(): void {
    this.selectedUserId = null;
    this.loadPosts();
  }

  // 工具方法
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '请求失败';
    
    if (error.error instanceof ErrorEvent) {
      // 客户端错误
      errorMessage = `客户端错误: ${error.error.message}`;
    } else {
      // 服务器错误
      errorMessage = `服务器错误 ${error.status}: ${error.message}`;
    }
    
    this.setError(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private setError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.clearError(), 5000);
  }

  private clearError(): void {
    this.errorMessage = '';
  }

  private resetNewPost(): void {
    this.newPost = { title: '', body: '', userId: 1 };
  }

  private resetNewUser(): void {
    this.newUser = { name: '', username: '', email: '', phone: '', website: '' };
  }

  private logRequest(method: string, url: string, status: string, duration: number): void {
    const log: HttpRequestLog = {
      id: this.logIdCounter++,
      method,
      url,
      status,
      timestamp: new Date(),
      duration,
      success: status === 'success'
    };
    
    this.requestLogs.unshift(log);
    
    // 只保留最近50条日志
    if (this.requestLogs.length > 50) {
      this.requestLogs = this.requestLogs.slice(0, 50);
    }
    
    this.updateStats();
  }

  private updateStats(): void {
    this.stats.totalRequests = this.requestLogs.length;
    this.stats.successfulRequests = this.requestLogs.filter(log => log.success).length;
    this.stats.failedRequests = this.stats.totalRequests - this.stats.successfulRequests;
    
    if (this.requestLogs.length > 0) {
      const totalDuration = this.requestLogs.reduce((sum, log) => sum + log.duration, 0);
      this.stats.averageResponseTime = Math.round(totalDuration / this.requestLogs.length);
    }
  }

  // 清除所有日志
  clearLogs(): void {
    this.requestLogs = [];
    this.updateStats();
  }

  // 获取用户名
  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : `用户 ${userId}`;
  }

  // 格式化时间
  formatTime(date: Date): string {
    return date.toLocaleTimeString();
  }

  // 获取状态样式类
  getStatusClass(success: boolean): string {
    return success ? 'status-success' : 'status-error';
  }

  // 获取方法样式类
  getMethodClass(method: string): string {
    const classes: { [key: string]: string } = {
      'GET': 'method-get',
      'POST': 'method-post',
      'PUT': 'method-put',
      'DELETE': 'method-delete'
    };
    return classes[method] || 'method-default';
  }
}