import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './task';
import { Task } from './task';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost/taskapi';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list_tasks.php`);
  }

  add(task: Task): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/add_task.php`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_task.php?id=${id}`);
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload.php`, formData);
  }

  update(task: Task): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_task.php?id=${task.id}`, task);
  }
}