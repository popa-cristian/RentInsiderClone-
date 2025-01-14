import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Property } from '../../Models/property';
import { PropertyService } from '../../Services/propertyService/property.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AddPropertyComponent } from '../add-property/add-property.component';
import { Owner } from '../../Models/owner';
import { RenterComponent } from '../renter/renter.component';
import { Renter } from '../../Models/renter';
import { FileUploadService } from '../../Services/fileService/file.service';
import { Myfile } from '../../Models/fileupload';
import { InfoRenterComponent } from '../info-renter/info-renter.component';
import { RenterDBService } from '../../Services/renterDbService/renter-db.service';
import { FormBuilder, FormGroup, Validator } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Expense } from '../../Models/expense';
import { ExpensesService } from '../../Services/expensesService/expenses.service';
import { SubjectsService } from '../../Services/subjectService/subjects.service';
import { AddExpensesComponent } from '../../CommonComponents/add-expenses/add-expenses.component';
import { Router } from '@angular/router';
import { OwnerService } from 'src/app/Services/ownerService/owner.service';
import swal from 'sweetalert';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css'],
})
export class PropertyDetailComponent implements OnInit {
  public modalRef: BsModalRef;
  properties: Property[];
  renters: Renter[];
  ProprtyForm: FormGroup;
  submitted = false;
  @Input() item: Property;
  @Input() selected_renter: Renter;
  today: any;
  displayedColumns: string[] = ['id', 'date', 'name', 'url', 'ID'];
  dataSource = new MatTableDataSource();
  constructor(
    private modalService: BsModalService,
    private propertyService: PropertyService,
    public dialog: MatDialog,
    private renterservice: RenterDBService,
    private formBuilder: FormBuilder,
    private fileservice: FileUploadService,
    private expenseService: ExpensesService,
    private ownerService: OwnerService,
    private router: Router,
    private readonly translateService: TranslateService
  ) {}
  selectedProperty: Property;
  renterofselectedProperty: Renter;
  fullName: String;
  expenses: Expense[];

  selectedFiles?: FileList;
  currentFileUpload?: Myfile;
  percentage = 0;

  ngOnInit() {
    this.dataSource.data = [];
    this.ProprtyForm = this.formBuilder.group({
      renter: [''],
      address: [''],
      city: [''],
      county: [''],
      floor: [''],
      rooms: [''],
      due_date: [''],
      partitioning: [''],
      price: [''],
      surface: [''],
    });
    function inforenterComponent(inforenterComponent: any, dialogConfig: any) {
      throw new Error('Function not implemented.');
    }
  }

  getPropertiesFromService() {
    this.propertyService.getPropertiesFromUser().subscribe((properties) => {
      this.properties = properties;
    });
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  deleteRenter(renterID: string, propertyID: string) {
    this.renterservice.deleteRenter(renterID, propertyID);
  }

  // delete property
  deleteProperty(renter: Renter, property: Property) {
    swal({
      title: this.translateService.instant('property-detail.delete-property-modal-title'),
      icon: 'warning',
      buttons: [this.translateService.instant('property-detail.delete-modal-cancel'),
                this.translateService.instant('property-detail.delete-modal-delete')],
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        try {
          if (renter)
          {
            this.renterservice.deleteRenter(renter.id, property.id);
          }
          this.propertyService.deleteProperty(property);
        } catch (err) {
          swal({
            title: this.translateService.instant('property-detail.delete-modal-error'),
            icon: 'error'
          });
        }
      }
    });
  }

  openModalinforenter() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      selectedProperty: this.item,
      item: this.selected_renter,
    };
    this.dialog.open(InfoRenterComponent, dialogConfig);
  }

  openModalForEdit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      selectedProperty: this.item,
    };
    this.dialog.open(AddPropertyComponent, dialogConfig);
  }

  openModalExpense() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      currentRenter: this.selected_renter,
    };
    this.dialog.open(AddExpensesComponent, dialogConfig);
  }

  openModal1() { // i suppose this is for addRenter. Yep, you're right.
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      selectedProperty: this.item,
      renterofselectedProperty: this.selected_renter,
    };
    this.dialog.open(RenterComponent, dialogConfig);
  }

  getOwnerName(currentOwner: Owner) {
    return currentOwner.lastName;
  }

  async openSubjectComponent() {
    const currentOwner = this.ownerService.getCurrentOwner();
    const ownerName: string = this.getOwnerName(await currentOwner);
    const ownerID: string = JSON.parse(sessionStorage.getItem('user')).uid;
    //sessionStorage.setItem('ownerName', ownerName);
    //sessionStorage.setItem('renterName', this.selected_renter.lastName);
    sessionStorage.setItem('property', JSON.stringify(this.item));
    //sessionStorage.setItem('currentUserID', ownerID);
    this.router.navigate(['/subject-list']);
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
          .pushFileToStorage(this.currentFileUpload, this.item)
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

  getCurrentFiles() {
    var ownerID = JSON.parse(sessionStorage.getItem('user')).uid;

    this.fileservice.getFilesBelongingtoOwner(ownerID).subscribe((files) => {
      this.dataSource.data = files;
    });
  }

  getCurrentExpenses() {
    var ownerID = JSON.parse(sessionStorage.getItem('user')).uid;
    this.expenseService
      .getExpensesFromProperty(this.item)
      .subscribe((expenses) => {
        this.expenses = expenses;
      });
  }

  getFullName(): String {
    if (this.selected_renter) {
      var firstName = new String(' ' + this.selected_renter.firstName);
      var lastName = new String(this.selected_renter.lastName);
      this.fullName = lastName.concat(firstName.toString());
      return this.fullName;
    }
  }
}
