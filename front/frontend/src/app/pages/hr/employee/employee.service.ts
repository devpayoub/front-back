import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departement, Employes, Poste } from './employes.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
 
  private apiUrl = 'http://localhost:8084/RH/api/Employes'; 
  private departementUrl = 'http://localhost:8084/RH/api/Dep'; 
  private posteUrl = 'http://localhost:8084/RH/api/Poste';
  constructor(private http: HttpClient) {}

  
  getDepartements(): Observable<Departement[]> {
    return this.http.get<Departement[]>(`${this.departementUrl}`);
  }
  
  getPostes(): Observable<Poste[]> {
    return this.http.get<Poste[]>(`${this.posteUrl}`);
  }
  

  getEmployees(): Observable<Employes[]> {
    return this.http.get<Employes[]>(`${this.apiUrl}`);
  }
  
  addEmployee(employee: Employes): Observable<Employes> {
    return this.http.post<Employes>(`${this.apiUrl}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
   // Update employee
   updateEmployee(id: number, employee: Employes): Observable<Employes> {
    return this.http.put<Employes>(`${this.apiUrl}/${id}`, employee);
  }
}