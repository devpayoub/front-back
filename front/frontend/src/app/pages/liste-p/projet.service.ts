import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from './liste-p.component';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public baseUrl = 'http://localhost:8070/api/projets'; // URL de base de votre API backend Spring Boot

  constructor(private http: HttpClient) {}

  
  // Obtenir tous les projets
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}`);
  }

  // Créer un nouveau projet
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}`, project);
  }

  // Mettre à jour un projet existant
  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/${id}`, project);
  }

  // Supprimer un projet
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getProjectById(idProjet: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${idProjet}`);
  }
}