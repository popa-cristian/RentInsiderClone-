import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { Expense } from 'src/app/Models/expense';
import { ExpensesService } from 'src/app/Services/expense.service';
import { ServiceExpenses } from 'src/app/Models/expense';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.page.html',
  styleUrls: ['./expense-details.page.scss'],
})
export class ExpenseDetailsPage implements OnInit {

  currentExpenseID: string;
  currentExpense: Expense;

  // forward declaration for the html
  serviceExpenses = ServiceExpenses;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    private expenseService: ExpensesService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.currentExpenseID = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.currentExpenseID!=null)
      this.getCurrentExpense(this.currentExpenseID);    
  }

  getCurrentExpense(expenseID: string){
    from(this.expenseService.getExpenseByID(expenseID)).subscribe(expense=>{
      this.currentExpense = expense;
      this.currentExpense.id = this.currentExpenseID;
      this.changeDetectorRef.detectChanges();
    });
  }

  openSelectedFile(filePath:string){
    window.open(filePath,"blank");
  }

  changeExpenseStatus() {
    // change status and reload expense information

    this.showLoadingModal();

    this.expenseService
      .changeStatusOfExpense(this.currentExpense)
      .then(() => {
        this.getCurrentExpense(this.currentExpenseID);
        swal.close();
      })
      .catch(err => {
        if (err) {
          swal.close();
          this.showErrorModal();
        }
      })
  }

  // modals to inform user about expense payment status
  showLoadingModal() {
    swal({
      title: this.translateService.instant('expense-details.loading-modal-title'),
      text: this.translateService.instant('expense-details.loading-modal-text'),
      icon: 'warning',
      buttons: [false],
      closeOnClickOutside: false
    });
  }

  showErrorModal() {
    swal({
      title: this.translateService.instant('expense-details.error-modal-title'),
      text: this.translateService.instant('expense-details.error-modal-text'),
      icon: 'error'
    })
  }

  previousPage(){
    this.location.back();
  }

}
