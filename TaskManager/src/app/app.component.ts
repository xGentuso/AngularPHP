import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'

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
    status: 'pending'
  };

  tasks: Task[] = [];

  error = '';
  success = '';

  constructor(private taskService: TaskService) {

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
    
    this.taskService.add(this.task).subscribe({
      next: (res: any) => {
        if (res.data) {
          this.tasks.push(res.data);
          this.success = 'Task added successfully';
          f.reset();
          // Refresh the task list
          this.getTasks();
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
    this.task = { ...task };  // Copy task to form for editing
  }

}
