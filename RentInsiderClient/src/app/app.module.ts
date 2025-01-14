import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponentComponent } from './SignIn-SignUp/sign-in-component/sign-in-component.component';
import { SignUpComponentComponent } from './SignIn-SignUp/sign-up-component/sign-up-component.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { SignUpServiceService } from './Services/signUpService/sign-up-service.service';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { componentFactoryName } from '@angular/compiler';
import { OwnerMainPageComponent } from './OwnerComponents/owner-main-page/owner-main-page.component';
import { AddPropertyComponent } from './OwnerComponents/add-property/add-property.component';
import { AppBootstrapModule } from './app-bootstrap.module';
import { RenterComponent } from './OwnerComponents/renter/renter.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { RentMainPageComponent } from './RenterComponents/rent-main-page/rent-main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { PropertyDetailComponent } from './OwnerComponents/property-detail/property-detail.component';
import { InfoRenterComponent } from './OwnerComponents/info-renter/info-renter.component';
import { OwnerDetailsComponent } from './CommonComponents/owner-details/owner-details.component';
import { RenterDetailsComponent } from './RenterComponents/renter-details/renter-details.component';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { AddSubjectComponent } from './add-subject/add-subject.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { FileUploadService } from './Services/fileService/file.service';
import { UploadDetailComponent } from './CommonComponents/upload-detail/upload-detail.component';
// import { ExpensesDetailComponent } from './CommonComponents/expenses-detail/expenses-detail.component';
import { AddExpensesComponent } from './CommonComponents/add-expenses/add-expenses.component';
import { ExpensesService } from './Services/expensesService/expenses.service';
import { OwnerInfoComponent } from './RenterComponents/owner-info/owner-info.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DatePipe } from '@angular/common';
import { SubjectsService } from './Services/subjectService/subjects.service';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RenterAlertSuccessComponent } from './OwnerComponents/renter-alert-success/renter-alert-success.component';
import { UserGuideComponent } from './user-guide/user-guide.component';

const routes: Routes = [
  { path: '', component: SignInComponentComponent },
  { path: 'sign-in-component', component: SignInComponentComponent },
  { path: 'sign-up-component', component: SignUpComponentComponent },
  { path: 'owner-main-page', component: OwnerMainPageComponent },
  { path: 'renter', component: RenterComponent },
  { path: 'rent-main-page', component: RentMainPageComponent },
  { path: 'add-property', component: AddPropertyComponent },
  { path: 'propery-derail', component: PropertyDetailComponent },
  { path: 'info-renter', component: InfoRenterComponent },
  { path:'user-guide',component:UserGuideComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    SignInComponentComponent,
    SignUpComponentComponent,
    OwnerMainPageComponent,
    RentMainPageComponent,
    AddPropertyComponent,
    RenterComponent,
    RenterAlertSuccessComponent, // success alert on submitting add renter from RenterComponent
    RentMainPageComponent,
    PropertyDetailComponent,
    InfoRenterComponent,
    OwnerDetailsComponent,
    RenterDetailsComponent,
    SubjectListComponent,
    AddSubjectComponent,
    ChatRoomComponent,
    UploadDetailComponent,
    AddExpensesComponent,
    OwnerInfoComponent,
    UserGuideComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatSnackBarModule,
    MatSidenavModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ro',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [RouterModule],
  providers: [
    SignUpServiceService,
    FileUploadService,
    ExpensesService,
    SubjectsService,
    BsModalService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
  entryComponents: [RenterAlertSuccessComponent]
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


