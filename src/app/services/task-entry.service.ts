import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TaskEntryRequest {
  clientName: string;
  clientId: string;
  issueCategory: string;
  issueDescription: string;
  startTime: string;
  endTime: string;
  resolutionNotes: string;
  status: string;
  escalatedTo: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskEntryService {

  private apiUrl =
    'http://localhost:5089/api/TaskEntry';

  constructor(
    private http: HttpClient
  ) {}

  // ================= CREATE TASK =================

  createTask(
    task: TaskEntryRequest
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      task
    );
  }

  // ================= GET MY TASKS =================

  getMyTasks(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/my`
    );
  }

  // ================= UPDATE TASK =================

  updateTask(
    id: number,
    status: string,
    escalatedTo: string
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      {
        status: status,
        escalatedTo:
          status === 'Escalated'
            ? escalatedTo
            : ''
      }
    );
  }
}
