import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddExpensePageRoutingModule } from './add-expense-routing.module';

import { AddExpensePage } from './add-expense.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddExpensePageRoutingModule
  ],
  declarations: [
    
  ]
})
export class AddExpensePageModule {}
