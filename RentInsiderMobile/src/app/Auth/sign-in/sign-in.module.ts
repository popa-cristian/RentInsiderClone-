import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignInPage } from './sign-in.page';
import { IonicModule } from '@ionic/angular';


import { ReactiveFormsModule } from '@angular/forms';
import { SignInPageRoutingModule } from './sign-in-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SignInPageRoutingModule
  ],
  declarations: [
    
  ]
})
export class SignInPageModule { }
