import { Component } from '@angular/core';

//import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChatsService } from './Services/chats.service';
import { ExpensesService } from './Services/expense.service';
import { FileUploadService } from './Services/file.service';
import { OwnerService } from './Services/owner.service';
import { PropertyService } from './Services/property.service';
import { RenterDBService } from './Services/renter-db.service';
import { SubjectsService } from './Services/subjects.service';
import { TranslateService } from '@ngx-translate/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'RentInsiderClient';
  items: Observable<any[]>;
  constructor(
    firestore: AngularFirestore,
    private translateService: TranslateService
    
    /*firestore: AngularFirestore,
    private ownerservice:OwnerService,
    private renterservice:RenterDBService,
    private fileservice:FileUploadService,
    private propertyservice:PropertyService,
    private subjectservice:SubjectsService,
    private chatservice:ChatsService,
    private expenseservice:ExpensesService,*/
    ) {
    this.items = firestore.collection('Owners').valueChanges();
    // add languages
    translateService.addLangs(['enMobile', 'roMobile']);
    translateService.setDefaultLang('roMobile');
    translateService.use(translateService.defaultLang);
    /*this.items = firestore.collection('Owners').valueChanges();
    console.log(this.items);*/
  }

  useLanguage(language: string) {
    this.translateService.use(language);
  }


  /*testServiceMechanics(){
    //console.log("OwnerService");
    this.ownerservice.test();
    //console.log("RenterService");
    this.renterservice.test();
    //console.log("PropertyService");
    this.propertyservice.test();
    //console.log("FileService");
    this.fileservice.test();
    //console.log("SubjectService");
    this.subjectservice.test();
    //console.log("ExpenseService");
    this.expenseservice.test();
    //console.log("ChatService");
    this.chatservice.test();
    
  }


  testServiceMechanics2(){
   this.renterservice.getRenterByID('8nzfgNCly0WSTygoIcb1VM3rZ2Q2');
  }

  testServices(){
    console.log("OwnerService");
    this.ownerservice.response();
    console.log("RenterService");
    this.renterservice.response();
    console.log("PropertyService");
    this.propertyservice.response();
    console.log("FileService");
    this.fileservice.response();
    console.log("SubjectService");
    this.subjectservice.response();
    console.log("ExpenseService");
    this.expenseservice.response();
    console.log("ChatService");
    this.chatservice.response();
    
  }*/
 
  
}
