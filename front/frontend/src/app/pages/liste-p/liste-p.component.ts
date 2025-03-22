import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from './projet.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
export interface Project {
  idProjet: number;
  responsable:string;
  nomProjet: string;
  dateCreation: Date;
  dateFin:Date;
  description: string;
}
@Component({
  selector: 'app-liste-p',
  standalone: true,
  imports: [CommonModule,FormsModule, HttpClientModule,RouterModule ],
  providers: [ProjectService],
  templateUrl: './liste-p.component.html',
  styleUrls: ['./liste-p.component.scss']
})

export class ListePComponent implements OnInit {
  projects: Project[] = []; // Liste des projets initialement vide
  newProject: Project = {
    idProjet: 0,
    nomProjet: '',
    responsable:'',
    dateCreation: new Date(),
    dateFin:new Date(),
    description: ''
  };
  selectedProject: any = {}; // Projet sélectionné pour l'édition
  isModalOpen = false; // État d'ouverture du modal
  filteredProjects: Project[] = []; // Projets filtrés
  searchQuery: string = ''; // Requête de recherche
  

  constructor(private projectService: ProjectService,private router: Router) {}
  // Méthode exécutée au démarrage du composant
  ngOnInit(): void {
    this.loadProjects();
  }
  
  // Méthode pour filtrer les projets en fonction de la requête de recherche
  // Update pagedProjects when filtering projects
filterProjects(): void {
  if (this.searchQuery) {
    // Filtrez les projets en fonction de la requête de recherche
    this.filteredProjects = this.projects.filter(project =>
      project.nomProjet.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  } else {
    // Si la requête de recherche est vide, affichez tous les projets
    this.filteredProjects = this.projects;
  }
  this.totalItems = this.filteredProjects.length;
  this.updatePagedProjects();
}
  // Charger les projets depuis le backend
  // Update pagedProjects when loading projects
loadProjects() {
  this.projectService.getProjects().subscribe(
    (data) => {
      this.projects = data;
      this.filteredProjects = data;
      this.totalItems = this.filteredProjects.length;
      this.updatePagedProjects();
      console.log(this.projects)
    },
    (error) => {
      console.error('Erreur lors du chargement des projets', error);
    }
  );
}
  
openEditProjectModal(project: any) {
  this.selectedProject = { 
    ...project,
    dateCreation: this.formatDateForInput(project.dateCreation),
    dateFin: this.formatDateForInput(project.dateFin)
  };
  this.isEditProjectModalOpen = true;
}

// Fonction pour formater la date au format 'YYYY-MM-DD'
formatDateForInput(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2); // Ajoute un zéro pour le format MM
  const day = ('0' + d.getDate()).slice(-2); // Ajoute un zéro pour le format DD
  return `${year}-${month}-${day}`;
}
  // Fermer le modal
  closeModal() {
    this.isModalOpen = false;
  }
  
  isEditProjectModalOpen: boolean = false;
  closeEditProjectModal() {
    this.isEditProjectModalOpen = false;
  }
  isAddProjectModalOpen: boolean = false;
  // Ouvrir le modal pour ajouter un nouveau projet
  openAddProjectModal() {
    this.isAddProjectModalOpen = true;
    this.newProject = {
      idProjet: 0,
      nomProjet: '',
      responsable:'',
      dateCreation: new Date(),
      dateFin:new Date(),
      description: ''
    };
    this.selectedProject = null;
  }
  
  closeAddProjectModal() {
    this.isAddProjectModalOpen = false;
  }
  // Enregistrer un projet (nouveau ou mis à jour)
  // 
  saveProject() {
    this.projectService.createProject(this.newProject).subscribe(
      () => {
        this.loadProjects(); // Recharger les projets après l'ajout
        this.closeAddProjectModal()   // Fermer le modal
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du projet', error);
      }
    );
  }
  editProject() {
    if (this.selectedProject) {
      this.projectService.updateProject(this.selectedProject.idProjet, this.selectedProject).subscribe(
        () => {
          this.loadProjects();
          console.log(this.selectedProject) // Recharger les projets après la mise à jour
          this.closeEditProjectModal()   // Fermer le modal

        },
        (error) => {
          console.error('Erreur lors de la mise à jour du projet', error);
        }
      );
    } else {
      console.error('Aucun projet sélectionné pour la mise à jour');
    }
  }
  // Gestion de la suppression d'un projet
  projectToDelete: Project | null = null;
  isDeleteConfirmationModalOpen: boolean = false;
confirmDeleteProject(project: Project): void {
  this.isDeleteConfirmationModalOpen = true;
  this.projectToDelete = project;
}

closeDeleteConfirmationModal(): void {
  this.isDeleteConfirmationModalOpen = false;
  this.projectToDelete = null;
}

deleteProject(): void {
  if (this.projectToDelete) {
    this.projectService.deleteProject(this.projectToDelete.idProjet).subscribe(
      () => {
        // Mettre à jour la liste des projets après suppression
        this.projects = this.projects.filter(p => p.idProjet !== this.projectToDelete?.idProjet);
        this.filteredProjects = this.projects;
        this.totalItems = this.filteredProjects.length;
        this.updatePagedProjects();
        this.closeDeleteConfirmationModal();
      },
      (error) => {
        console.error('Erreur lors de la suppression du projet', error);
      }
    );
  }
}
  
// Pagination variables
currentPage: number = 1;
itemsPerPage: number = 6;
totalItems: number = 0;
startIndex: number = 0;
endIndex: number = 0;
pagedProjects: Project[] = [];

// Pagination methods
onPageChange(pageNumber: number): void {
  if (pageNumber > 0 && pageNumber <= this.totalPages) {
    this.currentPage = pageNumber;
    this.updatePagedProjects();
  }
}

get totalPages(): number {
  return Math.ceil(this.totalItems / this.itemsPerPage);
}

updatePagedProjects(): void {
  this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
  this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
  this.pagedProjects = this.filteredProjects.slice(this.startIndex, this.endIndex);
}
  
}
