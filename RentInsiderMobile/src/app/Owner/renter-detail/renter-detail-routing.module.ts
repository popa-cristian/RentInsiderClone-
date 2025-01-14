import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenterDetailPage } from './renter-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RenterDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenterDetailPageRoutingModule {}
