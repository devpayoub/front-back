export interface Employe {
  id: number;
  nom: string;
  // Ajoutez d'autres propriétés de l'employé si nécessaire
}

export interface Absence {
    id: number;
    employe: Employe; // Vous pouvez remplacer 'any' par un modèle 'Employe' si vous en avez un
    dateAbsence: Date;
    motif: string;
    cin: number;
  
  }
  