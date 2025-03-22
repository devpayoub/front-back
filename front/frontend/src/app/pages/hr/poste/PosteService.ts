import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PosteService {
  private apiUrl = 'http://localhost:8084/RH/api/Poste';  // URL de l'API

  constructor(private http: HttpClient) { }

  // Méthode pour obtenir la liste des postes
  getPostes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Méthode pour créer un poste
  createPoste(poste: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, poste);
  }

  // Méthode pour éditer un poste
  editPoste(id: number, poste: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, poste);
  }

  // Méthode pour supprimer un poste
// Méthode pour supprimer un poste
deletePoste(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${id}`);
}

}
