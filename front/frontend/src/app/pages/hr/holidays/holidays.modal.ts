export interface Employe {
    id: number;
    nom: string;
    // Ajoutez d'autres propriétés de l'employé si nécessaire
  }
  

  export interface DemandeConges {
    id: number;
    employe: { id: number; nom: string }; // Assurez-vous que cette structure est correcte
    dateDebut: Date;
    dateFin: Date;
    motif: string;
    typeConge: string;
    cin: string;
    statut: string; // Assurez-vous que ce champ est bien présent
}
