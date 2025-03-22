export interface Departement {
  id: number;
  nom?: string; // Rendre `nom` facultatif
}

export interface Poste {
  id: number;
  nom?: string; // Rendre `nom` facultatif
}


export interface Employes {
  id?: number;
  prenom: string;
  nom: string;
  email: string;
  cin: number;
  phone: string;
  location: string;
  departement?: Departement;
  poste?: Poste;
  joiningDate: Date;
}
