import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = 'http://localhost:8084/RH/api/Document/upload'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  // Méthode pour uploader un document avec form-data
  uploadDocument(file: File, name: string, type: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('type', type);

    // Effectuer la requête POST avec form-data
    return this.http.post<any>(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      map((event) => event),
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`Error occurred: ${error.message}`);
    throw error;
  }
}
