import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validator } from '@angular/forms';
import { User } from '../../Models/user';
import { SignUpServiceService } from '../../Services/signUpService/sign-up-service.service';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-up-component',
  templateUrl: './sign-up-component.component.html',
  styleUrls: ['./sign-up-component.component.scss'],
})
export class SignUpComponentComponent implements OnInit {
  title = 'firebase-angular-auth';
  SignUpForm: FormGroup;
  submitted = false;
  checked = false;
  user: User = {
    email: '',
    password: '',
    lastName: '',
    firstName: '',
    telephone: '',
  };
  constructor(
    public signupService: SignUpServiceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private translateService: TranslateService
  ) {}
  ngOnInit() {
    this.SignUpForm = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    if (this.translateService.currentLang == undefined)
      this.translateService.setDefaultLang('ro');
    else this.previouslySetLanguage();
  }

  check() {
    if (this.checked) this.translateService.use('ro');
    else this.translateService.use('en');
  }

  sliderClass() {
    return {
      slider1: this.checked,
      slider: !this.checked,
      round: true,
    };
  }

  previouslySetLanguage() {
    if (this.translateService.currentLang == 'ro') this.checked = false;
    if (this.translateService.currentLang == 'en') this.checked = true;
  }

  get getForm() {
    return this.SignUpForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.SignUpForm.invalid) {
      return;
    } else {
      var user = this.SignUpForm.value as User;
      this.signupService.signup(user).then((res) => {
        this.router.navigateByUrl('/sign-in-component');
      });
    }
  }
}
