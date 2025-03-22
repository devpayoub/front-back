import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl = 'http://localhost:8084/RH/api/Document';

  constructor(private http: HttpClient) {}

  // Upload Document
  uploadDocument(file: File): Observable<Document> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<Document>(`${this.baseUrl}/upload`, formData);
  }

  // Get All Documents
  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.baseUrl}/all`);
  }

  // Get Document Details
  getDocumentDetails(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.baseUrl}/get/info/${id}`);
  }

  // Download Document
  getIDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/load/${id}`, {
      responseType: 'blob'
    });
  }

  // Delete Document
  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
