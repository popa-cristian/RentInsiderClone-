import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentMainPage } from './rent-main.page';

const routes: Routes = [
  {
    path: '',
    component: RentMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentMainPageRoutingModule {}
