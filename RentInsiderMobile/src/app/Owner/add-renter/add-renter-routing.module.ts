import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRenterPage } from './add-renter.page';

const routes: Routes = [
  {
    path: '',
    component: AddRenterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRenterPageRoutingModule {}
