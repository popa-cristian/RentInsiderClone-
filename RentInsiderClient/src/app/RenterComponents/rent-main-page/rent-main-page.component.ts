import { TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Renter } from '../../Models/renter';
import { RenterDBService } from '../../Services/renterDbService/renter-db.service';
import { Router } from '@angular/router';
import { SignInServiceService } from '../../Services/signInService/sign-in-service.service';
import { FileUploadService } from '../../Services/fileService/file.service';
import { Myfile } from '../../Models/fileupload';
import { Property } from '../../Models/property';
import { Owner } from '../../Models/owner';
import { from } from 'rxjs';
import { RenterDetailsComponent } from '../renter-details/renter-details.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Expense } from '../../Models/expense';
import { ExpensesService } from '../../Services/expensesService/expenses.service';
import { OwnerInfoComponent } from '../owner-info/owner-info.component';
import { PropertyService } from '../../Services/propertyService/property.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/app/Services/dialogService/dialog.service';

@Component({
  selector: 'app-rent-main-page',
  templateUrl: './rent-main-page.component.html',
  styleUrls: ['./rent-main-page.component.css'],
})
export class RentMainPageComponent implements OnInit {
  name: string;
  url: string;
  upload_date: Date;

  displayedColumns: string[] = ['date', 'name', 'url'];
  dataSource = new MatTableDataSource();
  EditRenterDetailsForm: FormGroup;
  ProprtyDetailsForm: FormGroup;
  submitted = false;
  public modalRef: BsModalRef;
  renters: Renter[];
  currentRenter: Renter;
  selectedItem: any;
  due_date: any;
  files: Myfile[];
  currentProperties: Property[];
  currentProperty: Property;
  currentOwnerID: string;
  owner: Owner;
  ownerID: string;
  currentDate: Date;
  modalReference = null;
  fullName: string;
  properties: Property[];
  expenses: Expense[];
  languageUsed: string;

  selectedFiles?: FileList;
  currentFileUpload?: Myfile;
  percentage = 0;

  constructor(
    private modalService: BsModalService,
    private renterService: RenterDBService,
    private router: Router,
    public dialog: MatDialog,
    private signInService: SignInServiceService,
    private fileService: FileUploadService,
    private formBuilder: FormBuilder,
    private expenseService: ExpensesService,
    private propertyservice: PropertyService,
    private translateService: TranslateService,
    private dialogService: DialogService,
    private fileservice:FileUploadService
  ) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('user') == undefined) {
      this.router.navigateByUrl('/');
    }
    this.returnCurrentRenter();
    this.getCurrentProperty();
    this.getDueDate();
    this.currentDate = new Date();
    this.EditRenterDetailsForm = this.formBuilder.group({
      lastName: [''],
      firstName: [''],
      email: [''],
      firstPhoneNumber: [''],
      cnp: [''],
      address: [''],
    });
    this.ProprtyDetailsForm = this.formBuilder.group({
      number_of_individuals: [''],
      county: [''],
      city: [''],
      address: [''],
      price: [''],
      surface: [''],
      floor: [''],
      partitioning: [''],
      rooms: [''],
    });
    this.languageUsed = 'romanian';
  }

  openModalDetails() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      currentRenter: this.currentRenter,
    };
    this.dialog.open(RenterDetailsComponent, dialogConfig);
  }

  openModalOwner() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      currentOwner: this.owner,
    };
    this.dialog.open(OwnerInfoComponent, dialogConfig);
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  getCurrentRenter() {
    this.renterService.getRentersFromUser().subscribe((renters) => {
      this.renters = renters;
    });
  }
  onWaterConsumptionIndexUpdate(new_index: number) {
    this.propertyservice.updateWaterConsumptionIndex(
      new_index,
      this.currentProperty.id
    );
  }
  onSelect(renter: Renter): void {
    this.selectedItem = renter;
  }
  onEditNumberOfIndividuals(numberToBeUsed: number) {
    this.renterService.updateCurrentRenterNumberOfIndividuals(numberToBeUsed);
  }
  getCurrentFiles() {
    var renterID = JSON.parse(sessionStorage.getItem('user')).uid;
    this.fileService.getFiles(renterID).subscribe((files) => {
      this.dataSource.data = files;
    });
  }

  changeLanguageToRomanian() {
    if (this.languageUsed != 'romanian') {
      this.translateService.use('ro');
      this.languageUsed = 'romanian';
    }
  }

  changeLanguageToEnglish() {
    if (this.languageUsed != 'english') {
      this.translateService.use('en');
      this.languageUsed = 'english';
    }
  }

  onLogout() {
    this.dialogService
      .openWarningDialog(
        this.translateService.instant(
          'rent-main-page.logout.confirmation-dialog.title'
        ),
        this.translateService.instant(
          'rent-main-page.logout.confirmation-dialog.message'
        ),
        true,
        true
      )
      .then((rez) => {
        if (rez) {
          sessionStorage.removeItem('ownerName');
          sessionStorage.removeItem('renterName');
          sessionStorage.removeItem('currentUserID');
          this.signInService.logout();
          this.router.navigateByUrl('');
        }
      });
  }

  getCurrentProperty(): void {
    this.renterService.getPropertyOfCurrentUser().subscribe((property) => {
      this.currentProperties = property;
      this.currentProperty = this.currentProperties[0];
      this.currentOwnerID = this.currentProperty.ownerID;
      this.getCurrentOwner();
      this.fileService.onFirstComponentButtonClick(this.currentProperty);
    });
  }

  getCurrentOwner() {
    var obsOwners = from(
      this.renterService.getCurrentOwner(this.currentProperty.ownerID)
    );
    obsOwners.subscribe((owner) => {
      this.owner = owner;
    });
  }

  returnCurrentRenter() {
    var obsOwners = from(this.renterService.getCurrentRenter());
    obsOwners.subscribe((renters) => {
      this.currentRenter = renters;
    });
  }

  waterIndexChanged(event) {
    try {
      this.currentProperty.water_consumption_index = event.target
        .value as number;
    } catch (ex) {
      console.error('Invalid water index format');
    }
  }

  rentPayment() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    if (day < +this.due_date) {
      currentDate.setDate(+this.due_date);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(+this.due_date);
    }
    return currentDate;
  }

  getDueDate() {
    this.renterService.getPropertyOfCurrentUser().subscribe((properties) => {
      this.properties = properties;
      this.due_date = this.properties[0].due_date;
      this.currentDate = this.rentPayment();
      return this.properties[0].due_date;
    });
  }

  getCurrentExpensesOfProperty(property: Property) {
    this.expenseService
      .getExpensesFromProperty(property)
      .subscribe((expenses) => {
        this.expenses = expenses;
      });
  }

  GetOwner_FullName(): String {
    if (this.owner) {
      var firstName = new String(' ' + this.owner.firstName);
      var lastName = new String(this.owner.lastName);
      this.fullName = lastName.concat(firstName.toString());
      return this.fullName;
    }
  }

  openSubjectList() {
    var renterID = JSON.parse(sessionStorage.getItem('user')).uid;
    sessionStorage.setItem('property', JSON.stringify(this.currentProperty));
    //sessionStorage.setItem('ownerName', this.owner.lastName);
    //sessionStorage.setItem('renterName', this.currentRenter.lastName);
    //sessionStorage.setItem('currentUserID', renterID);
    this.router.navigateByUrl('/subject-list');
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new Myfile(file);
        let today = new Date().toISOString().slice(0, 10);
        this.currentFileUpload.upload_date = today;
        this.fileservice
          .pushFileToStorage(this.currentFileUpload, this.currentProperty)
          .subscribe(
            (percentage) => {
              this.percentage = Math.round(percentage ? percentage : 0);
            },
            (error) => {
              console.log(error);
            }
          );
      }
    }
  }
}
