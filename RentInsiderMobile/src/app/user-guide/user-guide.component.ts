import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationLanguages } from '../utils/LanguageChanger';
import { ChangePageLanguage } from 'src/app/utils/LanguageChanger';
@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss'],
})
export class UserGuideComponent implements OnInit {
  static translator: TranslateService;
  importedLanguages=ApplicationLanguages;
  constructor(
      private readonly translateService: TranslateService,
      private _location:Location,
              
  ) {   

  }

  ngOnInit() {
    UserGuideComponent.translator = this.translateService;
  }
  
  PreviousPage()
{
  this._location.back();
}

changeLanguage(languageWanted: string): void {
  ChangePageLanguage(languageWanted, this.translateService.currentLang, this.translateService);
}

langCheck(languageWanted:string){
  if(languageWanted==this.translateService.currentLang)
    return 1;
  else
    return 0;
}



}




