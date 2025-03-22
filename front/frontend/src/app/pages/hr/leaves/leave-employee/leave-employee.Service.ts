import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Absence } from './leave-employee.modal';


@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  private apiUrl = 'http://localhost:8084/RH/api/Absence'; // Remplacer par votre URL backend
  private employeApiUrl = 'http://localhost:8084/RH/api/Employes'; // Remplacer par votre URL backend

  constructor(private http: HttpClient) {}

  // Récupérer la liste des absences
  getAbsences(): Observable<Absence[]> {
    return this.http.get<Absence[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }
// Récupérer la liste des employés
getEmployes(): Observable<any[]> {  // Corriger pour retourner un Observable d'un tableau d'employés
  return this.http.get<any[]>(this.employeApiUrl) // Remplacer avec l'URL correcte pour récupérer les employés
    .pipe(catchError(this.handleError));
}
  // Ajouter une nouvelle absence
  addAbsence(absence: Absence): Observable<Absence> {
    return this.http.post<Absence>(this.apiUrl, absence, this.httpOptions())
      .pipe(catchError(this.handleError));
  }

  // Modifier une absence
  updateAbsence(id: number, absence: Absence): Observable<Absence> {
    return this.http.put<Absence>(`${this.apiUrl}/${id}`, absence, this.httpOptions())
      .pipe(catchError(this.handleError));
  }

  // Supprimer une absence
  deleteAbsence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Gestion des erreurs
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  // Options HTTP pour les requêtes
  private httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
}
