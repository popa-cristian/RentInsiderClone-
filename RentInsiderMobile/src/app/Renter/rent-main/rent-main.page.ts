import { Component, OnInit } from '@angular/core';
import { Owner } from '../../Models/owner';
import { RenterDBService } from '../../Services/renter-db.service';
import { FileUploadService } from '../../Services/file.service';
import { Property } from '../../Models/property';
import { from } from 'rxjs';
import { ExpensesService } from '../../Services/expense.service';
import { Expense } from '../../Models/expense';
import { FormBuilder, FormGroup, Validator } from '@angular/forms';
import { Renter } from '../../Models/renter';
import { SignInServiceService } from '../../Services/sign-in-service.service';
import { PropertyService } from '../../Services/property.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ChangePageLanguage } from 'src/app/utils/LanguageChanger';
import { ApplicationLanguages } from 'src/app/utils/LanguageChanger';
import { RentMainMenuPage } from '../rent-main-menu/rent-main-menu.page';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rent-main',
  templateUrl: './rent-main.page.html',
  styleUrls: ['./rent-main.page.scss'],
})
export class RentMainPage implements OnInit {

  owner: Owner;
  fullName: string;
  currentProperties: Property[];
  currentProperty: Property;
  currentownerID: string;
  expenses: Expense[];
  due_date:any;
  renters:Renter[];
  EditRenterDetailsForm: FormGroup;
  ProprtyDetailsForm: FormGroup;
  currentRenter:Renter;
  currentDate:any;
  
  // translation
  importedLanguages = ApplicationLanguages;
  static translator:TranslateService;
  constructor(
    private renterservice: RenterDBService,
    private fileservice: FileUploadService,
    private expenseService: ExpensesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private signinservice:SignInServiceService,
    private propertyservice:PropertyService,
    private menuController:MenuController,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    RentMainPage.translator=this.translateService;
    //this.menuController.enable(true, "rent");
    this.renterservice.getPropertyOfCurrentUser();
    this.getCurrentProperty();
    this.getCurrentRenter();

    this.EditRenterDetailsForm = this.formBuilder.group({
      lastName: [''],
      firstName: [''],
      email: [''],
      firstPhoneNumber: [''],
      cnp: [''],
      address:[''],
    });
    this.ProprtyDetailsForm = this.formBuilder.group({
      number_of_individuals: [''],
      county: [''],
      city: [''],
      address: [''],
      price: [''],
      surface:[''],
      floor:[''],
      partitioning:[''],
      rooms:['']
    });
  }

  ionViewWillEnter(){
    this.menuController.enable(true, "rent");
  }

  GetOwner_FullName(): String {
    if (this.owner) {
      const firstName = new String(" " + this.owner.firstName);
      const lastName = new String(this.owner.lastName);
      this.fullName = lastName.concat(firstName.toString());
      return this.fullName;
    }
  }

  getCurrentProperty() {
    this.renterservice.getPropertyOfCurrentUser().subscribe(property => {
      this.currentProperties = property;
      this.currentProperty = this.currentProperties[0];
      this.currentownerID = this.currentProperty.ownerID;
      this.getCurrentExpensesOfProperty(this.currentProperty);
      this.getCurrentOwner();
      this.getDueDate();
    })
  }

  getCurrentOwner() {
    var obsowners = from(this.renterservice.getCurrentOwner(this.currentProperty.ownerID))
    obsowners.subscribe(owner => {
      this.owner = owner;
    })
  }

  getCurrentExpensesOfProperty(property: Property) {

    this.expenseService.getExpensesFromProperty(property).subscribe(expenses => {
      this.expenses = expenses;
    })
  }

  getCurrentRenter() {
    from(this.renterservice.getCurrentRenter()).subscribe(renter => {
      this.currentRenter = renter;
    })
  }

  openChatroomMenu(){
    let navigationExtras: NavigationExtras = {
      state: {
        currentItem: this.currentProperty,
      }
    };
    this.router.navigate(['/chatroom-menu/chatroom'], navigationExtras);
  }
openModalDetails(){
  let navigationExtras: NavigationExtras = {
    state: {
      currentRenter: this.currentRenter,
    }
  };
  this.router.navigate(['renter-edit'], navigationExtras);
}

  onLogout(){
    sessionStorage.removeItem("ownerName");
    sessionStorage.removeItem("renterName");
    sessionStorage.removeItem("currentUserID");
    this.signinservice.logout();
    this.router.navigateByUrl('');
  }

  onWaterConsumptionIndexUpdate(new_index:string | number){
    let number_index = Number(new_index);
    this.propertyservice.updateWaterConsumptionIndex(number_index,this.currentProperty.id);
  }

  onSelect(item:Property){
    let navigationExtras: NavigationExtras = {
      state: {
        currentItem: item,
      }
    };
    this.router.navigate(['/rent-main/owner-details'], navigationExtras);
  }

  openOwnerDetailPage(){
    let navigationExtras: NavigationExtras = {
      state: {
        currentOwner: this.owner
      }
    };
    this.router.navigate(['owner-details'], navigationExtras);
  }

  rentPayment()
  {
    var currentDate=new Date;
    var day=currentDate.getDate();
    if (day<+this.due_date)
    {
      currentDate.setDate(+this.due_date); 
    }else {
      currentDate.setMonth(currentDate.getMonth()+1);
      currentDate.setDate(+this.due_date);
    }
    return currentDate;
  }

  getDueDate(){
    this.renterservice.getPropertyOfCurrentUser().subscribe(properties=>{
      this.currentProperties=properties;
      this.due_date=this.currentProperties[0].due_date;
      this.currentDate=this.rentPayment();
      return this.currentProperties[0].due_date;
    })
  }

  changeLanguage(languageWanted: string): void {
    // INPUT: importedLanguages.[language]
    ChangePageLanguage(languageWanted, this.translateService.currentLang, this.translateService);
  }

  openExpensePage(item:Property){
    this.router.navigate(['/expenses', { id: item.id }]);
  }

  openInfoWiki()
  {
    this.router.navigate(['./user-guide']);
  }

  openUploadedFiles(item:Property){
    this.router.navigate(['/uploaded-files', {id: item.id}]);
  }
}

export function getRentMainPageTranslator() {
  return RentMainMenuPage.translator;
}

