import {
  Component,
  OnInit,
} from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { AddSubjectComponent } from '../add-subject/add-subject.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SubjectsService } from '../Services/subjectService/subjects.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from '../Models/subject';
import { Property } from '../Models/property';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatsService } from '../Services/chatService/chats.service';
import { DialogService } from '../Services/dialogService/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { SignInServiceService } from '../Services/signInService/sign-in-service.service';
import { ApplicationLanguages, ChangePageLanguage } from '../utils/LanguageChanger';
@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss'],
})
export class SubjectListComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'importance',
    'description',
    'actions',
  ];
  subjects: any[] = [];
  isLoadingResults = true;
  previousUrl: string;
  currentProperty: Property;
  modalReference = null;
  Update_Subject_Form: FormGroup;
  currentSubjectID = null;
  submitted = false;
  subject: any;
  selectedSubject?: Subject;
  currentUser: string;
  
   // translation
   importedLanguages = ApplicationLanguages;

  constructor(
    private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    private translateService: TranslateService,
    private signInService: SignInServiceService,
    private dialogService: DialogService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private database: AngularFirestore,
    private http: HttpClient,
    public dialog: MatDialog,
    private subjectService: SubjectsService,
    private chatService: ChatsService,
    private _location: Location
  ) {}

  ngOnInit() {
    this.currentProperty = JSON.parse(sessionStorage.getItem('property'));
    console.log(this.currentProperty);
    this.currentUser = this.activatedRoute.snapshot.params.userName;
    if (this.currentProperty) {
      this.getSubjectsOfProperty(this.currentProperty);
    } else {
      this.PreviousPage();
    }
  }

  getSubjectsOfProperty(property: Property): void {
    this.subjectService
      .getSubjectsCreatedOnProperty(property)
      .subscribe((subjects) => {
        this.subjects = subjects;
      });
  }

  initializeFormGroup(currentSubject: Subject): void {
    this.Update_Subject_Form = this.formBuilder.group({
      newSubjectTitle: [currentSubject.title, Validators.required],
      newImportanceLevel: ['', Validators.required],
      newDescription: [currentSubject.description, Validators.required],
    });
  }

  enterChat(subject: Subject) {
    this.selectedSubject = subject;
    this.selectedSubject.id = subject.id;
  }

  openModalAddSubject() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      id: 'id',
      currentProperty: this.currentProperty,
    };
    dialogConfig.panelClass = 'customClass';
    this.dialog.open(AddSubjectComponent, dialogConfig);
  }
  ngOnDestroy() {
    sessionStorage.removeItem('property');
  }

  async openUpdateSubjectModal(selectedSubject) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      subject: selectedSubject,
      currentProperty: this.currentProperty,
    };
    this.dialog.open(AddSubjectComponent, dialogConfig);
  }

  closeModalUpdateSubject() {
    this.modalReference.close();
  }
  deleteSubject(subjectID) {
    if (window.confirm('Doresti sa stergi acest subiect?')) {
      this.subjectService.deleteSubject(subjectID);
    }
  }

  PreviousPage() {
    this._location.back();
  }

  get getForm() {
    return this.Update_Subject_Form.controls;
  }

  SaveUpdateOfSubject() {
    if (this.Update_Subject_Form.invalid) {
      return;
    } else {
      const updatedSubject = new Subject();
      updatedSubject.id = this.currentSubjectID;
      const currentSubject = this.subjectService.getSubjectByID(
        this.currentSubjectID
      );
      updatedSubject.ownerID = this.currentProperty.ownerID;
      updatedSubject.renterID = this.currentProperty.renterID;
      updatedSubject.title =
        this.Update_Subject_Form.controls['newSubjectTitle'].value;
      updatedSubject.importance =
        this.Update_Subject_Form.controls['newImportanceLevel'].value;
      updatedSubject.description =
        this.Update_Subject_Form.controls['newDescription'].value;
      this.subjectService.updateSubject(updatedSubject);
      this.modalReference.close();
    }
  }

  onLogout() {
    this.dialogService
      .openWarningDialog(
        this.translateService.instant(
          'owner-main-page.logout.confirmation-dialog.title'
        ),
        this.translateService.instant(
          'owner-main-page.logout.confirmation-dialog.message'
        ),
        true,
        true
      )
      .then((rez) => {
        if (rez) {
          //sessionStorage.removeItem('ownerName');
          //sessionStorage.removeItem('renterName');
          this.signInService.logout();
          this.router.navigateByUrl('');
        }
      });
  }

  openWiki() {
    this.router.navigate(['./user-guide']);
  }

  changeLanguage(languageWanted: string): void {
    ChangePageLanguage(
      languageWanted,
      this.translateService.currentLang,
      this.translateService
    );
  }
}
