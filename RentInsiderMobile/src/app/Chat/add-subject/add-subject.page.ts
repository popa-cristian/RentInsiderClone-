import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validator} from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {Location} from '@angular/common';
import { Subject} from 'src/app/Models/subject';
import { SubjectsService } from 'src/app/Services/subjects.service';
import { Property } from 'src/app/Models/property';
import { TranslateService } from '@ngx-translate/core';

// modals
import swal from 'sweetalert';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.page.html',
  styleUrls: ['./add-subject.page.scss'],
})
export class AddSubjectPage implements OnInit {

  subjectForm:FormGroup;
  submitted=false;
  valid=false;
  data:any; 
  currentSubject:Subject;
  currentProperty:Property;

  // translation
  languageUsed: string;

  constructor(
    private activatedRoute:ActivatedRoute, 
    private router:Router,
    private formBuilder: FormBuilder,
    private subjectService:SubjectsService,
    private _location:Location,
    private changeDetectorRef: ChangeDetectorRef,
    private readonly translateService: TranslateService
  ) {
    this.activatedRoute.queryParams.subscribe(params =>{
      if(this.router.getCurrentNavigation().extras.state){
        this.currentProperty = this.router.getCurrentNavigation().extras.state.currentProperty;
        this.currentSubject = this.router.getCurrentNavigation().extras.state.currentSubject;
      }
    });
   }

  ngOnInit() {
    if((this.currentProperty==undefined)||(this.currentProperty.id==''))
      this.PreviousPage();
    this.subjectForm=this.formBuilder.group({
      propertyID: this.currentProperty.id,
      ownerID:  this.currentProperty.ownerID,
      renterID:  this.currentProperty.renterID,
      title: ['', Validators.required],
      description:  ['', Validators.required],
      importance:  ['', Validators.required],
    });
    if(this.currentSubject!=undefined)
      this.initializeFormGroup(this.currentSubject);
  }

  initializeFormGroup(currentSubject: Subject) {
    this.subjectForm=this.formBuilder.group({
      title: [currentSubject.title, Validators.required],
      description: [currentSubject.description, Validators.required],
      importance: [currentSubject.importance, [Validators.required]],
    });
    this.changeDetectorRef.detectChanges();
  }

  onSubmit(){
    if (this.subjectForm.invalid){
      this.showErrorModal();
    } else {
      const currentSubject = this.subjectForm.value as Subject;
      if (this.currentSubject !== undefined) {
        currentSubject.id = this.currentSubject.id;
        this.subjectService
          .updateSubject(currentSubject)
          .then(() => {
            this.showSuccessModal('add-subject.form-edit');
          });
      } else {
        this.subjectService
          .addSubject(currentSubject)
          .then(() => {
            this.showSuccessModal('add-subject.form-add');
          });
      }
    }
  }

  PreviousPage(){
    this._location.back();
  }

  // modals
  showErrorModal() {
    swal({
      title: this.translateService.instant('add-subject.form-invalid'),
      icon: 'error'
    });
  }

  showSuccessModal(translationKey: string) {
    swal({
      title: this.translateService.instant(translationKey),
      icon: 'success'
    });
  }
}
