import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuideComponent } from './user-guide.component';

const routes: Routes = [
  {
  path:' ',
  component:UserGuideComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserGuideRoutingModule { }
