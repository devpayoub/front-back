import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Departement } from './departement.model';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private baseUrl = 'http://localhost:8084/RH/api/Dep';

  constructor(private http: HttpClient) {}


  // Ajout d'un nouveau département
  addDepartement(departement: Departement): Observable<Departement> {
    return this.http.post<Departement>(this.baseUrl, departement);
  }

  // Suppression d'un département
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAllDepartements(): Observable<Departement[]> {
    return this.http.get<Departement[]>(this.baseUrl).pipe(
      tap((data: any) => console.log('Departments fetched:', data)) 
    );
  }
// Méthode pour mettre à jour un département
  updateDepartment(id: number, department: Departement): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}`, department);
}
  
}