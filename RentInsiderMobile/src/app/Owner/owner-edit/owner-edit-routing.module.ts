import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerEditPage } from './owner-edit.page';

const routes: Routes = [
  {
    path: '',
    component: OwnerEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerEditPageRoutingModule {}
