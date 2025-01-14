import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatroomMenuPageRoutingModule } from './chatroom-menu-routing.module';

import { ChatroomMenuPage } from './chatroom-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatroomMenuPageRoutingModule
  ],
  declarations: [
    
  ]
})
export class ChatroomMenuPageModule {}
