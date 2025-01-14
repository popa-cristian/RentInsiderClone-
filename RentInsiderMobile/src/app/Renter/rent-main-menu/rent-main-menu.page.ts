import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { from } from 'rxjs';
import { Renter } from 'src/app/Models/renter';
import { getPropertyDetailTranslateService } from 'src/app/Owner/property-detail/property-detail.page';
import { RenterDBService } from 'src/app/Services/renter-db.service';
import { SignInServiceService } from 'src/app/Services/sign-in-service.service';
import { ChangePageLanguage } from 'src/app/utils/LanguageChanger';
import { getRentMainPageTranslator } from '../rent-main/rent-main.page';

@Component({
  selector: 'app-rent-main-menu',
  templateUrl: './rent-main-menu.page.html',
  styleUrls: ['./rent-main-menu.page.scss'],
})
export class RentMainMenuPage implements OnInit {

  currentRenter:Renter
  static translator: any;
  constructor(
    private menuController:MenuController,
    private router:Router,
    private renterService:RenterDBService,
    private signInService:SignInServiceService,
    private translateService:TranslateService
  ) { }

  ngOnInit() {
    this.getCurrentRenter();
  }

  ionViewWillEnter(){
    this.menuController.enable(true,"rent");
  }

  getCurrentRenter() {
    from(this.renterService.getCurrentRenter()).subscribe(renter => {
      this.currentRenter = renter;
    })
  }

  openModalDetails(){
    let navigationExtras: NavigationExtras = {
      state: {
        currentRenter: this.currentRenter,
      }
    };
    this.router.navigate(['renter-edit'], navigationExtras);
  }

  close(){
    this.signInService.logout();
    this.router.navigateByUrl('');
  }

  changeLanguage(languageWanted: string): void {
    // INPUT: importedLanguages.[language]
    ChangePageLanguage(languageWanted, this.translateService.currentLang, this.translateService, getRentMainPageTranslator());
  }

  openInfoWiki()
  {
    this.router.navigate(['./user-guide']);

  }
  

}


