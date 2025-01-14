export class Myfile {
    ney!: string;
    name!: string;
    url!: string;
    file: File;
    id:string;
    upload_date: string;
    ownerID: string;
    renterID: string;
  
    constructor(file: File) {
      this.file = file;
    }
  }