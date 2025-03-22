import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Departement } from './departement.model';
import { DepartementService } from './DepartementService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department',
  standalone: true,
  templateUrl: './department.component.html',
  styleUrls: ['./Departement.component.scss'],
  providers: [],
  imports: [CommonModule, FormsModule]
})
export class DepartmentComponent implements OnInit {
  public isAddModalOpen: boolean = false;
  public isEditModalOpen: boolean = false;
  public isDeleteConfirmationModalOpen: boolean = false;
  department: { id?: number; name: string; } = { name: '' }; // Définition de l'objet department
  public selectedDepartment: Departement = { id: 0, nom: '', headOfDepName: '', email: '', nbEmployes: 0 };
  public departmentList: Departement[] = [];
  public alldepartmentList: Departement[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 6;
  public totalItems: number = 0;
  public totalPages: number = 0;
  public errorMessage: string | null = null;
departement: any;

  constructor(private departementService: DepartementService) {}

  ngOnInit(): void {
    this.loadDepartements();
  }

  loadDepartements(): void {
    this.departementService.getAllDepartements().subscribe(
      data => {
        this.alldepartmentList = data;
        this.totalItems = this.alldepartmentList.length;
        this.updatePagedOrders();
      },
      error => {
        this.errorMessage = 'Erreur lors de la récupération des départements';
        console.error('Error fetching department data:', error);
      }
    );
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
    // Initialize a new department object
    this.selectedDepartment = { id: 0, nom: '', headOfDepName: '', email: '', nbEmployes: 0 };
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  openEditModal(department: Departement): void {
    // Copy the object for editing
    this.selectedDepartment = { ...department };
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  onSubmit(): void {
    if (this.selectedDepartment.id) {
      // Update department only if the id is defined
      this.departementService.updateDepartment(this.selectedDepartment.id, this.selectedDepartment).subscribe(
        response => {
          console.log('Department updated successfully:', response);
          this.loadDepartements();
          this.closeEditModal();
        },
        error => {
          console.error('Error updating department:', error);
          this.errorMessage = 'Erreur lors de la mise à jour du département';
        }
      );
    } else {
      // Add new department
      this.departementService.addDepartement(this.selectedDepartment).subscribe(
        response => {
          console.log('Department added successfully:', response);
          this.loadDepartements();
          this.closeAddModal();
        },
        error => {
          console.error('Error adding department:', error);
          this.errorMessage = 'Erreur lors de l\'ajout du département';
        }
      );
    }
  }
  openDeleteConfirmationModal(department: Departement): void {
    this.selectedDepartment = { ...department }; // Assurez-vous que selectedDepartment est correctement assigné
    this.isDeleteConfirmationModalOpen = true;
  }
  

  closeDeleteConfirmationModal(): void {
    this.isDeleteConfirmationModalOpen = false;
  }

  
  onDeleteDepartement(id: number | undefined): void {
    if (id !== undefined) {
      this.departementService.deleteDepartment(id).subscribe({
        next: () => {
          console.log('Département supprimé avec succès');
          this.loadDepartements();
          this.closeDeleteConfirmationModal();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du département', err);
          this.errorMessage = 'Erreur lors de la suppression du département';
        }
      });
    } else {
      console.error('Erreur : l\'ID du département est indéfini');
    }
  }
  
  
  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return; // Validate page number
    this.currentPage = page;
    this.updatePagedOrders();
  }

  private updatePagedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.departmentList = this.alldepartmentList.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }
  handleDepartment(): void {
    if (this.department.id !== undefined) {
      this.someMethod(this.department.id); // Si id est défini, passez-le
    } else {
      console.error('Department ID is undefined'); // Gérer l'absence d'id
    }
  }
  someMethod(departmentId: number): void {
    // Exemple de méthode qui utilise l'ID du département
    console.log('Department ID:', departmentId);
  }
  
}
