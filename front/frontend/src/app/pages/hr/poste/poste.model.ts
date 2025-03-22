export class Poste {
    id: number;  // Correspond à l'attribut 'id' dans l'entité backend
    nom: string; // Correspond à l'attribut 'nom' dans l'entité backend
  
    constructor(id: number, nom: string) {
      this.id = id;
      this.nom = nom;
    }
  }
  