import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OwnerMainPageMenuRoutingModule } from './owner-main-menu-page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OwnerMainPageMenuRoutingModule,
  ],
  declarations: []
})
export class OwnerMainMenuPageModule {}
