import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { ListeTacheService } from './listetache.service'; // Importer le service et les interfaces
import { Project } from '../pages/liste-p/liste-p.component';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../pages/liste-p/projet.service';
import { TopbarComponent } from '../layouts/topbar/topbar.component';
import { SidebarComponent } from '../layouts/sidebar/sidebar.component';

export interface Task {
  idTache: number;
  descriptionTache: string;
  liste: List;
}

export interface List {
  idListe: number;
  nomListe: string;
  taches: Task[];
  projet: Project;
}
@Component({
  selector: 'app-gestion-projet',
  standalone: true,
  imports: [CommonModule,TopbarComponent,SidebarComponent, FormsModule, DragDropModule, CdkDrag, CdkDropList],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gestion-projet.component.html',
  styleUrls: ['./gestion-projet.component.scss']
})
export class GestionProjetComponent implements OnInit {
  lists: List[] = [];
  isModalOpen = false;
  newListName: string = '';
  isAddTaskModalOpen: boolean = false;
  newTaskDescription: string = '';
  currentListIndex: number | null = null;
  isEditListModalOpen = false;
  editedListName: string = '';
  listIndexToEdit: number | null = null;

  // Newly added properties
  isEditTaskModalOpen: boolean = false;
  editedTaskText: string = '';
  showDeleteModal: boolean = false;
  taskToDeleteIndex: { listIndex: number; taskIndex: number } | null = null;

  projectId: number | null = null;
  project: Project | null = null;
  taches: Task[]=[];
  currentTaskId!: number;

  constructor(private route: ActivatedRoute, private projectService: ProjectService,private listeService: ListeTacheService) {}

  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idFromUrl = params.get('idProjet');
      console.log('ID from URL:', idFromUrl); // Log the raw parameter
      this.projectId = Number(idFromUrl);
      console.log('Parsed Project ID:', this.projectId); // Log the parsed ID
      this.fetchMemberEmails(this.projectId);
      
