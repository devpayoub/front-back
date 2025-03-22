import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { List, Task } from './gestion-projet.component';
import { Project } from '../pages/liste-p/liste-p.component';


@Injectable({
  providedIn: 'root'
})
export class ListeTacheService {

  private baseUrl = 'http://localhost:8070/api/listes';
  
  private BaseURL = 'http://localhost:8070/api/taches'; // Base URL for your backend API
  private apiemail='http://localhost:8070/mail/send';
  private baseUrl1 = 'http://localhost:8070/api/projets';
  
  
  

  constructor(private http: HttpClient) {}

  // Obtenir toutes les listes
  getLists(): Observable<List[]> {
    return this.http.get<List[]>(this.baseUrl);
  }
  createList(list: List): Observable<any> {
    return this.http.post(this.baseUrl, list);
  }
  // Mettre à jour une liste existante
  updateList(id: number, list: List): Observable<List> {
    return this.http.put<List>(`${this.baseUrl}/${id}`, list);
  }

  // Supprimer une liste
  deleteList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  ajouterListe(projetId: number, nomListe: string): Observable<List> {
    return this.http.post<List>(`${this.baseUrl}/ajouter`, null, {
      params: {
        projetId: projetId.toString(),
        nomListe: nomListe
      }
    });
  }
  // Méthode pour obtenir les listes par ID de projet
  getListesByProjetId(projetId: number): Observable<List[]> {
    return this.http.get<List[]>(`${this.baseUrl}/projet/${projetId}`);
  }

  // Obtenir toutes les tâches d'une liste
  getTasks(listId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.BaseURL}/${listId}`);
  }

  // Ajouter une tâche à une liste
  addTaskToList(listId: number, task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.BaseURL}/${listId}`, task);
  }

  // Mettre à jour une tâche existante
  updateTask(listId: number, currentTaskId: number | undefined, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.BaseURL}/${listId}/${task.idTache}`, task);
  }
  // Supprimer une tâche d'une liste
  deleteTask(listId: number, taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.BaseURL}/${listId}/${taskId}`);
  } 
  // Ajouter une tâche à une liste
  ajouterTache(listeId: number, descriptionTache: string): Observable<Task> {
    const params = new HttpParams()
      .set('listeId', listeId.toString())
      .set('descriptionTache', descriptionTache);

    return this.http.post<Task>(`${this.BaseURL}/ajouter`, null, { params });
  }
  modifierTache(listeId: number, tacheId: number, updatedTache: Task): Observable<Task> {
    return this.http.put<Task>(`${this.BaseURL}/${listeId}/${tacheId}`, updatedTache);
  }

  // Obtenir toutes les tâches par ID de liste
  getTachesByListeId(listeId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.BaseURL}/liste/${listeId}`);
  }
  sendInvitation(email: string): Observable<string> {
    return this.http.post<string>(this.apiemail, { to: email });
  }
  inviteMember(email: string, projectId: number): Observable<string> {
    return this.http.post<string>(this.apiemail, { to: email, projectId });
  }
  getMemberEmails(projetId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl1}/members/emails/${projetId}`);
  }

  
}