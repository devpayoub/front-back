import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemandeConges } from './holidays.modal';
import { DemandeCongeService } from './holiday.Service';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './holidays.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidaysComponent {
  closeDeleteModal() {
    throw new Error('Method not implemented.');
  }
  isAddModalOpen = false;
  isEditModalOpen = false; // Contrôle du modal de modification
  holidays: DemandeConges[] = [];
  displayedHolidays: DemandeConges[] = [];
  currentPage = 1;
  totalPages = 1;
  holidaysPerPage = 5;
  errorMessage = '';
  employes: any[] = [];
  cinError: boolean = false;
  selectedHoliday!: DemandeConges; // Congé sélectionné pour la modification
  isDeleteModalOpen = false;
  holidayToDelete: any = null;
  public isDeleteConfirmationModalOpen: boolean = false;

  // Initialisation des champs avec employé par défaut
  newHoliday: DemandeConges = {
    id: 0, // Assurez-vous que l'ID est inclus ici
    employe: { id: 0, nom: '' }, // Remplacez cela par la structure correcte de votre modèle employé
    dateDebut: new Date(),
    dateFin: new Date(),
    motif: '',
    typeConge: '',
    cin: '',
    statut: ''
  };

  constructor(private demandeCongeService: DemandeCongeService) { }

  ngOnInit(): void {
    this.loadHolidays(); // Chargement des congés
    this.loadEmployes();  // Chargement des employés
  }

  // Méthode de validation du CIN
  validateCin() {
    const cinRegex = /^[0-9]{8}$/; // Exige exactement 8 chiffres
    this.cinError = !cinRegex.test(this.newHoliday.cin);
  }
  validateDates(): boolean {
    if (this.newHoliday.dateDebut && this.newHoliday.dateFin) {
      return new Date(this.newHoliday.dateDebut) <= new Date(this.newHoliday.dateFin);
    }
    return false;
  }
  resetNewHoliday(): void {
    this.newHoliday = {
      id: 0,
      employe: { id: 0, nom: '' },
      dateDebut: new Date(),
      dateFin: new Date(),
      motif: '',
      typeConge: '',
      cin: '',
      statut: ''
    };
  }
  openEditModal(holiday: DemandeConges) {
    this.selectedHoliday = { ...holiday }; // Assurez-vous que l'objet est correctement copié
    this.isEditModalOpen = true;
  }

  // Charger tous les employés
  loadEmployes(): void {
    this.demandeCongeService.getAllEmployes().subscribe({
      next: (data) => {
        this.employes = data; // Stocker les employés récupérés
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des employés';
      }
    });
  }

  // Charger toutes les demandes de congé
  loadHolidays(): void {
    this.demandeCongeService.getAllDemandeConges().subscribe({
      next: (data) => {
        this.holidays = data;
        this.totalPages = Math.ceil(this.holidays.length / this.holidaysPerPage);
        this.updateDisplayedHolidays();
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des congés';
      }
    });
  }

  // Mettre à jour la liste affichée des congés en fonction de la page courante
  updateDisplayedHolidays(): void {
    const startIndex = (this.currentPage - 1) * this.holidaysPerPage;
    const endIndex = startIndex + this.holidaysPerPage;
    this.displayedHolidays = this.holidays.slice(startIndex, endIndex);
  }

  // Ouvrir le formulaire pour ajouter un nouveau congé
  openAddModal(): void {
    this.isAddModalOpen = !this.isAddModalOpen;

    this.newHoliday = {
      id: 0, // Valeur par défaut pour l'ID
      employe: { id: 0, nom: '' }, // Valeur par défaut pour employé
      dateDebut: new Date(),
      dateFin: new Date(),
      motif: '',
      typeConge: '',
      cin: '',
      statut: ''
    };
  }

  // Enregistrer les données via l'API
  saveHoliday() {
    this.demandeCongeService.createDemandeConge(this.newHoliday).subscribe({
      next: (response) => {
        console.log('Demande de congé ajoutée avec succès', response);
        this.loadHolidays(); // Recharger la liste des congés après l'ajout
        this.isAddModalOpen = false; // Fermer la modal après l'enregistrement
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de la demande de congé', error);
        this.errorMessage = 'Erreur lors de l\'ajout de la demande de congé';
      }
    });
  }

  // Méthode pour éditer un congé
  editHoliday(holiday: DemandeConges): void {
    this.selectedHoliday = { ...holiday }; // Cloner l'objet
    this.isEditModalOpen = true; // Ouvrir le modal de modification
  }

  // Fermer le modal de modification
  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  // Mettre à jour le congé
  updateHoliday(): void {
    if (!this.selectedHoliday) {
        console.error('Aucun congé sélectionné pour la mise à jour.');
        return;
    }
    console.log('Mise à jour du congé:', this.selectedHoliday); // Pour déboguer
    
    const id = this.selectedHoliday.id; // Assurez-vous que c'est un nombre
    this.demandeCongeService.updateDemandeConge(id, this.selectedHoliday).subscribe({
        next: (response) => {
            console.log('Demande de congé mise à jour avec succès', response);
            this.loadHolidays(); // Recharger la liste des congés après la mise à jour
            this.closeEditModal(); // Fermer le modal après la mise à jour
        },
        error: (error) => {
            console.error('Erreur lors de la mise à jour de la demande de congé', error);
            this.errorMessage = 'Erreur lors de la mise à jour de la demande de congé';
        }
    });
}

  // Changer de page
  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedHolidays();
    }
  }

  // Méthode pour supprimer un congé (à implémenter)

  // Supprimer un congé
  deleteHoliday(holiday: DemandeConges): void {
    this.holidayToDelete = holiday;
    this.isDeleteConfirmationModalOpen = true; // Ouvrir la confirmation
  }

  // Confirmer la suppression
  confirmDeleteHoliday(): void {
    this.demandeCongeService.deleteDemandeConge(this.holidayToDelete.id).subscribe({
      next: () => {
        this.loadHolidays(); // Recharger les congés après suppression
        this.closeDeleteConfirmationModal();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression du congé';
      }
    });
  }

  // Fermer la confirmation de suppression
  closeDeleteConfirmationModal(): void {
    this.isDeleteConfirmationModalOpen = false;
  }

}
