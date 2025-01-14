import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SubjectsService } from './Services/subjects.service';
import { ExpensesService } from './Services/expense.service';
import { FileUploadService } from './Services/file.service';
import { SignUpServiceService } from './Services/sign-up-service.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// app components
// they need to be exported for the ngx-translate pipe to work
import { SignInPage } from './Auth/sign-in/sign-in.page';
import { SignUpPage } from './Auth/sign-up/sign-up.page';
import { AddSubjectPage } from './Chat/add-subject/add-subject.page';
import { ChatroomPage } from './Chat/chatroom/chatroom.page';
import { ChatroomMenuPage } from './Chat/chatroom-menu/chatroom-menu.page';
import { AddExpensePage } from './ExpensesAndFiles/add-expense/add-expense.page';
import { ExpenseDetailsPage } from './ExpensesAndFiles/expense-details/expense-details.page';
import { ExpensesPage } from './ExpensesAndFiles/expenses/expenses.page';
import { AddPropertyPage } from './Owner/add-property/add-property.page';
import { OwnerEditPage } from './Owner/owner-edit/owner-edit.page';
import { OwnerMainMenuPage } from './Owner/owner-main-menu-page/owner-main-menu-page.page';
import { PropertyDetailPage } from './Owner/property-detail/property-detail.page';
import { RenterDetailPage } from './Owner/renter-detail/renter-detail.page';
import { OwnerDetailsPage } from './Renter/owner-details/owner-details.page';
import { RentMainPage } from './Renter/rent-main/rent-main.page';
import { RenterEditPage } from './Renter/renter-edit/renter-edit.page';
import { AddRenterPage } from './Owner/add-renter/add-renter.page';
import { RentMainMenuPage } from './Renter/rent-main-menu/rent-main-menu.page';
import { RouterModule } from '@angular/router';
import { OwnerMainMenuPageModule } from './Owner/owner-main-menu-page/owner-main-menu-page.module';
import {UserGuideComponent} from './user-guide/user-guide.component'
import { UploadedFilesPage } from './ExpensesAndFiles/uploaded-files/uploaded-files.page';


@NgModule({
  declarations: [
    [AppComponent], 
    [SignInPage],
    [SignUpPage],
    [AddSubjectPage],
    [ChatroomPage],
    [ChatroomMenuPage],
    [AddExpensePage],
    [ExpenseDetailsPage],
    [ExpensesPage],
    [UploadedFilesPage],
    [AddPropertyPage],
    [OwnerEditPage],
    [OwnerMainMenuPage],
    [PropertyDetailPage],
    [RenterDetailPage],
    [OwnerDetailsPage],
    [RentMainPage],
    [RenterEditPage],
    [AddRenterPage],
    [UserGuideComponent],
    [RentMainMenuPage]
  ],
  exports: [
    [SignInPage],
    [SignUpPage],
    [AddSubjectPage],
    [ChatroomPage],
    [ChatroomMenuPage],
    [AddExpensePage],
    [ExpenseDetailsPage],
    [ExpensesPage],
    [AddPropertyPage],
    [OwnerEditPage],
    [OwnerMainMenuPage],
    [PropertyDetailPage],
    [RenterDetailPage],
    [OwnerDetailsPage],
    [RentMainPage],
    [RenterEditPage],
    [AddRenterPage],
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    RouterModule.forRoot([
      {
        path: 'owner-main-menu-page',
        component: OwnerMainMenuPage
      }
    ]),
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'roMobile',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
   
  ],  
  providers: [
    SignUpServiceService,
    FileUploadService,
    ExpensesService,
    SubjectsService,
    DatePipe,
    HttpClient
    , { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
