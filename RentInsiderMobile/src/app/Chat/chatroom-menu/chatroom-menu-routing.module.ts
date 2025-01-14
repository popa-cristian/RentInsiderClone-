import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatroomMenuPage } from './chatroom-menu.page';

const routes: Routes = [
  {
    path:'',
    redirectTo:'/chatroom-menu/chatroom',
    pathMatch:'full'
  },
  {
    path: '',
    component: ChatroomMenuPage,
    children:[
      {
        path:'chatroom',
        loadChildren: () => import('../chatroom/chatroom.module').then(m => m.ChatroomPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatroomMenuPageRoutingModule {}
