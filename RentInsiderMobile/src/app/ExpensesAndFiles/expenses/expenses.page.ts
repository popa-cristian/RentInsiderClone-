import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { from } from 'rxjs';
import {Location} from '@angular/common';
import { Property } from 'src/app/Models/property';
import { Expense, ServiceExpenses } from 'src/app/Models/expense';
import { Myfile } from 'src/app/Models/fileupload';
import { PropertyService } from 'src/app/Services/property.service';
import { FileUploadService } from 'src/app/Services/file.service';
import { ExpensesService } from 'src/app/Services/expense.service';

// used to check in the html if the expense is a custom one
// import { expenseTypes } from 'src/app/Models/expense';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit {

  currentProperty:Property;
  currentPropertyID:string;
  expenses:Expense[];
  files:Myfile[];
  totalToBePaid:number;
  currentExpense:Expense;
  currentExpenseID:string;

  // forward declaration for the html
  serviceExpenses = ServiceExpenses;

  constructor(
    private activatedRoute:ActivatedRoute,
    private propertyService:PropertyService,
    private fileService:FileUploadService,
    private expenseService:ExpensesService,
    private changeDetectorRef:ChangeDetectorRef,
    private location:Location,
    private router:Router,
  ) { }

  ngOnInit() {
    this.currentPropertyID = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.currentPropertyID!=null){
      this.getCurrentPropertyInfo(this.currentPropertyID);
    }else;
  }

  getCurrentExpense(expenseID:string){
    from(this.expenseService.getExpenseByID(expenseID)).subscribe(expense=>{
      this.currentExpense=expense;
      this.currentExpense.id=this.currentExpenseID;
      this.changeDetectorRef.detectChanges();
    });
  }
  getExpenseStatus(status:boolean){
    if(status===false)
      return "Achitat";
    else 
      return "Neachitat";
  }

  getCurrentPropertyInfo(propertyID:string){
    from(this.propertyService.getPropertyByID(this.currentPropertyID)).subscribe(property=>{
      this.currentProperty=property;
      this.currentProperty.id=this.currentPropertyID;
      this.getFilesOfCurrentProperty(this.currentProperty);
      this.getExpensesOfCurrentProperty(this.currentProperty);
    })
  }

  getFilesOfCurrentProperty(property:Property){
    if(property.renterID!=''){
      this.fileService.getFilesOfRenter(property.ownerID,property.renterID).subscribe(files=>{
        this.files=files;
        this.changeDetectorRef.detectChanges();
      })
    }  
  }

  getExpensesOfCurrentProperty(property:Property){
    if(property.renterID!='')
    {
      this.expenseService.getExpensesFromProperty(property).subscribe(expenses=>{
        this.expenses=expenses;
        this.totalToBePaid=this.expenseService.getSumOfUnpaidExpenses(expenses);   
        this.changeDetectorRef.detectChanges();
      })
    }
  }

  expandExpense(expense:Expense){
    this.router.navigate(['/expense-details', { id: expense.id }]);
  }

  addExpenseCommand(){
    let navigationExtras: NavigationExtras = {
      state: {
        currentProperty: this.currentProperty,
      }
    };
    this.router.navigate(['/add-expense'], navigationExtras);
  }

  previousPage(){
    this.location.back();
  }

  appropriateIcon(expense: Expense){
    let iconName;
    switch(expense.service) { 
      case ServiceExpenses.gas: { 
          iconName="flame-outline";
          break; 
      }
      case ServiceExpenses.water: { 
        iconName="water-outline";
        break; 
      }
      case ServiceExpenses.rent: { 
        iconName="home-outline";
        break; 
      }
      case ServiceExpenses.internet: { 
        iconName="globe-outline";
        break; 
      }
      case ServiceExpenses.electricity: { 
        iconName="flash-outline";
        break; 
      }  
      default: { 
        iconName="reader-outline";
        break; 
      } 
    }
    return iconName; 
  }

}
