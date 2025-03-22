export interface EmployeMission {
  id?: number;
  cin: string;
  employe: {
    nom: string; // Changement de 'any' à 'string'
    id: number;
  };
  startDate: Date;
  endDate: Date;
  destination: string;
  document?: { idDoc: number};
}


  export interface Employes {
    id: number;               // ID unique de l'employé
    prenom: string;           // Prénom de l'employé
    nom: string;              // Nom de l'employé
    email: string;            // Email de l'employé
    location: string;         // Localisation de l'employé
    joiningDate: Date;        // Date d'entrée de l'employé
    phone: number;            // Numéro de téléphone de l'employé
    cin: number;              // CIN de l'employé
    departementId?: number;   // ID du département (optionnel, si nécessaire)
    posteId?: number;         // ID du poste (optionnel, si nécessaire)
  }
  
  export interface Document {
    idDoc: number;            // ID unique du document
    name: string;             // Nom du document
    type: string;             // Type du document
    document: string;         // Le contenu du document (ou le lien vers celui-ci)
  }
  