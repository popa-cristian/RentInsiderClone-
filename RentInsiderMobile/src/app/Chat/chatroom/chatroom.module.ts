import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ChatroomPageRoutingModule } from './chatroom-routing.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ChatroomPageRoutingModule
  ],
  declarations: []
})
export class ChatroomPageModule {}
