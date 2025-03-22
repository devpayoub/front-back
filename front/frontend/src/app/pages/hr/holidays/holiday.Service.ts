import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeConges } from './holidays.modal';


@Injectable({
  providedIn: 'root'
})
export class DemandeCongeService {
  addDemandeConges(newHoliday: DemandeConges) {
    throw new Error('Method not implemented.');
  }
  private apiURL = 'http://localhost:8084/RH/api/DemandeConge'; // URL de base pour l'API
  private api = 'http://localhost:8084/RH/api/Employes'; // Remplacez par votre URL
  constructor(private http: HttpClient) { }

  // Créer une demande de congé
  createDemandeConge(demandeConge: DemandeConges): Observable<DemandeConges> {
    return this.http.post<DemandeConges>(this.apiURL, demandeConge);
  }

  // Récupérer toutes les demandes de congé
  getAllDemandeConges(): Observable<DemandeConges[]> {
    return this.http.get<DemandeConges[]>(this.apiURL);
  }

  // Récupérer une demande de congé par ID
  getDemandeCongeById(id: number): Observable<DemandeConges> {
    return this.http.get<DemandeConges>(`${this.apiURL}/${id}`);
  }

  // Mettre à jour une demande de congé par ID
  updateDemandeConge(id: number, demandeConge: DemandeConges): Observable<DemandeConges> {
    return this.http.put<DemandeConges>(`${this.apiURL}/${id}`, demandeConge);
  }

  // Supprimer une demande de congé par ID
  deleteDemandeConge(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
  getAllEmployes(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
}