      if (!isNaN(this.projectId) && this.projectId > 0) {
        this.loadLists(); // Charger les listes (kanban)
        this.loadProject(this.projectId);
      } else {
        console.error('ID du projet est invalide');
      }
    });
  }

  getListesByProjetId(projetId: number): void {
    this.listeService.getListesByProjetId(projetId).subscribe(
      (data: List[]) => {
        this.lists = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des listes', error);
      }
    );
  }

  loadProject(idProjet: number): void {
    this.projectService.getProjectById(idProjet).subscribe(
      (project) => {
        this.project = project;
        console.log(this.project)
      },
      (error) => {
        console.error('Erreur lors du chargement du projet', error);
        // Ajout d'un log pour voir le corps de la réponse
        if (error.error) {
          console.error('Détails de l\'erreur :', error.error);
        }
      }
    );
  }
  
  
  loadLists(): void {
    if (this.projectId !== null) { // Vérifiez que projetId n'est pas null
      this.listeService.getListesByProjetId(this.projectId).subscribe(
        (data: List[]) => {
          this.lists = data;
          // Charger les tâches pour chaque liste
          this.lists.forEach(list => {
            this.loadTasksForList(list.idListe);
          });
        },
        (error) => {
          console.error('Erreur lors de la récupération des listes', error);
        }
      );
    } else {
      console.error('ID du projet est null');
    }
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.newListName = '';
  }

  saveNewList(): void {
    if (this.newListName.trim() !== '' && this.projectId !== null) {
      this.listeService.ajouterListe(this.projectId, this.newListName).subscribe(
        () => {
          this.loadLists();
          this.closeModal();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la liste', error);
        }
      );
    } else {
      console.error('Nom de la liste est vide ou ID du projet est null');
    }
  }
  loadTasksForList(listId: number): void {
    this.listeService.getTachesByListeId(listId).subscribe(
      (tasks: Task[]) => {
        const list = this.lists.find(l => l.idListe === listId);
        if (list) {
          list.taches = tasks;
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des tâches', error);
      }
    );
  }
  saveTask(): void {
    if (this.newTaskDescription.trim() !== '' && this.currentListIndex !== null) {
      const list = this.lists[this.currentListIndex];
      
      // Vérifiez si la liste existe
      if (list) {
        this.listeService.ajouterTache(list.idListe, this.newTaskDescription).subscribe(
          () => {
            // Ajoutez la tâche à la liste

            this.loadTasksForList(list.idListe);
            this.closeAddTaskModal();
          },
          (error) => {
            console.error('Erreur lors de l\'ajout de la tâche', error);
          }
        );
      } else {
        console.error('La liste sélectionnée est introuvable.');
      }
    } else {
      console.error('Nom de la tâche est vide ou index de la liste est null');
    }
  }

  openEditListModal(listIndex: number) {
    this.listIndexToEdit = listIndex;
    this.editedListName = this.lists[listIndex].nomListe;
    this.isEditListModalOpen = true;
  }

  closeEditListModal() {
    this.isEditListModalOpen = false;
    this.editedListName = '';
    this.listIndexToEdit = null;
  }

  saveEditedList() {
    if (this.listIndexToEdit !== null && this.editedListName.trim() !== '') {
      const editedList = this.lists[this.listIndexToEdit];
      editedList.nomListe = this.editedListName;

      this.listeService.updateList(editedList.idListe, editedList).subscribe(
        () => {
          this.loadLists();
          this.closeEditListModal();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la liste', error);
        }
      );
    }
  }

  openAddTaskModal(listIndex: number) {
    this.currentListIndex = listIndex;
    this.newTaskDescription = '';
    this.isAddTaskModalOpen = true;
  }

  closeAddTaskModal() {
    this.isAddTaskModalOpen = false;
    this.currentListIndex = null;
  }
  
  deleteTask(listIndex: number, taskIndex: number) {
    const list = this.lists[listIndex];
    const taskId = list.taches[taskIndex].idTache;

    this.listeService.deleteTask(list.idListe, taskId).subscribe(
      () => {
        this.loadLists();
      },
      (error) => {
        console.error('Erreur lors de la suppression de la tâche', error);
      }
    );
  }

  
  openEditTaskModal(listIndex: number, taskIndex: number) {
    this.currentListIndex = listIndex;
    this.editedTaskText = this.lists[listIndex].taches[taskIndex].descriptionTache;
    this.currentTaskId = this.lists[listIndex].taches[taskIndex].idTache; 
    this.isEditTaskModalOpen = true;
  }

  closeEditTaskModal() {
    this.isEditTaskModalOpen = false;
    this.editedTaskText = '';
  }

  saveEditedTask() {
    if (this.currentListIndex !== null && this.editedTaskText.trim() !== '' && this.currentTaskId !== null) {
      const updatedTask: Task = {
        idTache: this.currentTaskId,
        descriptionTache: this.editedTaskText,
        liste: this.lists[this.currentListIndex] // Inclure la liste à laquelle appartient la tâche
      };

      // Appeler le service pour mettre à jour la tâche
      this.listeService.updateTask(this.lists[this.currentListIndex].idListe, this.currentTaskId, updatedTask).subscribe(
        () => {
          this.loadLists(); // Recharger la liste des tâches
          this.closeEditTaskModal(); // Fermer le modal
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la tâche', error);
        }
      );
    }
  }

  openDeleteModal(listIndex: number, taskIndex: number) {
    this.taskToDeleteIndex = { listIndex, taskIndex };
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.taskToDeleteIndex = null;
  }

  confirmDeleteTask() {
    if (this.taskToDeleteIndex) {
      const { listIndex, taskIndex } = this.taskToDeleteIndex;
      const list = this.lists[listIndex];
      const taskId = list.taches[taskIndex].idTache;
      console.log( taskId , list.idListe);

      this.listeService.deleteTask(list.idListe, taskId).subscribe(
        () => {
          this.loadLists();
          this.closeDeleteModal();
        },
        (error) => {
          console.error('Erreur lors de la suppression de la tâche', error);
        }
      );
    }
  }
  dragTask(event: CdkDragDrop<Task[]>, targetListIndex: number) {
    // Retrieve the task data being dragged
    const task = event.item.data;
    console.log('Dragged Task:', task);

    // Find the index of the previous list that contains this task
    const previousListIndex = this.lists.findIndex(list => list.taches.includes(task));
    console.log('Previous List Index:', previousListIndex);
    console.log('Target List Index:', targetListIndex);
    console.log('Current Index:', event.currentIndex);

    // If the task is found in another list and it's not being dropped into the same list
    if (previousListIndex !== -1 && previousListIndex !== targetListIndex) {
        console.log('Tasks in Previous List:', this.lists[previousListIndex].taches);
        console.log('Tasks in Target List:', this.lists[targetListIndex].taches);

        // Move the task from the previous list to the new list
        transferArrayItem(
            this.lists[previousListIndex].taches,
            this.lists[targetListIndex].taches,
            this.lists[previousListIndex].taches.indexOf(task),
            event.currentIndex
        );

        console.log('Tasks in Previous List After Move:', this.lists[previousListIndex].taches);
        console.log('Tasks in Target List After Move:', this.lists[targetListIndex].taches);
    } else {
        console.log('No valid move detected.');
    }
  }
  // isMemberModalOpen = false;
  // memberEmail = '';
  // invitedMembers: any[] = []; // Pour stocker la liste des membres invités
  isMemberModalOpen: boolean = false;
  responseMessage: string = '';
  memberEmail: string = '';
  openAddMemberModal(projetId:number):void {
    this.projectId = projetId;
    this.isMemberModalOpen = true;
    this.fetchMemberEmails(this.projectId);
    // this.loadInvitedMembers(); // Charger les membres invités quand la modal s'ouvre
  }

  closeAddMemberModal() {
    this.isMemberModalOpen = false;
    this.responseMessage = ''; // Réinitialise le message de réponse
    this.memberEmail = ''; // Réinitialise le champ d'e-mail
  }
inviteMember(): void {
  if (this.projectId !== null) { // Vérifie si projectId n'est pas null
      this.listeService.inviteMember(this.memberEmail, this.projectId ).subscribe({
          next: (response: any) => {
              // Si la réponse est un objet JSON avec une clé 'message'
              this.responseMessage = response.message; 
              this.memberEmail = '';
              
          },
          error: (err) => {
              console.error("Erreur détaillée:", err); // Afficher l'erreur dans la console
              this.responseMessage = 'Erreur lors de l\'envoi de l\'invitation : ' + (err.error.message || 'Erreur inconnue');
          }

      });
  } else {
      this.responseMessage = 'ID de projet non valide.';
  }
  
}
  memberEmails: string[] = [];
  errorMessage: string = '';
fetchMemberEmails(projetId: number): void {
  this.listeService.getMemberEmails(projetId).subscribe({
    next: (emails) => {
      this.memberEmails = emails;
    },
    error: (err) => {
      this.errorMessage = 'Erreur lors de la récupération des emails des membres';
    }
  });
}

listToDeleteIndex: number | null = null; // Index de la liste à supprimer
showDeleteModal1: boolean = false; // État d'affichage de la modal

openDeleteModal1(listIndex: number) {
  this.listToDeleteIndex = listIndex; // Stocke l'index de la liste à supprimer
  this.showDeleteModal1 = true; // Affiche la modal de confirmation
}

closeDeleteModal1() {
  this.showDeleteModal1 = false; // Ferme la modal
  this.listToDeleteIndex = null; // Réinitialise l'index de la liste
}

confirmDeleteList() {
  if (this.listToDeleteIndex !== null) {
    const list = this.lists[this.listToDeleteIndex];
    const listId = list.idListe;
    console.log('Suppression de la liste avec ID:', listId);

    this.listeService.deleteList(listId).subscribe(
      () => {
        this.loadLists(); // Recharge les listes après suppression
        this.closeDeleteModal1(); // Ferme la modal correctement
      },
      (error) => {
        console.error('Erreur lors de la suppression de la liste', error);
      }
    );
  }
}
}