import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerDetailsPage } from './owner-details.page';

const routes: Routes = [
  {
    path: '',
    component: OwnerDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerDetailsPageRoutingModule {}
