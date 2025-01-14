import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RentMainPage } from '../rent-main/rent-main.page';

import { RentMainMenuPage } from './rent-main-menu.page';

const routes: Routes = [
  {
    path:'',
    redirectTo:'/rent-main-menu-page/rent-main',
    pathMatch:'full'
  },
  {
    path: '',
    component: RentMainMenuPage,
    children:[
      {
        path: 'rent-main',
        loadChildren: () => import('../rent-main/rent-main.module').then( m => m.RentMainPageModule)
      },
      {
        path: '',
        redirectTo:'rent-main',
        pathMatch:'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentMainMenuPageRoutingModule {}
