import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ActionPlan} from './plan-action.component';
import { Project } from '../liste-p/liste-p.component';


@Injectable({
  providedIn: 'root'
})
export class ActionPlanService {
  private baseUrl = 'http://localhost:8070/api/planactions';
  public baseUrl1 = 'http://localhost:8070/api/projets'; // Changez l'URL en fonction de votre configuration

  constructor(private http: HttpClient) { }

  getAllActionPlans(): Observable<ActionPlan[]> {
    return this.http.get<ActionPlan[]>(`${this.baseUrl}`);
  }

  createActionPlan(actionPlan: ActionPlan): Observable<ActionPlan> {
    return this.http.post<ActionPlan>(`${this.baseUrl}`, actionPlan);
  }

  updatePlanaction(id: number, actionPlan: ActionPlan): Observable<ActionPlan> {
    return this.http.put<ActionPlan>(`${this.baseUrl}/${id}`, actionPlan);
  }

  deleteActionPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  // Obtenir tous les projets
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl1}`);
  }
}