import { Component, inject } from '@angular/core';
import { Departement, Employes, Poste } from './employes.model';
import { EmployeeService } from './employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class EmployeeComponent {

  employes: Employes[] = [];
  allemployee: Employes[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  errorMessage: string | null = null;
  totalPages: number = 1;
  departements: Departement[] = [];
  postes: Poste[] = [];
  isModalOpen = false;
  showEditModal: boolean = false; // Pour le modal de modification
    newEmployee: Employes = {
    id: undefined,
    prenom: '',
    nom: '',
    email: '',
    cin: 0,
    phone: '',
    location: '',
    departement: { id: 0, nom: '' }, 
    poste: { id: 0, nom: '' }, 
    joiningDate: new Date(),
  };
  employeeIdToDelete: number | undefined;

  showDeleteModal: boolean = false;
selectedEmployeeForDelete: any = null;
  private employeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.getEmployees();
    this.getDepartements();
    this.getPostes();
  }

  showModal: boolean = false;

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
  
 
  openEditModal(employee: Employes): void {
    this.newEmployee = { ...employee };
    // Assurez-vous que les valeurs de département et poste sont bien assignées
    this.newEmployee.departement = employee.departement ? { ...employee.departement } : { id: 0, nom: '' };
    this.newEmployee.poste = employee.poste ? { ...employee.poste } : { id: 0, nom: '' };
  
    // Assurez-vous que la date d'entrée est bien formatée
    this.newEmployee.joiningDate = new Date(employee.joiningDate);
  
    console.log('Données de l\'employé à modifier:', this.newEmployee); // Debugging
    this.showEditModal = true; // Montre la modal de modification
  }

  
  
  closeEditModal(): void {
    this.showEditModal = false; // Ferme la modal de modification
    this.newEmployee = { // Réinitialise les données de l'employé
      id: undefined,
      prenom: '',
      nom: '',
      email: '',
      cin: 0,
      phone: '',
      location: '',
      departement: { id: 0, nom: '' }, 
      poste: { id: 0, nom: '' }, 
      joiningDate: new Date(),
    };
  }
  getDepartements(): void {
    this.employeeService.getDepartements().subscribe(
      (data) => {
        this.departements = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des départements', error);
      }
    );
  }

  getPostes(): void {
    this.employeeService.getPostes().subscribe(
      (data) => {
        this.postes = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des postes', error);
      }
    );
  }

  createEmployee(): void {
    // Vérifier si le CIN est valide (conversion en chaîne)
    if (!this.isValidCin(this.newEmployee.cin.toString())) {
      this.errorMessage = 'Le CIN doit comporter exactement 8 chiffres.';
      return;
    }
  
    // Appeler le service pour ajouter l'employé
    this.employeeService.addEmployee(this.newEmployee).subscribe(
      () => {
        // Rafraîchir la liste des employés et fermer le modal après ajout réussi
        this.getEmployees();
        this.closeModal();

      },
      (error) => {
        // Gestion d'erreur et message d'erreur affiché à l'utilisateur
        console.error('Erreur lors de l\'ajout de l\'employé', error);
        this.errorMessage = 'Une erreur est survenue lors de l\'ajout de l\'employé.';
      }
    );
  }
  

  isCinValid(): boolean {
    // Convertir cin en chaîne et vérifier la validité
    return this.isValidCin(this.newEmployee.cin.toString());
  }
  
  getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data) => {
        this.allemployee = data.map(emp => ({
          ...emp,
          joiningDate: new Date(emp.joiningDate)
        }));
        this.totalItems = this.allemployee.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePagedOrders();
      },
      (error) => {
        this.errorMessage = "Erreur lors de la récupération des employés";
        console.error(error);
      }
    );
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updatePagedOrders();
  }

  updatePagedOrders(): void {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
    this.employes = this.allemployee.slice(this.startIndex, this.endIndex);
  }
  updateEmployee(): void {
    console.log(this.newEmployee); // Vérifiez les valeurs ici
    if (this.isValidCin(this.newEmployee.cin.toString())) {
      this.employeeService.updateEmployee(this.newEmployee.id!, this.newEmployee).subscribe({
        next: () => {
          this.getEmployees(); 
          this.closeEditModal(); 
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de l\'employé', error);
          this.errorMessage = 'Erreur lors de la mise à jour de l\'employé. Veuillez réessayer plus tard.';
        }
      });
    }
  }

  

  isValidCin(cin: string): boolean {
    return /^\d{8}$/.test(cin);
  }
// Ouvrir la modal de suppression
openDeleteModal(employeeId: number | undefined): void {
  if (employeeId !== undefined) {
    this.employeeIdToDelete = employeeId; // Stockez l'ID de l'employé à supprimer
    this.showDeleteModal = true; // Affichez le modal de confirmation
  } else {
    console.error('Erreur : l\'ID de l\'employé est indéfini');
  }
}


// Fermer la modal de suppression
closeDeleteModal() {
  this.showDeleteModal = false;
}


// Méthode pour confirmer la suppression
confirmDeleteEmployee(): void {
  if (this.employeeIdToDelete) {
    this.deleteEmployee(this.employeeIdToDelete);
    this.showDeleteModal = false;
  } else {
    console.error('Erreur : l\'ID est manquant pour la suppression');
  }
}
deleteEmployee(employeeId: number): void {
  this.employeeService.deleteEmployee(employeeId).subscribe({
    next: () => {
      // Si la suppression est réussie, rafraîchir la liste des employés
      console.log(`Employé avec l'ID ${employeeId} supprimé.`);
      this.getEmployees(); // Met à jour la liste des employés
      this.closeDeleteModal(); // Fermer la modal de confirmation
    },
    error: (error) => {
      console.error('Erreur lors de la suppression de l\'employé', error);
      this.errorMessage = 'Erreur lors de la suppression de l\'employé. Veuillez réessayer plus tard.';
    }
  });
}



}
