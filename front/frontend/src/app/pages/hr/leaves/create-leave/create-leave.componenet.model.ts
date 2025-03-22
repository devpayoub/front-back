export class Document {
    idDoc: number;
    name: string;
    type: string;
    document: Blob;
  
    constructor(idDoc: number, name: string, type: string, document: Blob) {
      this.idDoc = idDoc;
      this.name = name;
      this.type = type;
      this.document = document;
    }
  }
  