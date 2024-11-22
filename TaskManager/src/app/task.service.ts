import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './task';
import { Task } from './task';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Note the full URL to the API
  private apiUrl = 'http://localhost/taskapi';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list_tasks.php`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      withCredentials: false // Important: set this to false for now
    });
  }

  add(task: Task): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/add_task.php`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`);
  }
}