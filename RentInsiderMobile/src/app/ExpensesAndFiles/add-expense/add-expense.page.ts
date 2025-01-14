import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpensesService } from 'src/app/Services/expense.service';
import { Myfile } from 'src/app/Models/fileupload';
import { Expense, ServiceExpenses } from 'src/app/Models/expense';
import { Renter } from 'src/app/Models/renter';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from 'src/app/Models/property';
import { RenterDBService } from 'src/app/Services/renter-db.service';
import { from } from 'rxjs';

// for invalid/saved modal popup
import swal from 'sweetalert';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
})
export class AddExpensePage implements OnInit {

  selectedFiles?: FileList;
  currentFileUpload?: Myfile;
  expense:Expense;
  ExpenseFormGroup: FormGroup;
  hasDocument: boolean;
  currentRenter: Renter;
  currentProperty:Property;

  constructor(
    private location:Location,
    private expenseService:ExpensesService,
    private formBuilder:FormBuilder,
    private activatedRoute:ActivatedRoute, 
    private router:Router,
    private renterService:RenterDBService,
    private translateService: TranslateService // for checking language in use
  ) {
    this.activatedRoute.queryParams.subscribe(params =>{
      if(this.router.getCurrentNavigation().extras.state){
        this.currentProperty = this.router.getCurrentNavigation().extras.state.currentProperty;
      }
    });
   }

  ngOnInit() {
    this.initializeFormGroup();
    this.getRenter(this.currentProperty.renterID);
  }

  initializeFormGroup(){
    this.hasDocument=false;
    this.ExpenseFormGroup = this.formBuilder.group({
      due: true,
      consumed: ['', Validators.required],
      date_of_submition: '',
      pdf: '',
      service: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      sum: [0, Validators.required],
      type: ['', Validators.required],
    });
  }

  /**
   * Getter function to have ServiceExpenses type in template
   */
  get serviceExpenses(): typeof ServiceExpenses
  {
    return ServiceExpenses;
  }

  getRenter(id:string){
    from(this.renterService.getRenterByID(id)).subscribe(renter=>{
      this.currentRenter=renter;
      this.currentRenter.id=id;
    })
  }

  selectFile(event: any): void {
    this.hasDocument=true;
    this.selectedFiles = event.target.files;
  }

  PreviousPage(){
    this.location.back();
  }

  // show an error/success modal, title should be in the correct language
  // there must be a more modular way of setting the language
  showInvalidModal() {
    let modalTitle: string;
    switch(this.translateService.currentLang) {
      case 'roMobile':
        modalTitle = 'Formular invalid !';
        break;
      case 'enMobile':
        modalTitle = 'Invalid form !';
        break;
    }
    swal({
      title: modalTitle,
      icon: 'error'
    })
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

  onSubmit(){
    if (this.ExpenseFormGroup.valid) {
      let today = new Date().toISOString().slice(0, 10);
      const expenseToBeAdded = this.ExpenseFormGroup.value;

      if(expenseToBeAdded.service == 'Altele')
        expenseToBeAdded.service = expenseToBeAdded.additionalServiceName;
      
      expenseToBeAdded.date_of_submition = today;
      
      // cut time from ISO date string
      expenseToBeAdded.start = expenseToBeAdded.start.substring(0, 10);
      expenseToBeAdded.end = expenseToBeAdded.end.substring(0, 10);
      
      // should wait for the asynchronous firebase methods (addExpenseWithoutDocument, addDocumentedExpense)
      // to return with success, and show the modal after, but the service doesn't return a promise,
      // and changing it could cause problems in other components.
      // if the database method fails, the success modal will still be shown. :/
      if (this.hasDocument === false) {
        this.expenseService.addExpenseWithoutDocument(this.currentRenter, expenseToBeAdded);

        // show modal and redirect to list of expenses
        this.showSuccessModal();
        this.PreviousPage();
      }
      else {
        if (this.selectedFiles) {
          const file: File | null = this.selectedFiles.item(0);
          this.selectedFiles = undefined;

          if (file) {
            this.currentFileUpload = new Myfile(file);
            this.currentFileUpload.upload_date = today;
            this.expenseService.addDocumentedExpense(this.currentFileUpload, expenseToBeAdded, this.currentRenter);
              
            // show modal and redirect to list of expenses
            this.showSuccessModal();
            this.PreviousPage();          
          }
          this.hasDocument = false;
        }
      }
    } else {
      // invalid form
      this.showInvalidModal();
    }
  }
}
