import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContratService } from './ContratService';
import { Contrat } from './Contrat.model'; // Modèle des contrats
import { TopbarComponent } from '../../../layouts/topbar/topbar.component'; // Vérifiez que le chemin est correct
import { SidebarComponent } from '../../../layouts/sidebar/sidebar.component'; // Vérifiez que le chemin est correct

@Component({
  selector: 'app-contrats',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TopbarComponent, // Assurez-vous que ces composants sont correctement importés
    SidebarComponent,
  ],
  templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ContratComponent implements OnInit {
  departmentList: Contrat[] = [];
  isAddModalOpen = false;
  isEditModalOpen = false;
  isDeleteConfirmationModalOpen = false;
  currentPage = 1;
  totalPages = 3;
  errorMessage: string | null = null;
  selectedContrat: Contrat | null = null;

  // Modèle pour le nouveau contrat
  newContract = { type: '' };

  constructor(private contratService: ContratService) {}

  ngOnInit(): void {
    this.loadContrats();
  }

  loadContrats(): void {
    this.contratService.getAllContrats().subscribe(
      (response: Contrat[]) => {
        this.departmentList = response;
      },
      error => {
        console.error('Erreur lors du chargement des contrats:', error);
        this.errorMessage = 'Erreur de chargement des contrats. Détails: ' + error.message;
      }
    );
  }


  openAddModal(): void {
    console.log('Ouverture du modal d\'ajout');
    this.isAddModalOpen = true;
  }
  
  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

 
  openEditModal(contrat: any) {
    this.isEditModalOpen = true;
    this.newContract = { ...contrat }; // Créez une copie du contrat sélectionné
  }
  
  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedContrat = null;
  }

  openDeleteConfirmationModal(contrat: Contrat): void {
    this.selectedContrat = contrat;
    this.isDeleteConfirmationModalOpen = true;
  }

  onAddContract(): void {
    const newContrat: Contrat = { type: this.newContract.type };
    this.contratService.addContrat(newContrat).subscribe(() => {
      this.loadContrats();
      this.closeAddModal();
    });
  }

  onSubmit(): void {
    if (this.newContract) {
      // Appeler l'API pour mettre à jour le contrat
      this.contratService.updateContrat(this.newContract).subscribe(
        (response) => {
          // Recharger les contrats après la mise à jour
          this.loadContrats();
          this.closeEditModal();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du contrat:', error);
          this.errorMessage = 'Erreur lors de la mise à jour du contrat. Détails: ' + error.message;
        }
      );
    }
  }
  

  confirmDelete(): void {
    if (this.selectedContrat) {
      this.contratService.deleteContrat(this.selectedContrat.id!).subscribe(() => {
        this.loadContrats();
        this.isDeleteConfirmationModalOpen = false;
        this.selectedContrat = null;
      });
    }
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadContrats();
    }
  }
}