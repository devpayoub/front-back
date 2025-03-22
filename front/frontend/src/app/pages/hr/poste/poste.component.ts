import { Component, OnInit } from '@angular/core';
import { TopbarComponent } from "../../../layouts/topbar/topbar.component";
import { SidebarComponent } from "../../../layouts/sidebar/sidebar.component";
import { PosteService } from './PosteService';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { NGXPagination } from "../../../Component/pagination/pagination.component";

@Component({
  selector: 'app-poste',
  standalone: true,
  imports: [
    CommonModule, 
    TopbarComponent, 
    SidebarComponent, 
    FormsModule, 
    NGXPagination, 
  ],
  templateUrl: './poste.component.html',
  styleUrls: ['./poste.component.scss']
})
export class PosteComponent implements OnInit {
  postIdToDelete: any;
  postes: any[] = [];
  currentPage: number = 1; 
  itemsPerPage: number = 5; 
  totalItems: number = 0; 
  totalPages: number = 0; 
  maxVisiblePages: number = 6; 
  visiblePages: number[] = []; 
  isPostModalOpen = false;
  selectedPost: any;
  currentPost: any = { nom: '' };  
  isDeleteConfirmationModalOpen = false;  
  errorMessage: string = '';  // Propriété pour le message d'erreur

  constructor(private posteService: PosteService) { }

  ngOnInit(): void {
    this.loadPostes();
  }

  loadPostes(): void {
    this.posteService.getPostes().subscribe(
      (data) => {
        this.postes = data.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
        this.totalItems = data.length; 
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); 
        this.updateVisiblePages(); 
      },
      (error) => {
        console.error('Erreur lors de la récupération des postes', error);
      }
    );
  }

  updateVisiblePages(): void {
    const startPage = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + this.maxVisiblePages - 1);

    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateVisiblePages(); 
      this.loadPostes(); 
    }
  }

  openPostModal(poste?: any): void {
    this.isPostModalOpen = true;
    this.selectedPost = poste ? poste : null;
    this.currentPost = poste ? { ...poste } : { nom: '' };  
    this.errorMessage = '';  // Réinitialiser le message d'erreur
  }

  closePostModal(): void {
    this.isPostModalOpen = false;
    this.currentPost = { nom: '' };  
    this.errorMessage = '';  // Réinitialiser le message d'erreur
  }

  savePoste(): void {
    if (!this.currentPost.nom) {
      this.errorMessage = 'Veuillez remplir le champ "Nom du Poste".';  // Définir le message d'erreur
      return;
    }

    if (this.selectedPost) {
      this.posteService.editPoste(this.selectedPost.id, this.currentPost).subscribe(
        (updatedPoste) => {
          const index = this.postes.findIndex(p => p.id === this.selectedPost.id);
          if (index !== -1) {
            this.postes[index] = updatedPoste;
          }
          this.closePostModal();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du poste', error);
        }
      );
    } else {
      this.posteService.createPoste(this.currentPost).subscribe(
        (newPoste) => {
          this.postes.push(newPoste);
          this.closePostModal();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du poste', error);
        }
      );
    }
  }

  openDeleteConfirmationModal(poste: any): void {
    this.isDeleteConfirmationModalOpen = true;
    this.postIdToDelete = poste.id;  
  }

  deletePoste(): void {
    if (this.postIdToDelete) {
      this.posteService.deletePoste(this.postIdToDelete).subscribe(() => {
        this.postes = this.postes.filter(p => p.id !== this.postIdToDelete);  
        this.closeDeleteConfirmationModal();
      },
      (error) => {
        console.error('Erreur lors de la suppression du poste', error);
      });
    }
  }

  closeDeleteConfirmationModal(): void {
    this.isDeleteConfirmationModalOpen = false;
    this.postIdToDelete = null;  
  }
}
