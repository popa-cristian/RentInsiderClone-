import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { Myfile } from 'src/app/Models/fileupload';
import { Property } from 'src/app/Models/property';
import { PropertyService } from 'src/app/Services/property.service';
import { FileUploadService } from 'src/app/Services/file.service';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';

@Component({
  selector: 'app-uploaded-files',
  templateUrl: './uploaded-files.page.html',
  styleUrls: ['./uploaded-files.page.scss'],
})
export class UploadedFilesPage implements OnInit {

  currentPropertyID:string;
  selectedFiles?: FileList;
  currentFileUpload?: Myfile;
  hasDocument: boolean;
  currentProperty:Property;
  files:Myfile[]=[];
  constructor(
    private activatedRoute:ActivatedRoute,
    private location:Location,
    private propertyService:PropertyService,
    private fileService:FileUploadService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.currentPropertyID = this.activatedRoute.snapshot.paramMap.get('id');
    this.getViewModelData();
  }

  getViewModelData(){
    this.propertyService.getPropertyByID(this.currentPropertyID).then(property=>{
      this.currentProperty=property;
      this.currentProperty.id=this.currentPropertyID;
      this.getFilesOfCurrentProperty();
    })
  }

  getFilesOfCurrentProperty(){
    this.fileService.getFilesOfRenter(this.currentProperty.ownerID, this.currentProperty.renterID).subscribe(files=>{
      this.files=files;
    })
  }

  selectFile(event: any): void {
    this.hasDocument=true;
    this.selectedFiles = event.target.files;
  }

  previousPage(){
    this.location.back();
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new Myfile(file);
        let today = new Date().toISOString().slice(0, 10);
        this.currentFileUpload.upload_date = today;
        this.fileService
          .pushFileToStorage(this.currentFileUpload, this.currentProperty)
          .subscribe(
            (percentage) => {
              //this.percentage = Math.round(percentage ? percentage : 0);
              if(percentage == 100){
                this.showSuccessModal();
              }
            },
            (error) => {
              console.log(error);
            }
          );
      }
    }
  }

  showSuccessModal() {
    let modalTitle: string;
    switch(this.translateService.currentLang) {
      case 'roMobile':
        modalTitle = 'Salvat !';
        break;
      case 'enMobile':
        modalTitle = 'Saved !';
        break;
    }
    swal({
      title: modalTitle,
      icon: 'success'
    })
  }
  
  deleteFile(file: Myfile) {
    this.fileService.deleteFile(file, file.id); 
  }

  openSelectedFile(filePath:string){
    window.open(filePath,"blank");
  }
}
