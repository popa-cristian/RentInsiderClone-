import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Property } from 'src/app/Models/property';
import { Subject } from 'src/app/Models/subject';
import { SubjectsService } from 'src/app/Services/subjects.service';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ChangePageLanguage } from 'src/app/utils/LanguageChanger';
import { ApplicationLanguages } from 'src/app/utils/LanguageChanger';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-chatroom-menu',
  templateUrl: './chatroom-menu.page.html',
  styleUrls: ['./chatroom-menu.page.scss'],
})
export class ChatroomMenuPage implements OnInit {

  subjects: any[]= [];
  currentProperty: Property;
  currentSubjectID = null;
  selectedSubject: Subject = null;
  currentUser: string;

  // translation
  importedLanguages = ApplicationLanguages;

  constructor(private subjectService: SubjectsService,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private readonly translateService: TranslateService,
    private menuController:MenuController
    ) { 
      this.activatedRoute.queryParams.subscribe(params =>{
        if(this.router.getCurrentNavigation().extras.state){
          this.currentProperty = this.router.getCurrentNavigation().extras.state.currentItem;
        }
      });
    }

  ngOnInit(){
    if(this.currentProperty) {
      this.getSubjectsOfProperty(this.currentProperty);
            
      
    }
  }

  ionViewWillEnter(){
    this.menuController.enable(true,"second");
  }
  
  getSubjectsOfProperty(property: Property) {
    this.subjectService.getSubjectsCreatedOnProperty(property).subscribe(subjects => {
      this.subjects = subjects;

      this.selectFirstSubject();
    });
  }

  selectFirstSubject() {
    // if there are any subjects, select the first one by default
    // else it's null
    if (this.subjects.length > 0) {
      this.selectedSubject = this.subjects[0];
      this.router.navigate(['/chatroom-menu/chatroom', { id: this.selectedSubject.id }]);
    }
  }

  previousPage(){
    const userID = JSON.parse(sessionStorage.getItem('user')).uid;
    if(userID==this.currentProperty.ownerID)
      this.router.navigate(['/owner-main-menu-page']);
    if(userID==this.currentProperty.renterID)
      this.router.navigate(['rent-main-menu-page']);
  }

  addSubjectCommand(){
    let navigationExtras: NavigationExtras = {
      state: {
        currentProperty: this.currentProperty,
        currentSubject:undefined
      }
    };
    this.router.navigate(['/add-subject'], navigationExtras);
  }
  
  editSubjectCommand(subject: Subject){
    let navigationExtras: NavigationExtras = {
      state: {
        currentProperty: this.currentProperty,
        currentSubject:subject
      }
    };
    this.router.navigate(['/add-subject'], navigationExtras);
  }

  // select a subject from the side menu
  onSelect(subject: Subject){
    this.selectedSubject = subject;
    this.router.navigate(['/chatroom-menu/chatroom', { id: subject.id }]);
  }

  changeLanguage(languageWanted: string): void {
    // INPUT: importedLanguages.[language]
    ChangePageLanguage(languageWanted, this.translateService.currentLang, this.translateService);
}
}
