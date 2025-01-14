import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserGuideComponent } from './user-guide/user-guide.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: "sign-up",
    loadChildren: () => import('./Auth/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: "sign-in",
    loadChildren: () => import('./Auth/sign-in/sign-in.module').then(m => m.SignInPageModule)
  },
  {
    path: 'owner-main-menu-page',
    loadChildren: () => import('./Owner/owner-main-menu-page/owner-main-menu-page.module').then( m => m.OwnerMainMenuPageModule)
  },
  {
    path: 'property-detail',
    loadChildren: () => import('./Owner/property-detail/property-detail.module').then( m => m.PropertyDetailPageModule)
  },
  {
   path: 'rent-main',
   loadChildren: () => import('./Renter/rent-main/rent-main.module').then( m => m.RentMainPageModule)
  },  
  {
    path: 'renter-edit',
    loadChildren: () => import('./Renter/renter-edit/renter-edit.module').then( m => m.RenterEditPageModule)
  },
  {
    path: 'chatroom',
    loadChildren: () => import('./Chat/chatroom/chatroom.module').then( m => m.ChatroomPageModule)
  },
  {
    path: 'chatroom-menu',
    loadChildren: () => import('./Chat/chatroom-menu/chatroom-menu.module').then( m => m.ChatroomMenuPageModule)
  },
  {
    path: 'owner-details',
    loadChildren: () => import('./Renter/owner-details/owner-details.module').then( m => m.OwnerDetailsPageModule)
  },
  {
    path: 'owner-edit',
    loadChildren: () => import('./Owner/owner-edit/owner-edit.module').then( m => m.OwnerEditPageModule)
  },
  {
   path: 'rent-main',
   loadChildren: () => import('./Renter/rent-main/rent-main.module').then( m => m.RentMainPageModule)
  },  
  {
    path: 'renter-edit',
    loadChildren: () => import('./Renter/renter-edit/renter-edit.module').then( m => m.RenterEditPageModule)
  },
  {
    path: 'chatroom',
    loadChildren: () => import('./Chat/chatroom/chatroom.module').then( m => m.ChatroomPageModule)
  },
  {
    path: 'chatroom-menu',
    loadChildren: () => import('./Chat/chatroom-menu/chatroom-menu.module').then( m => m.ChatroomMenuPageModule)
  },
  {
    path: 'owner-details',
    loadChildren: () => import('./Renter/owner-details/owner-details.module').then( m => m.OwnerDetailsPageModule)
  },
  {
    path: 'add-property',
    loadChildren: () => import('./Owner/add-property/add-property.module').then( m => m.AddPropertyPageModule)
  },
  {
    path: 'renter-detail',
    loadChildren: () => import('./Owner/renter-detail/renter-detail.module').then( m => m.RenterDetailPageModule)
  },
  {
    path: 'add-subject',
    loadChildren: () => import('./Chat/add-subject/add-subject.module').then( m => m.AddSubjectPageModule)
  },
  {
    path: 'expenses',
    loadChildren: () => import('./ExpensesAndFiles/expenses/expenses.module').then( m => m.ExpensesPageModule)
  },
  {
    path: 'expense-details',
    loadChildren: () => import('./ExpensesAndFiles/expense-details/expense-details.module').then( m => m.ExpenseDetailsPageModule)
  },
  {
    path: 'add-expense',
    loadChildren: () => import('./ExpensesAndFiles/add-expense/add-expense.module').then( m => m.AddExpensePageModule)
  },
  {
    path: 'add-renter',
    loadChildren: () => import('./Owner/add-renter/add-renter.module').then( m => m.AddRenterPageModule)
  },
  {
    path:'user-guide',
    // loadChildren: () => import('./user-guide/user-guide.module').then( m => m.UserGuideModule)
    component: UserGuideComponent
  },
  {
    path: 'rent-main-menu-page',
    loadChildren: () => import('./Renter/rent-main-menu/rent-main-menu.module').then( m => m.RentMainMenuPageModule)
  },
  {
    path: 'uploaded-files',
    loadChildren: () => import('./ExpensesAndFiles/uploaded-files/uploaded-files.module').then( m => m.UploadedFilesPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
