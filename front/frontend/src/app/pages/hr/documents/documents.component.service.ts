import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Document {
  idDoc: number;
  name: string;
  type: string;
  document: any; // Renommé pour correspondre au backend
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:8084/RH/api/Document'; 

  constructor(private http: HttpClient) {}

  // Méthode pour télécharger un document
  uploadDocument(file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<Document>(`${this.apiUrl}/upload`, formData);
  }
  

  // Méthode pour obtenir tous les documents
   // Get all Documents
   getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/all`);
  }

  // Méthode pour obtenir les détails d'un document spécifique
  getDocumentDetails(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/get/info/${id}`);
  }

  // Méthode pour charger un document sous forme de Blob (par exemple pour le télécharger)
  loadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/load/${id}`, { responseType: 'blob' });
  }

  // Méthode pour supprimer un document
  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
