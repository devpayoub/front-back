import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeMission } from './employe-mission.model';

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private baseUrl = 'http://localhost:8084/RH/api/EmployeMission';

  constructor(private http: HttpClient) {}

  getMissions(): Observable<EmployeMission[]> {
    return this.http.get<EmployeMission[]>(this.baseUrl);
  }

  addMission(mission: EmployeMission): Observable<EmployeMission> {
    return this.http.post<EmployeMission>(this.baseUrl, mission);
  }

  updateMission(mission: EmployeMission): Observable<EmployeMission> {
    return this.http.put<EmployeMission>(`${this.baseUrl}/${mission.id}`, mission);
  }

  deleteMission(missionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${missionId}`);
  }

  getEmployes(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8084/RH/api/Employes');
  }

  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8084/RH/api/Document/all');
  }
}
