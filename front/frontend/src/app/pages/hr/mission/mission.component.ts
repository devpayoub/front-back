import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../layouts/sidebar/sidebar.component';
import { TopbarComponent } from '../../../layouts/topbar/topbar.component';
import { NGXPagination } from '../../../Component/pagination/pagination.component';
import { EmployeMission } from './employe-mission.model';
import { MissionService } from './Mission.Service';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [
    CommonModule,
    TopbarComponent,
    SidebarComponent,
    FormsModule,
    NGXPagination,
  ],
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})
export class MissionComponent implements OnInit {
  missionList: EmployeMission[] = [];
  displayedMissions: EmployeMission[] = [];
  errorMessage: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  missionsPerPage: number = 3;
  
  isAddModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isDeleteConfirmationModalOpen: boolean = false;

  newMission: EmployeMission = { cin: '', startDate: new Date(), endDate: new Date(), destination: '', employe: { nom: '', id: 0 }, document: { idDoc: 0 } };
  editMissionData: EmployeMission | null = null;

  employees: any[] = [];
  documents: any[] = [];

  selectedEmployeId: number | null = null;
  selectedDocumentId: number | null = null;
  missionToDelete: any;

  constructor(private missionService: MissionService) {}

  ngOnInit(): void {
    this.loadMissions();
    this.loadEmployees();
    this.loadDocuments();
  }

  loadMissions() {
    this.missionService.getMissions().subscribe({
      next: (missions) => {
        this.missionList = missions;
        this.totalPages = Math.ceil(this.missionList.length / this.missionsPerPage);
        this.updateDisplayedMissions();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des missions : ' + error.message;
        this.missionList = [];
      }
    });
  }

  loadEmployees() {
    this.missionService.getEmployes().subscribe({
      next: (employes) => this.employees = employes,
      error: (error) => this.errorMessage = 'Erreur lors du chargement des employés : ' + error.message
    });
  }

  loadDocuments() {
    this.missionService.getDocuments().subscribe({
      next: (documents) => this.documents = documents,
      error: (error) => this.errorMessage = 'Erreur lors du chargement des documents : ' + error.message
    });
  }

  updateDisplayedMissions() {
    const startIndex = (this.currentPage - 1) * this.missionsPerPage;
    const endIndex = startIndex + this.missionsPerPage;
    this.displayedMissions = this.missionList.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedMissions();
  }

  openAddMissionModal() {
    this.isAddModalOpen = true;
    this.resetNewMission();
  }

  closeAddMissionModal() {
    this.isAddModalOpen = false;
  }

  resetNewMission() {
    this.newMission = { cin: '', startDate: new Date(), endDate: new Date(), destination: '', employe: { nom: '', id: 0 }, document: { idDoc: 0 } };
    this.selectedEmployeId = null;
    this.selectedDocumentId = null;
  }

 
  addMission() {
    // Assigner les ID d'employé et de document à la nouvelle mission
    if (this.selectedEmployeId && this.selectedDocumentId) {
      this.newMission.employe = { id: this.selectedEmployeId, nom: '' }; // Nom est optionnel ici
      this.newMission.document = { idDoc: this.selectedDocumentId };

      this.missionService.addMission(this.newMission).subscribe({
        next: () => {
          this.loadMissions();
          this.closeAddMissionModal();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de l\'ajout de la mission : ' + error.message;
        }
      });
    }
  }
  openEditModal(mission: EmployeMission) {
    this.editMissionData = { ...mission };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editMissionData = null; // Reset edit data when closing modal
  }
editMission(): void {
    if (this.editMissionData) {
      this.missionService.updateMission(this.editMissionData).subscribe({
        next: () => {
          this.loadMissions();
          this.closeEditModal();
        },
        error: () => {
          this.errorMessage = "Erreur lors de la modification de la mission";
        }
      });
    }
  }


  openDeleteConfirmationModal(mission: EmployeMission) {
    this.missionToDelete = mission; // Store the mission to delete
    this.isDeleteConfirmationModalOpen = true;
  }

  closeDeleteConfirmationModal() {
    this.isDeleteConfirmationModalOpen = false;
    this.missionToDelete = undefined; // Clear the mission to delete
  }
  deleteMission() {
    if (this.missionToDelete) {
      console.log('Suppression en cours...');
      this.missionService.deleteMission(this.missionToDelete.id).subscribe({
        next: () => {
          console.log('Mission supprimée avec succès');
          this.loadMissions(); // Recharge la liste après la suppression
          this.closeDeleteConfirmationModal(); // Ferme la modal
        },
        error: (error) => {
          console.error('Erreur lors de la suppression :', error);
        }
      });
    }
  }
  
}
