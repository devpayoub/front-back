import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageTitleComponent } from '../../../../shared/page-title/page-title.component';
import { CountUpModule } from 'ngx-countup';
import { Store } from '@ngrx/store';
import { fetchemployeeLeaveData } from '../../../../store/HR/hr-action';
import { selectDataLoading, selectEmployeeLeave } from '../../../../store/HR/hr-selector';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { NGXPagination } from '../../../../Component/pagination';

import { Absence, Employe } from './leave-employee.modal';
import { FormsModule } from '@angular/forms';
import { AbsenceService } from './leave-employee.Service';

@Component({
  selector: 'app-leave-employee',
  standalone: true,
  imports: [
    CommonModule, 
    PageTitleComponent, 
    CountUpModule, 
    NgxDatatableModule, 
    LucideAngularModule, 
    NGXPagination, 
    RouterModule,
    FormsModule
  ],
  templateUrl: './leave-employee.component.html',
  styleUrls: ['./leave-employee.component.scss'],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
})
export class LeaveEmployeeComponent {
onPageChange(arg0: number) {
throw new Error('Method not implemented.');
}
  absences: Absence[] = [];
  employes: Employe[] = [];
  errorMessage: string = '';
  isModalOpen = false;
  isEditModalOpen = false; // Ajout de l'état pour la modal de modification
  newAbsence: Absence = {
    id: 0, // ID par défaut
    employe: { id: 0, nom: '' }, // Objet Employe par défaut
    dateAbsence: new Date(),
    motif: '',
    cin: 0,
  };
  cinError: boolean | undefined;
  currentPage: any;
  totalPages: any;
  isConfirmDeleteModalOpen = false; // État pour le modal de confirmation
  absenceToDeleteId: number | null = null; // ID de l'absence à supprimer
  constructor(private absenceService: AbsenceService) {
    this.getAbsences();
    this.getEmployes();
  }

  openAddModal() {
    this.newAbsence = { id: 0, employe: { id: 0, nom: '' }, dateAbsence: new Date(), motif: '', cin: 0 };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.errorMessage = ''; // Réinitialisation du message d'erreur
  }

  addAbsence() {
    this.absenceService.addAbsence(this.newAbsence).subscribe({
      next: (response) => {
        this.absences.push(response);
        this.closeModal();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'ajout de l\'absence: ' + error.message;
      }
    });
  }

  // Fonction pour valider le format du CIN
  validateCin() {
    this.cinError = this.newAbsence.cin.toString().length !== 8;
  }

  getAbsences() {
    this.absenceService.getAbsences().subscribe({
      next: (response) => {
        this.absences = response;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des absences: ' + error.message;
      }
    });
  }

  getEmployes() {
    this.absenceService.getEmployes().subscribe({
      next: (response) => {
        this.employes = response;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des employés: ' + error.message;
      }
    });
  }

  // deleteAbsence(id: number) {
  //   if (confirm('Êtes-vous sûr de vouloir supprimer cette absence?')) {
  //     this.absenceService.deleteAbsence(id).subscribe({
  //       next: () => {
  //         this.absences = this.absences.filter(absence => absence.id !== id);
  //       },
  //       error: (error) => {
  //         this.errorMessage = 'Erreur lors de la suppression de l\'absence: ' + error.message;
  //       }
  //     });
  //   }
  // }

  openEditModal(absence: Absence) {
    this.newAbsence = { ...absence }; // Cloner l'absence à modifier
    this.isEditModalOpen = true; // Ouvrir la modal d'édition
}

  closeEditModal() {
    this.isEditModalOpen = false;
    this.errorMessage = ''; // Réinitialisation du message d'erreur
  }

  updateAbsence() {
    this.absenceService.updateAbsence(this.newAbsence.id, this.newAbsence).subscribe({
      next: (response) => {
        const index = this.absences.findIndex(abs => abs.id === response.id);
        if (index !== -1) {
          this.absences[index] = response; // Mettre à jour l'absence dans le tableau
        }
        this.closeEditModal(); // Fermer la modal après la mise à jour
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour de l\'absence: ' + error.message; // Gestion des erreurs
      }
    });
}
deleteAbsence(id: number) {
  this.absenceToDeleteId = id; // Stocker l'ID de l'absence à supprimer
  this.isConfirmDeleteModalOpen = true; // Ouvrir le modal de confirmation
}

closeConfirmDeleteModal() {
  this.isConfirmDeleteModalOpen = false; // Fermer le modal de confirmation
  this.absenceToDeleteId = null; // Réinitialiser l'ID
}

confirmDelete() {
  if (this.absenceToDeleteId !== null) {
    this.absenceService.deleteAbsence(this.absenceToDeleteId).subscribe({
      next: () => {
        this.absences = this.absences.filter(absence => absence.id !== this.absenceToDeleteId);
        this.closeConfirmDeleteModal(); // Fermer le modal après la suppression
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la suppression de l\'absence: ' + error.message;
        this.closeConfirmDeleteModal(); // Fermer le modal en cas d'erreur
      }
    });
  }
}
}