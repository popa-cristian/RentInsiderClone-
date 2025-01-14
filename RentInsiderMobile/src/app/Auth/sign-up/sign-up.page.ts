import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder,FormGroup,Validator,ReactiveFormsModule} from '@angular/forms';
import { User } from '../../Models/user';
import { SignUpServiceService } from '../../Services/sign-up-service.service';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ChangePageLanguage } from 'src/app/utils/LanguageChanger';
import { ApplicationLanguages } from 'src/app/utils/LanguageChanger';
 
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss']
})
 
  export class SignUpPage implements OnInit{
    title = 'firebase-angular-auth';
    SignUpForm: FormGroup;
    submitted=false;

    // translation
    importedLanguages = ApplicationLanguages;

    user:User = {
      email: '',
      password: '',
      lastName: '',
      firstName: '',
      telephone:''
  }
    constructor(
      public signUpService : SignUpServiceService,
      private formBuilder: FormBuilder,
      private readonly translateService: TranslateService 
      ){}
    ngOnInit(){
      this.SignUpForm=this.formBuilder.group({
        lastName: ['', Validators.required],
        firstName: ['', Validators.required],
        email: ['', [Validators.required]],
        telephone: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }                                                                                                                                                                                                                                                                                                                                                                                                  
   
    get getForm() {
      return this.SignUpForm.controls;
    }
    onSubmit(){
      this.submitted = true;
      if(this.SignUpForm.invalid){
        return;
      }
      this.signUpService.signup(this.SignUpForm.value as User);
    }

    changeLanguage(languageWanted: string): void {
      ChangePageLanguage(languageWanted, this.translateService.currentLang, this.translateService);
    }
}
