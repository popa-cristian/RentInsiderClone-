import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RenterEditPageRoutingModule } from './renter-edit-routing.module';

import { RenterEditPage } from './renter-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RenterEditPageRoutingModule
  ],
  declarations: [
    
  ]
})
export class RenterEditPageModule {}
