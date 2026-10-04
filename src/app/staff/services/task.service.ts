import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StaffTask {
  id: number;
  userId: number;
  clientName: string;
  clientId?: string;
  issueCategory: string;
  issueDescription?: string;
  startTime?: string;
  endTime?: string;
  resolutionNotes?: string;
  status: string;
  escalatedTo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTaskRequest {
  clientName: string;
  clientId?: string;
  issueCategory: string;
  issueDescription?: string;
  startTime?: string;
  endTime?: string;
  resolutionNotes?: string;
  status: string;
  escalatedTo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:5000/api/TaskEntry';

  constructor(private http: HttpClient) {}

  getMyTasks(): Observable<StaffTask[]> {
    return this.http.get<StaffTask[]>(
      `${this.apiUrl}/my`
    );
  }

  createTask(task: CreateTaskRequest): Observable<any> {
    return this.http.post(
      this.apiUrl,
      task
    );
  }

  updateTaskStatus(
    id: number,
    status: string,
    escalatedTo?: string
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      {
        status,
        escalatedTo
      }
    );
  }
}