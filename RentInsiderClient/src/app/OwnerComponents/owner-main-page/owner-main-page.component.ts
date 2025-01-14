import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Property } from '../../Models/property';
import { Owner } from '../../Models/owner';
import { PropertyService } from '../../Services/propertyService/property.service';
import { Renter } from '../../Models/renter';
import { RenterDBService } from '../../Services/renterDbService/renter-db.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { SignInServiceService } from '../../Services/signInService/sign-in-service.service';
import { AddPropertyComponent } from '../add-property/add-property.component';
import { OwnerDetailsComponent } from '../../CommonComponents/owner-details/owner-details.component';
import { Router } from '@angular/router';
import { Myfile } from '../../Models/fileupload';
import { FileUploadService } from '../../Services/fileService/file.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OwnerService } from '../../Services/ownerService/owner.service';
import { MatTableDataSource } from '@angular/material/table';
import { AddExpensesComponent } from '../../CommonComponents/add-expenses/add-expenses.component';
import { Expense } from '../../Models/expense';
import { ExpensesService } from '../../Services/expensesService/expenses.service';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChangePageLanguage } from 'src/app/utils/LanguageChanger';
import { ApplicationLanguages } from 'src/app/utils/LanguageChanger';
import { DialogService } from 'src/app/Services/dialogService/dialog.service';


@Component({
  selector: 'app-owner-main-page',
  templateUrl: './owner-main-page.component.html',
  styleUrls: ['./owner-main-page.component.scss'],
})
export class OwnerMainPageComponent implements OnInit, AfterViewInit {
  name: string;
  url: string;
  id: string;
  upload_date: Date;
  ID: string;
  displayedColumns: string[] = ['id', 'date', 'name', 'url', 'ID'];
  dataSource = new MatTableDataSource();
  expenses: Expense[];
  properties: Property[] = [];
  owners: Owner[];
  selectedItem?: Property;
  selectedRenters: Renter[];
  selectedRenter: Renter;
  ownerUserData;
  renters: Renter[];
  renter: Renter;
  ShowRenterDetailsForm: FormGroup;
  submitted = false;
  item: any;
  selected_renter: any;
  public modalRef: BsModalRef;
  files: Myfile[];
  fileToDelete: Myfile;
  fileToDelete_ID: string;
  currentOwner: Owner;
  filesToPass: Myfile[];
  renterIDToPass: string;
  listOfPropertiesIsShowed : boolean;
  
  // tooltips !! TO IMPLEMENT A BUTTON TO DISABLE/ENABLE TOOLTIPS
  tooltips: boolean; /* should be used globaly in this component to disable/enable tooltips */
  
  // translation
  importedLanguages = ApplicationLanguages;

  

  constructor(
    private propertyService: PropertyService,
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private signInService: SignInServiceService,
    private router: Router,
    private fileService: FileUploadService,
    private formBuilder: FormBuilder,
    private ownerService: OwnerService,
    private expenseService: ExpensesService,
    private changeDetector: ChangeDetectorRef,
    private translateService: TranslateService,
    private dialogService: DialogService
  ) {}
  ngOnInit() {
    if (sessionStorage.getItem('user') == undefined) {
      this.router.navigateByUrl('/');
    }
    this.getPropertiesFromService();
    this.getCurrentOwner();
    this.ShowRenterDetailsForm = this.formBuilder.group({
      lastName: [''],
      firstName: [''],
      CNP: [''],
      address: [''],
      email: [''],
      phoneNumber: [''],
    });
    if (this.propertyService.subsVar == undefined) {
      this.propertyService.subsVar =
        this.propertyService.invokeFirstComponentFunction.subscribe(
          (property: Property) => {
            this.onSelect(property);
          }
        );
    }
    this.listOfPropertiesIsShowed = true;
  }

  ngAfterViewInit() {}

