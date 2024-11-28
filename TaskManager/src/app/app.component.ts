import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { HttpClient } from '@angular/common/http';

import { ApiResponse, Task } from './task';
import { TaskService } from './task.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  task: Task = {
    id: 0,
    title: '',
    description: '',
    due_date: '',
    priority: 'low',
    status: 'pending',
    image_name: ''
  };

  tasks: Task[] = [];

  error = '';
  success = '';
  selectedFile: File | null = null;
  apiUrl = 'http://localhost/taskapi';

  constructor(private taskService: TaskService, private http: HttpClient) {

  }

  ngOnInit() {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getAll().subscribe({
      next: (response: ApiResponse) => {
        this.tasks = response.data;
        this.success = 'Tasks retrieved successfully';
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.error = err.message || 'Failed to fetch tasks';
      }
    });
  }

  private resetAlerts(): void {
    this.error = '';
    this.success = '';
  }

  addTask(f: NgForm) {
    this.resetAlerts();
    
    // First upload the image if one is selected
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      
      this.taskService.uploadFile(formData).subscribe({
        next: (response) => {
          console.log('Upload response:', response); // Debug log
          if (response.success) {
            this.task.image_name = response.filename;
            this.createTask(f);
          } else {
            this.error = response.message || 'File upload failed';
          }
        },
        error: (err) => {
          console.error('File upload failed:', err);
          this.error = 'File upload failed';
        }
      });
    } else {
      this.createTask(f);
    }
  }

  private createTask(f: NgForm): void {
    this.taskService.add(this.task).subscribe({
      next: (res: any) => {
        console.log('Task creation response:', res); // Debug log
        if (res.data) {
          this.tasks.push(res.data);
          this.success = 'Task added successfully';
          f.reset();
          this.selectedFile = null;
          this.getTasks(); // Refresh the task list
        } else {
          this.error = 'Invalid response format';
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = err.message || 'An error occurred';
      }
    });
  }
  
  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.success = 'Task deleted successfully';
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = err.message || 'Failed to delete task';
      }
    });
  }

  editTask(task: Task): void {
    this.task = { ...task };  
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
        return;
    }
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post<any>('http://localhost/taskapi/upload', formData).subscribe(
        (response: any) => console.log('File uploaded successfully:', response),
        error => console.error('File upload failed:', error)
    );    
  }
    
  getImageUrl(task: Task): string {
    return `http://localhost/taskapi/uploads/${task.image_name}`;
  }
}
