import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PageTitleComponent } from '../../../../shared/page-title/page-title.component';
import { fetchHRLeaveData } from '../../../../store/HR/hr-action';
import { selectDataLoading, selectHRLeave } from '../../../../store/HR/hr-selector';
import { Store } from '@ngrx/store';
import { CountUpModule } from 'ngx-countup';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { MDModalModule } from '../../../../Component/modals';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { NGXPagination } from '../../../../Component/pagination';
import { DocumentService } from './leave.component.service';
import { Document } from './leave.component.modal';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, CountUpModule, NgxDatatableModule, MDModalModule, LucideAngularModule, NGXPagination],
  templateUrl: './leave.component.html',
   styleUrls: ['./leave.component.scss'],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
})
export class LeaveComponent implements OnInit {
  errorMessage: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  documents: Document[] = [];
  isModalOpen: boolean = false;
  totalPages = 5;
  selectedFile: File | null = null;

  private store = inject(Store);
  private documentService = inject(DocumentService);

  ngOnInit(): void {
    this.fetchDocuments();
  }

  openAddModal() {
    this.isModalOpen = true;
  }

  closeModal(event?: MouseEvent) {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.matches('.modal')) {
        this.isModalOpen = false;
      }
    } else {
      this.isModalOpen = false;
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  fetchDocuments(): void {
    this.documentService.getAllDocuments().subscribe({
      next: (data: any) => {
        console.log('Données reçues de l\'API :', data);
        
        if (Array.isArray(data) && data.every(this.isValidDocument)) {
          this.documents = data;
          this.totalItems = this.documents.length;
          this.updatePagedOrders();
          console.log('Documents validés:', this.documents); // Ajoutez cette ligne pour voir les documents
        } else {
          console.error('Données invalides reçues', data);
        }
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des documents';
        console.error(error);
      }
    });
  }
  
  private isValidDocument(item: any): item is Document {
    return item && typeof item.id === 'number' && typeof item.title === 'string';
  }
  

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updatePagedOrders();
  }

  updatePagedOrders(): void {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
    this.documents = this.documents.slice(this.startIndex, this.endIndex);
  }

 


}