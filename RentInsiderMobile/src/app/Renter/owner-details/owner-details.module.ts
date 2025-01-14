import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OwnerDetailsPageRoutingModule } from './owner-details-routing.module';

import { OwnerDetailsPage } from './owner-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OwnerDetailsPageRoutingModule
  ],
  declarations: [
    
  ]
})
export class OwnerDetailsPageModule {}
