import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { OwnerMainPageComponent } from './OwnerComponents/owner-main-page/owner-main-page.component';
import { SubjectListComponent } from './subject-list/subject-list.component';

const routes: Routes = [
  { path: 'subject-list', component: SubjectListComponent},
  { path: 'owner-main-page', component: OwnerMainPageComponent},
  {path: 'chatroom', component: ChatRoomComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
