import { Component, OnInit, Input, Inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TemplateRef } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Counties } from '../counties-cities-Romania/judete';
import { ExpensesService } from '../../Services/expensesService/expenses.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validator } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Expense, ServiceExpenses } from '../../Models/expense';
import { Property } from '../../Models/property';
import { Duration } from '../../Models/duration';
import { Myfile } from '../../Models/fileupload';
import { FileUploadService } from '../../Services/fileService/file.service';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddExpensesComponent implements OnInit {
  selectedFiles?: FileList;
  currentFileUpload?: Myfile;
  nu: 0;
  percentage = 0;
  expense: Expense;
  ExpenseFormGroup: FormGroup;
  submitted = false;
  valid = false;
  selectedProperty: Property;
  formResult: any;
  selectedExpense: {
    due: boolean;
    consumed: string;
    date_of_submition: string;
    pdf: string;
    service: string;
    duration: Duration;
    sum: string;
    type: string;
  };
  constructor(
    private modalService: BsModalService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddExpensesComponent>,
    public expenseService: ExpensesService,
    private formBuilder: FormBuilder,
    private fileService: FileUploadService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.selectedProperty === undefined) {
      this.selectedProperty = {
        title: '',
        surface: 0,
        price: 0,
        partitioning: null,
        floor: 0,
        county: '',
        water_consumption_index: 0,
        city: '',
        address: '',
        number_of_rooms: 0,
        ownerID: '',
        id: '',
        type: '',
        due_date: 0,
        renterID: '',
      };
    } else {
      this.selectedProperty = data.selectedProperty;
    }
  }

  ngOnInit(): void {
    this.dialogRef.updatePosition();
    this.initializeFormGroup();
  }

  initializeFormGroup() {
    this.ExpenseFormGroup = this.formBuilder.group({
      due: true,
      consumed: ['', [Validators.required, Validators.min(0)]],
      date_of_submition: '',
      pdf: '',
      service: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      sum: [0, Validators.required],
      type: ['', Validators.required],
      additionalServiceName: '',
    });
  }

  public modalRef: BsModalRef;
  public openModalExpense(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  get getForm() {
    return this.ExpenseFormGroup.controls;
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
        this.fileService
          .pushFileToStorage(this.currentFileUpload, this.data.selectedProperty)
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

  /**
   * This is a getter to have ServiceExpenses enum in the current component's template
   */
  get serviceExpenses(): typeof ServiceExpenses {
    return ServiceExpenses;
  }

  onSubmit() {
    console.log(this.ExpenseFormGroup);
    console.log('=====================');
    console.log(this.ExpenseFormGroup.valid);

    if (this.ExpenseFormGroup.valid) {
      const today = new Date().toISOString().slice(0, 10);
      let expenseToBeAdded = this.ExpenseFormGroup.value;
      expenseToBeAdded.service =
        expenseToBeAdded.service === 'Altele'
          ? expenseToBeAdded.additionalServiceName
          : expenseToBeAdded.service;
      expenseToBeAdded.date_of_submition = today;

      // no files selected
      if (!this.selectedFiles) {
        this.expenseService.addExpenseWithoutDocument(
          this.data.currentRenter,
          expenseToBeAdded
        );
      } else {
        // a file was selected
        const file: File | null = this.selectedFiles.item(0);
        this.selectedFiles = undefined;

        if (file) {
          this.currentFileUpload = new Myfile(file);
          this.currentFileUpload.upload_date = today;
          this.expenseService.addDocumentedExpense(
            this.currentFileUpload,
            expenseToBeAdded,
            this.data.currentRenter
          );
        }
      }
      this.dialogRef.close();
    }
  }
}
