import { TranslateService } from '@ngx-translate/core';

/* # # # # # # # # # # # # # # # # #   [   USE   ]   # # # # # # # # # # # # # # # # # # # # # # #

#---1) Import into .ts used:
      _______________________________________________________________________________________
      | Example: 
            import { TranslateService } from '@ngx-translate/core';
            import { ChangePageLanguage } from 'src/app/utils/LanguageChanger';
            import { ApplicationLanguages } from 'src/app/utils/LanguageChanger';
      |______________________________________________________________________________________
        

#---2) In the .ts used define and initialize a variable "importedLanguages" 
        *if not, you cannot use ``ApplicationLanguages`` directly in html
        *use same variable name so it is easier for everybody to use it
        *languageUsed of the page to tell the current state
      _______________________________________________________________________________________
      | Example: 
            importedLanguages = ApplicationLanguages;
      |______________________________________________________________________________________

      

#---3) In the .ts used define a TranslateService in the constructor
        *the page needs to be using
      ________________________________________________________________________________________
      | Example: 
            constructor(private readonly translateService: TranslateService) { }   
      |_______________________________________________________________________________________


#---4) In the .ts used define a function to call ``ChangePageLanguage``
      ________________________________________________________________________________________________________
      | Example: 
            changeLanguage(languageWanted: string): void {
                  // INPUT: importedLanguages.[language]
                ChangePageLanguage(languageWanted, this.translateService.currentLang, this.translateService);
            }
      |________________________________________________________________________________________________________

#---5) In html use as following:
      _______________________________________________________________________________________
      | Example: 
            <button type="button" (click)="changePageLanguage(importedLanguages.ro)">
                [ChangeThisText]
            </button>
      |______________________________________________________________________________________


#    !!    If you want to add a new language to this app, also add its name below 
    into ``ApplicationLanguages`` and the corresponding file in ``LanguageFiles``
            Also, be sure to add languages to app.component.ts as well

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #*/

export let ApplicationLanguages = {
      // valid abbreviation for languages when using the function
    // used in corresponding .ts to reduce the risk of writting wrong the language in html
    ro: "ro",
    eng: "en",
    en: "en"
};


export function ChangePageLanguage(languageWanted: string, languageUsed: string, translateService: TranslateService): void {
      if (languageUsed != ApplicationLanguages[languageWanted]) {
            translateService.use(ApplicationLanguages[languageWanted]);
      }
}