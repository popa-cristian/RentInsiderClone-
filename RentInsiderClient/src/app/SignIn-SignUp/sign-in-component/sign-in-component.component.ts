import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/app/Services/dialogService/dialog.service';
import { Owner } from '../../Models/owner';
import { Renter } from '../../Models/renter';
import { SignInServiceService } from '../../Services/signInService/sign-in-service.service';

@Component({
  selector: 'app-sign-in-component',
  templateUrl: './sign-in-component.component.html',
  styleUrls: ['./sign-in-component.component.scss'],
})
export class SignInComponentComponent implements OnInit {
  isLoggedIn: boolean;
  SignInForm: FormGroup;
  submitted = false;
  selectedOption: string;
  isSignedIn = false;
  owners: Owner[];
  renters: Renter[];
  checked = false;

  constructor(
    public signInService: SignInServiceService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    public dialog: MatDialog,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem('user') !== null) {
      this.isSignedIn = true;
      sessionStorage.removeItem('user');
    } else {
      this.isSignedIn = false;
    }
    this.SignInForm = this.formBuilder.group({
      option: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
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
    return this.SignInForm.controls;
  }

  async onSignIn(email: string, password: string) {
    if (this.selectedOption == '1') {
      this.signInService.OwnerAuthentication(email, password, this.owners, (error: Error) => {
        if (error.message == "wrong-credentials") {
          this.dialogService.openErrorDialog(
            this.translateService.instant(
              'authentification.on-submit.error.wrong-credentials.title'
            ),
            this.translateService.instant(
              'authentification.on-submit.error.wrong-credentials.message'
            )
          );
        }
      });
    }else {
      if (this.selectedOption == '2') {
        this.signInService.RenterAuthentication(email, password, this.renters, (error: Error) => {
          if (error.message == "wrong-credentials") {
            this.dialogService.openErrorDialog(
              this.translateService.instant(
                'authentification.on-submit.error.wrong-credentials.title'
              ),
              this.translateService.instant(
                'authentification.on-submit.error.wrong-credentials.message'
              )
            );
          }
        });
      }
    }
  }

  async onPasswordReset() {
    try {
      await this.signInService.resetPassword(this.SignInForm.value.email);
      this.dialogService.openSuccessDialog(
        this.translateService.instant(
          'authentification.reset-password.success.title'
        ),
        this.translateService.instant(
          'authentification.reset-password.success.message'
        )
      );
    } catch (error) {
      if (this.SignInForm.value.email == '') {
        this.dialogService.openWarningDialog(
          this.translateService.instant(
            'authentification.reset-password.error.empty-email.title'
          ),
          this.translateService.instant(
            'authentification.reset-password.error.empty-email.message'
          )
        );
      } else {
        this.dialogService.openErrorDialog(
          this.translateService.instant(
            'authentification.reset-password.error.wrong-email.title'
          ),
          this.translateService.instant(
            'authentification.reset-password.error.wrong-email.message'
          )
        );
      }
    }
  }

  handleLogout() {
    this.isSignedIn = false;
  }

  onChange(event) {
    this.clearArray(this.owners);
    this.clearArray(this.renters);
    if (this.selectedOption == '1') {
      this.signInService.getAllOwners().subscribe((owners) => {
        this.owners = owners;
      });
    } else {
      if (this.selectedOption == '2') {
        this.signInService.getAllRenters().subscribe((Renters) => {
          this.renters = Renters;
        });
      }
    }
  }

  clearArray(array: any[]) {
    array = [];
  }
  onSubmit() {
    this.submitted = true;
    if (this.SignInForm.invalid) {
      return;
    } else {
      this.onSignIn(
        this.SignInForm.value.email,
        this.SignInForm.value.password
      );
    }
  }

  passReset() {}
}
