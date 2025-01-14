import { Component, OnInit } from '@angular/core';
import { ChangePageLanguage } from 'src/app/utils/LanguageChanger';
import { ApplicationLanguages } from 'src/app/utils/LanguageChanger';
import { TranslateService } from '@ngx-translate/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.css']
})
export class UserGuideComponent implements OnInit {

  //translation
  importedLanguages = ApplicationLanguages;

  constructor(
    private translateService: TranslateService,
    private _location:Location,
    ) { }

  ngOnInit(): void {
  }
  
  changeLanguage(languageWanted: string): void {
    ChangePageLanguage(languageWanted, this.translateService.currentLang, this.translateService);
  }

  goBack()
  {
    this._location.back();
  }

}
