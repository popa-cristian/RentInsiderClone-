import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerMainMenuPage } from './owner-main-menu-page.page';

const routes: Routes = [
  {
    path:'',
    redirectTo:'/owner-main-menu-page/property-detail',
    pathMatch:'full'
  },
  {
    path: '',
    component: OwnerMainMenuPage,
    children:[
      {
        path: 'property-detail',
        loadChildren: () => import('../property-detail/property-detail.module').then( m => m.PropertyDetailPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerMainPageMenuRoutingModule {}
