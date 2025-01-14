import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Renter } from 'src/app/Models/renter';
import { ExpensesService } from 'src/app/Services/expense.service';
import { FileUploadService } from 'src/app/Services/file.service';
import{Property} from '../../Models/property';
import {PropertyService} from '../../Services/property.service';
import { map } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Owner } from 'src/app/Models/owner';
import { OwnerService } from 'src/app/Services/owner.service';
import { from } from 'rxjs';
import { SignUpServiceService } from 'src/app/Services/sign-up-service.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChangePageLanguage } from 'src/app/utils/LanguageChanger';
import { ApplicationLanguages } from 'src/app/utils/LanguageChanger';
import { getPropertyDetailTranslateService } from '../property-detail/property-detail.page';

@Component({
  selector: 'app-owner-main-menu-page',
  templateUrl: './owner-main-menu-page.page.html',
  styleUrls: ['./owner-main-menu-page.page.scss'],
})
export class OwnerMainMenuPage implements OnInit {
  public appPages = [
    { title: 'Property1_menu_page', url: './property-detail', icon: 'home' },
    { title: 'Property2', url: '#', icon: 'home' },
    { title: 'Property2', url: '#', icon: 'home' },
    { title: 'Property2', url: '#', icon: 'home' },
    { title: 'Property2', url: '#', icon: 'home' },
    { title: 'Property2', url: '#', icon: 'home' },
    { title: 'Property2', url: '#', icon: 'home' },
  ];

  public optionelem = [
    {title: 'Editare informatii proprietar', url:'/owner-edit', icon:'create'},
    {title: 'Deconectare', url:'#', icon:'exit'},
  ];
  properties:Property[]=[];
  selectedItem?: Property;
  renters:Renter[];
  renter:Renter;
  selectedRenters:Renter[];
  selectedRenter:Renter;
  selectedProperty:Property;
  currentOwner:Owner;

  // translation
  importedLanguages = ApplicationLanguages;
  
  constructor(
    private propertyService: PropertyService,
    private fileservice:FileUploadService,
    private expenseService:ExpensesService,
    private afs:AngularFirestore,
    private router:Router,
    private _location: Location,
    private ownerService:OwnerService,
    private signInService:SignUpServiceService,
    private activatedRoute:ActivatedRoute,
    private readonly translateService: TranslateService
    ) { }

  ngOnInit() {
    this.getPropertiesFromService();
    this.getCurrentOwner();
  }

  getPropertiesFromService() {
    this.propertyService.getPropertiesFromUser().subscribe(properties => {
      this.properties = properties;
    })
  }

  getCurrentOwner(){
    from(this.ownerService.getCurrentOwner()).subscribe(owner=>{
      this.currentOwner=owner;
    })
  }

  getRenterofselectedProperty(selectedProperty:Property){
    return this.afs.collection("Renters",ref=>ref.where('propertyID','==',selectedProperty.id).limit(1)).snapshotChanges().pipe
    (map(changes => {
    return changes.map(a => {
      const data = a.payload.doc.data() as Renter;
      data.id = a.payload.doc.id;
      return data;
    });
  }))
  }

  getSelectedRenter(){
    this.getRenterofselectedProperty(this.selectedItem).subscribe(selectedRenters=>{
      this.selectedRenters=selectedRenters;
      this.selectedItem.renterID=this.selectedRenters[0].id; 
      this.fileservice.onFirstComponentButtonClick(this.selectedItem);
      this.expenseService.ExpenseInterrogation(this.selectedItem);   
    })
  }

  getCurrentRenter(){
    this.getRenterofselectedProperty(this.selectedItem).subscribe(renters=> {
      this.renters = renters;
      this.renter=this.renters[0];
    })   
  }

  onSelect(item:Property){
    this.router.navigate(['/owner-main-menu-page/property-detail', { id: item.id }]);
  }

  addPropertyPage(){
    this.router.navigate(['../add-property']);
  }

  openOwnerDetails(){
    if((this.currentOwner==undefined)||(this.currentOwner==null)){
      return;
    }
    let navigationExtras: NavigationExtras = {
      state: {
        currentOwner: this.currentOwner,
      }
    };
    this.router.navigate(['owner-edit'], navigationExtras);
  }

  close(){
    this.signInService.logout();
    this.router.navigateByUrl('');
  }

  changeLanguage(languageWanted: string): void {
    // INPUT: importedLanguages.[language]
    ChangePageLanguage(languageWanted, this.translateService.currentLang, this.translateService, getPropertyDetailTranslateService());
  }

  openInfoWiki()
  {
    this.router.navigate(['./user-guide']);

  }

}
