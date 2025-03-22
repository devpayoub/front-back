import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importez CommonModule pour les fonctionnalités Angular de base
import { HttpClientModule } from '@angular/common/http'; // Importez HttpClientModule pour les requêtes HTTP
import { TopbarComponent } from "../../../layouts/topbar/topbar.component";
import { SidebarComponent } from "../../../layouts/sidebar/sidebar.component";
import { DocumentService, Document } from './documents.component.service';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms'; // Importez FormsModule pour les formulaires

@Component({
  selector: 'app-documents',
  standalone: true,
imports: [CommonModule, HttpClientModule, FormsModule, TopbarComponent, SidebarComponent],

  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'] 
})
export class DocumentComponent implements OnInit {

  displayedDocuments: Document[] = []; // Nouvelle propriété pour stocker les documents affichés
  errorMessage: any;
  documents: Document[] = [];
  selectedFile: File | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 4; // Nombre d'éléments par page
  documentToDelete: Document | null = null;
  isDeleteModalOpen: boolean = false;
  
  isModalOpen: boolean = false; // <-- Variable pour contrôler l'affichage de la modal
  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    console.log("Document component initialized"); // Debug log
    this.getAllDocuments();
  }
  // Ouvrir la modal de suppression
openDeleteModal(document: Document) {
  this.documentToDelete = document;
  this.isDeleteModalOpen = true; // Variable pour contrôler l'affichage de la modal de suppression
}

// Fermer la modal de suppression
closeDeleteModal() {
  this.documentToDelete = null;
  this.isDeleteModalOpen = false;
}
 // Ouvrir la modal
 openModal() {
  this.isModalOpen = true;
}

closeModal() {
  this.isModalOpen = false;
}
// Get all documents
getAllDocuments(): void {
  this.documentService.getAllDocuments().subscribe({
    next: (data) => {
      this.documents = data;
      this.calculateTotalPages(); // Calculer le nombre total de pages
      this.updateDisplayedDocuments(); // Mettre à jour les documents affichés
    },
    error: (err) => {
      console.error('Failed to fetch documents', err);
      this.errorMessage = 'Failed to load documents. Please try again later.';
    }
  });
}

  // Handle file selection
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log('File selected:', this.selectedFile); // Vérifier si le fichier est bien sélectionné
  }
  uploadDocument(event: Event): void {
    event.preventDefault(); // Empêche le rechargement de la page
  
    if (this.selectedFile) {
      console.log('Selected file:', this.selectedFile);
      this.documentService.uploadDocument(this.selectedFile).subscribe({
        next: (document) => {
          console.log("Uploaded document successfully:", document);
          this.documents.push(document);
          this.selectedFile = null;
          this.closeModal();
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.errorMessage = 'Échec du téléchargement du document. Veuillez réessayer.';
        }
      });
    } else {
      this.errorMessage = 'Veuillez sélectionner un fichier avant de soumettre.';
    }
  }
  
// Calculer le nombre total de pages
calculateTotalPages(): void {
  this.totalPages = Math.ceil(this.documents.length / this.itemsPerPage);
}

// Met à jour les documents affichés en fonction de la page actuelle
updateDisplayedDocuments(): void {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.displayedDocuments = this.documents.slice(startIndex, endIndex);
}

// Change pagination page
onPageChange(newPage: number): void {
  if (newPage >= 1 && newPage <= this.totalPages) {
    this.currentPage = newPage;
    this.updateDisplayedDocuments();
  }
}
// Confirmer la suppression
confirmDelete() {
  if (this.documentToDelete) {
    this.documentService.deleteDocument(this.documentToDelete.idDoc).subscribe({
      next: () => {
        console.log('Document deleted successfully');
        // Supprimer le document de la liste et mettre à jour l'affichage
        this.documents = this.documents.filter(d => d.idDoc !== this.documentToDelete!.idDoc);
        this.updateDisplayedDocuments();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Failed to delete document', err);
        this.errorMessage = 'Échec de la suppression du document.';
      }
    });
  }
}
}