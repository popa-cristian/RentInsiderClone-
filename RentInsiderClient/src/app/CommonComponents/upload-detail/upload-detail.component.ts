import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Myfile } from '../../Models/fileupload';
import { FileUploadService } from '../../Services/fileService/file.service';
import { AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Property } from '../../Models/property';
import { Owner } from '../../Models/owner';
import { PropertyService } from '../../Services/propertyService/property.service';
import { Renter } from '../../Models/renter';
import { RenterDBService } from '../../Services/renterDbService/renter-db.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';

import { AddExpensesComponent } from '../add-expenses/add-expenses.component';

import { from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { SignInServiceService } from '../../Services/signInService/sign-in-service.service';
import { Expense, ServiceExpenses } from '../../Models/expense';
import { ExpensesService } from '../../Services/expensesService/expenses.service';
import { Duration } from '../../Models/duration';
import { DialogService } from 'src/app/Services/dialogService/dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-detail',
  templateUrl: './upload-detail.component.html',
  styleUrls: ['./upload-detail.component.css'],
})
export class UploadDetailComponent implements OnInit, AfterViewInit {
  name: string;
  url: string;
  id: string;
  upload_date: Date;
  ID: string;
  displayedColumns: string[] = ['date', 'name', 'url', 'ID'];

  due: boolean;
  consumed: string;
  date_of_submition: string;
  pdf: string;
  duration: Duration;
  start: string;
  end: string;
  service: string;
  sum: string;
  type: string;
  propertyID: string;
  checked = false;
  indeterminate = false;

  pay: boolean;
  displayedColumns_expenses: string[] = [
    'due',
    'service',
    'sum',
    'type',
    'consumed',
    'date_of_submition',
    'pdf',
    'pay',
  ];
  dataSource: MatTableDataSource<any>;
  dataSource_expenses: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource_expenses.paginator = this.paginator;
  }
  properties: Property[] = [];
  owners: Owner[];
  selectedItem?: Property;
  selectedRenters: Renter[];
  selectedRenter: Renter;
  ownerUserData;
  renters: Renter[];
  renter: Renter;
  currentRenter: Renter;
  submitted = false;
  item: any;
  currentSum: any;
  selected_renter: any;
  public modalRef: BsModalRef;
  fileToDelete: Myfile;
  fileToDelete_ID: string;
  currentOwner: Owner;
  currentProperty: Property;
  renterExists = false;

  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private propertyService: PropertyService,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    public dialog: MatDialog,
    private signinservice: SignInServiceService,
    private router: Router,
    private renterService: RenterDBService,
    private fileService: FileUploadService,
    private expenseService: ExpensesService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dialogService: DialogService,
    private translateService: TranslateService
  ) {}
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatTable) expenses_table: MatTable<any>;

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource_expenses = new MatTableDataSource();

    if (this.fileService.subsVar == undefined) {
      this.fileService.subsVar =
        this.fileService.invokeFirstComponentFunction.subscribe(
          (property: Property) => {
            this.currentProperty = property;
            if (property != undefined) this.onPress(property);
          }
        );
    }
  }

  updateDue(expense: Expense) {
    this.expenseService.changeStatusOfExpense(expense);
  }

  openModalExpense() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      currentRenter: this.currentRenter,
    };
    this.dialog.open(AddExpensesComponent, dialogConfig);
  }

  showHide(element) {
    element.due = element.due ? false : true;
  }

  getCurrentFilesOfRenter(property: Property) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];

    this.fileService
      .getFilesOfRenter(property.ownerID, property.renterID)
      .subscribe((files) => {
        this.dataSource = new MatTableDataSource(files);
        this.changeDetectorRefs.detectChanges();
      });
  }

  /**
   * This is a getter function so we can access ServiceExpenses type in the template
   */
  get serviceExpenses(): typeof ServiceExpenses {
    return ServiceExpenses;
  }

  getCurrentExpensesOfProperty(property: Property) {
    this.dataSource_expenses = new MatTableDataSource();
    this.dataSource_expenses.data = [];
    if (property.renterID != '') {
      this.expenseService
        .getExpensesFromProperty(property)
        .subscribe((expenses) => {
          this.dataSource_expenses = new MatTableDataSource(expenses);
          this.currentSum =
            this.expenseService.getSumOfUnpaidExpenses(expenses);
        });
    }
  }

  getFileByID(id: string) {
    this.fileToDelete_ID = id;
    var filepromise = from(this.fileService.getFilebyID(id));
    filepromise.subscribe((filepromises) => {
      this.fileToDelete = filepromises;
    });
  }

  getRenterOfProperty(property: Property) {
    var obsrenter = from(this.renterService.getRenterOfProperty(property));
    obsrenter.subscribe((renters) => {
      this.currentRenter = renters;
    });
  }

  onPress(property: Property) {
    this.renterExists = false;
    if (property.renterID != '') {
      this.renterExists = true;
      this.getCurrentFilesOfRenter(property);
      this.getCurrentExpensesOfProperty(property);
      this.currentProperty = property;
      this.getRenterOfProperty(this.currentProperty);
    } else {
      this.dataSource = new MatTableDataSource();
      this.dataSource_expenses = new MatTableDataSource();
    }
    this.changeDetectorRefs.detectChanges();
  }

  deleteFile(file: Myfile) {
    this.dialogService.openWarningDialog(
      this.translateService.instant("upload-detail.delete-file.warning.title"),
      this.translateService.instant("upload-detail.delete-file.warning.message"),
      true,true
    ).then((res) => {
      if (res) {
        this.fileService.deleteFile(file, file.id);
        this.dialogService.openSuccessDialog(
          this.translateService.instant("upload-detail.delete-file.success.title"),
          this.translateService.instant("upload-detail.delete-file.success.title")
        )
      }
    });
  }

  filterExpenses(filter) {
    this.dataSource_expenses.filter = filter;
    this.dataSource_expenses._filterData(this.dataSource_expenses.data);
  }

  ngOnDestroy() {
    this.fileService.subsVar = undefined;
  }
}
