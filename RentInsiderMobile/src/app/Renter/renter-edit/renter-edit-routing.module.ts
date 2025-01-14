import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenterEditPage } from './renter-edit.page';

const routes: Routes = [
  {
    path: '',
    component: RenterEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenterEditPageRoutingModule {}
