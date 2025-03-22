import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contrat } from './Contrat.model'; // Modèle des contrats

@Injectable({
  providedIn: 'root',
})
export class ContratService {
  private apiUrl = 'http://localhost:8084/RH/api/Contrat'; // Remplacez par l'URL de votre API
  constructor(private http: HttpClient) {}

  getContrats(page: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}`);
  }

  // Ajoutez la méthode pour récupérer tous les contrats
  getAllContrats(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(this.apiUrl);
  }

  addContrat(contrat: Contrat): Observable<Contrat> {
    return this.http.post<Contrat>(this.apiUrl, contrat);
  }

  updateContrat(contrat: Contrat): Observable<Contrat> {
    return this.http.put<Contrat>(`${this.apiUrl}/${contrat.id}`, contrat);
  }

  deleteContrat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}