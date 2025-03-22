import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionPlanService } from './planaction.service';
import { Project } from '../liste-p/liste-p.component';

export interface ActionPlan {
  idPlanaction: number;
  projectName: string;
  date: Date;
  thematique: string;
  visuel: string;
  typedeContenu: string;
  caption: string;
  objectif: string;

}

@Component({
  selector: 'app-plan-action',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-action.component.html',
  styleUrls: ['./plan-action.component.scss']
})
export class PlanActionComponent implements OnInit {

  // Déclarations des variables
  actionPlans: ActionPlan[] = [];
  pagedActionPlans: ActionPlan[] = [];
  filteredActionPlans: ActionPlan[] = [];
  newActionPlan: Partial<ActionPlan> = {
    projectName: '',
    date: new Date(),
    thematique: '',
    visuel: '',
    typedeContenu: '',
    caption: '',
    objectif: ''
  };
  selectedActionPlan: ActionPlan | null = null;
  actionPlanToDelete: ActionPlan | null = null;
  
  isActionPlanModalOpen = false;
  isDeleteConfirmationModalOpen = false;
  
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  searchDate: string = '';
  projects: Project[] = [];

  constructor(private actionPlanService: ActionPlanService) {}

  ngOnInit(): void {
    this.loadActionPlans();
    this.fetchProjects();
  }
  fetchProjects(): void {
    this.actionPlanService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects; // Stocke les projets récupérés
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des projets:', err);
      }
    });
  }

  // Fonctions liées à la pagination
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(pageNumber: number): void {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePagedActionPlans();
    }
  }

  updatePagedActionPlans(): void {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    this.pagedActionPlans = this.filteredActionPlans.slice(this.startIndex, this.endIndex);
  }

  // Fonctions de récupération des plans d'action
  loadActionPlans(): void {
    this.actionPlanService.getAllActionPlans().subscribe(
      actionPlans => {
        this.actionPlans = actionPlans;
        console.log(this.actionPlans)
        this.filteredActionPlans = this.actionPlans;
        this.totalItems = this.filteredActionPlans.length;
        this.updatePagedActionPlans();
      },
      error => {
        console.error('Erreur lors de la récupération des plans d\'action', error);
      }
    );
  }

  // Filtrage par date
  filterActionPlansByDate(): void {
    if (this.searchDate) {
      const selectedDate = new Date(this.searchDate);
      this.filteredActionPlans = this.actionPlans.filter(plan => {
        const planDate = new Date(plan.date);
        // Comparaison des dates sans tenir compte des heures
        return planDate.toDateString() === selectedDate.toDateString();
      });
    } else {
      this.filteredActionPlans = this.actionPlans;
    }
    this.totalItems = this.filteredActionPlans.length;
    this.updatePagedActionPlans();
  }
  // Gestion des modales
  openAddActionPlanModal(): void {
    this.selectedActionPlan = null;
    this.newActionPlan = {
      projectName: '',
      date: new Date(),
      thematique: '',
      visuel: '',
      typedeContenu: '',
      caption: '',
      objectif: ''
    };
    this.isAddActionPlanModalOpen = true;
  }

  closeActionPlanModal(): void {
    this.isActionPlanModalOpen = false;
  }
  isEditActionPlanModalOpen = false;
  openEditActionPlanModal(actionPlan: ActionPlan): void {
    this.selectedActionPlan = { ...actionPlan }; // Dupliquer les données du plan d'action sélectionné
    this.isEditActionPlanModalOpen = true; // Afficher le modal d'édition
  }
  isAddActionPlanModalOpen = false;
  // Méthodes de fermeture pour chaque modal
closeAddActionPlanModal(): void {
  this.isAddActionPlanModalOpen = false; // Masquer le modal d'ajout
}

closeEditActionPlanModal(): void {
  this.isEditActionPlanModalOpen = false; // Masquer le modal d'édition
}

  // Méthode pour modifier un plan d'action existant
updateActionPlan(): void {
  if (!this.selectedActionPlan) {
    console.error("Aucun plan d'action sélectionné pour la mise à jour.");
    return;
  }

  this.actionPlanService.updatePlanaction(this.selectedActionPlan.idPlanaction, this.selectedActionPlan).subscribe(updatedPlan => {
    const index = this.actionPlans.findIndex(plan => plan.idPlanaction === updatedPlan.idPlanaction);
    if (index > -1) {
      this.actionPlans[index] = updatedPlan;
    }
    this.filteredActionPlans = this.actionPlans;
    this.totalItems = this.filteredActionPlans.length;
    this.updatePagedActionPlans();
    this.closeEditActionPlanModal();
  });
}
// Méthode pour ajouter un nouveau plan d'action
createActionPlan(): void {
  this.actionPlanService.createActionPlan(this.newActionPlan as ActionPlan).subscribe(newPlan => {
    this.actionPlans.push(newPlan);
    this.filteredActionPlans = this.actionPlans;
    this.totalItems = this.filteredActionPlans.length;
    this.updatePagedActionPlans();
    this.closeAddActionPlanModal();
  });
}

  // Gestion de la suppression d'un plan d'action
  confirmDeleteActionPlan(plan: ActionPlan): void {
    this.isDeleteConfirmationModalOpen = true;
    this.actionPlanToDelete = plan;
  }

  closeDeleteConfirmationModal(): void {
    this.isDeleteConfirmationModalOpen = false;
    this.actionPlanToDelete = null;
  }

  deleteActionPlan(): void {
    if (this.actionPlanToDelete) {
      this.actionPlanService.deleteActionPlan(this.actionPlanToDelete.idPlanaction).subscribe(() => {
        this.actionPlans = this.actionPlans.filter(plan => plan.idPlanaction !== this.actionPlanToDelete?.idPlanaction);
        this.filteredActionPlans = this.actionPlans;
        this.totalItems = this.filteredActionPlans.length;
        this.updatePagedActionPlans();
        this.closeDeleteConfirmationModal();
      });
    }
  }
}