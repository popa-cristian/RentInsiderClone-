import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SignInServiceService } from '../../Services/sign-in-service.service';
import { Renter } from '../../Models/renter';
import { Owner } from '../../Models/owner';
import { TranslateService } from '@ngx-translate/core';
import { ChangePageLanguage } from 'src/app/utils/LanguageChanger';
import { ApplicationLanguages } from 'src/app/utils/LanguageChanger';
import swal from 'sweetalert';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  selectedOption: string = '';
  owners: Owner[];
  renters: Renter[];
  signInForm: FormGroup;
  isSignedIn = false;
  submitted = false;

  // [ Translation ]

  /* must be initialized so we can get all the languages from "LanguageChanger.ts"
   and reduce human error when typing in html the language */
  importedLanguages = ApplicationLanguages;

  constructor(public signinService: SignInServiceService,
     private router: Router, private formBuilder: FormBuilder,
     private readonly translateService: TranslateService,
     private menuController:MenuController
     ) {}

  ngOnInit() {
    if (sessionStorage.getItem('user') !== null) {
      this.isSignedIn = true;
      sessionStorage.removeItem('user');
    } else {
      this.isSignedIn = false;
    }
    //sessionStorage.setItem('ownerName', "");
    //sessionStorage.setItem('renterName', "");

    this.initializeFormGroup();
  }

  initializeFormGroup() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onChange(event) {
      if(this.selectedOption=="1"){
        this.signinService.getallOwners().subscribe(owners => {
          this.owners = owners;
        })
      }else{
        if(this.selectedOption=="2"){
          this.signinService.getallRenters().subscribe(Renters => {
            this.renters = Renters;
          })
        }
      } 
      
    }

    ionViewWillEnter(){
      this.menuController.enable(false, "first");
      this.menuController.enable(false, "second");
    }


   signIn(email: string, password: string) {
    if (this.selectedOption == "1") {
      this.signinService.OwnerAuthentication(email, password, this.owners);
    }
    else {
      if (this.selectedOption == "2") {
        this.signinService.RenterAuthentication(email, password, this.renters);
      }
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.signInForm.invalid) {
      return;
    }
    
    this.signIn(this.signInForm.value.email, this.signInForm.value.password);
  }


  async onPasswordReset(){
    const email=this.signInForm.value.email;
    await this.signinService.resetPassword(email);
  }
  
  
  handleLogout(){
    this.isSignedIn = false
  }

  /* must be imported together with ApplicationLanguages;
   define a variable to copy ApplicationLanguages values; see importedLanguages in this file definitions*/
  changeLanguage(languageWanted: string): void {
    ChangePageLanguage(languageWanted, this.translateService.currentLang, this.translateService);
  }

  passwordChanged()
  {
    swal({
      title:"Verificati adresa de mail!",
      icon:"info",

    });
  }
  
}