  onSelect(property: Property): void {
    this.selectedItem = (this.selectedItem === property ? undefined : property);
    if (this.selectedItem !== undefined) {
      if (property.renterID != '' && property.renterID != undefined) {
        this.getSelectedRenter();
        this.getCurrentRenter();
      } else {
        property.renterID = '';
        this.getSelectedRenter();
        this.getCurrentRenter();
        this.fileService.onFirstComponentButtonClick(property);
        this.changeDetector.detectChanges();
      }
    }
  }
  getCurrentOwner() {
    var obsowners = from(this.ownerService.getCurrentOwner());
    obsowners.subscribe((owners) => {
      this.currentOwner = owners;
    });
  }

  getCurrentFilesOfProperty(property: Property) {
    this.dataSource.data = [];
    var ownerID = JSON.parse(sessionStorage.getItem('user')).uid;
    this.fileService
      .getFilesOfRenter(ownerID, property.renterID)
      .subscribe((files) => {
        this.dataSource.data = files;
      });
  }

  getCurrentFilesToPass(property: Property) {
    this.dataSource.data = [];
    var ownerID = JSON.parse(sessionStorage.getItem('user')).uid;
    this.fileService
      .getFilesOfRenter(ownerID, property.renterID)
      .subscribe((files) => {
        this.filesToPass = files;
      });
  }

  getCurrentExpenses(property: Property) {
    this.expenseService
      .getExpensesFromProperty(property)
      .subscribe((expenses) => {
        this.expenses = expenses;
      });
  }

  getFileByID(id: string) {
    this.fileToDelete_ID = id;
    var filepromise = from(this.fileService.getFilebyID(id));
    filepromise.subscribe((filepromises) => {
      this.fileToDelete = filepromises;
    });
  }

  deletefile() {
    this.fileService.deleteFile(this.fileToDelete, this.fileToDelete_ID);
  }

  getCurrentFiles() {
    var ownerID = JSON.parse(sessionStorage.getItem('user')).uid;
    this.fileService.getFilesBelongingtoOwner(ownerID).subscribe((files) => {
      this.dataSource.data = files;
    });
  }

  getCurrentRenter() {
    this.getRenterofselectedProperty(this.selectedItem).subscribe((renters) => {
      this.renters = renters;
      this.renter = this.renters[0];
    });
  }

  getPropertiesFromService() {
    this.propertyService.getPropertiesFromUser().subscribe((properties) => {
      this.properties = properties;
    });
  }
  getRenterofselectedProperty(selectedProperty: Property) {
    return this.afs
      .collection('Renters', (ref) =>
        ref.where('propertyID', '==', selectedProperty.id).limit(1)
      )
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((a) => {
            const data = a.payload.doc.data() as Renter;

            data.id = a.payload.doc.id;
            return data;
          });
        })
      );
  }
  getSelectedRenter() {
    this.getRenterofselectedProperty(this.selectedItem).subscribe(
      (selectedRenters) => {
        this.selectedRenters = selectedRenters;
        // this.selectedItem.renterID = this.selectedRenters[0].id;
        this.fileService.onFirstComponentButtonClick(this.selectedItem);
        this.expenseService.ExpenseInterrogation(this.selectedItem);
      }
    );
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      id: 'id',
    };
    this.dialog.open(AddPropertyComponent, dialogConfig);
  }

  openModalExpense() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      selectedProperty: this.selectedItem,
    };
    this.dialog.open(AddExpensesComponent, dialogConfig);
  }

  openModalDetails() {
    this.getCurrentOwner();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;    
    dialogConfig.data = {
      currentOwner: this.currentOwner,
    };
    this.dialog.open(OwnerDetailsComponent, dialogConfig);
  }

  changeLanguage(languageWanted: string): void {
    ChangePageLanguage(languageWanted, this.translateService.currentLang, this.translateService);
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
      ).then((rez) => {
      if(rez){
        sessionStorage.removeItem('ownerName');
        sessionStorage.removeItem('renterName');
        this.signInService.logout();
        this.router.navigateByUrl('');
      }
    });
}

  openWiki()
  {
    this.router.navigate(['./user-guide']);

  }

  toggleTooltips(){
    this.tooltips = this.tooltips? false : true;
  }

  showListOfProperties() : void{
    this.listOfPropertiesIsShowed = (this.listOfPropertiesIsShowed ? false : true);
  }
}
