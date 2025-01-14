import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { FormBuilder,FormGroup} from '@angular/forms';
import { Validators } from '@angular/forms';
import { Renter } from '../../Models/renter';
import{RenterDBService} from '../../Services/renter-db.service'
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { VerifyCNP } from 'src/app/utils/CNP.validator';

// modals for error + success
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';


@Component({
  selector: 'app-renter-edit',
  templateUrl: './renter-edit.page.html',
  styleUrls: ['./renter-edit.page.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class RenterEditPage implements OnInit {
  
 RenterDetailsForm: FormGroup;
  submitted=false;
  valid=false;
  currentRenter: Renter;
  data:any; 
  constructor(
    private activatedRoute:ActivatedRoute, 
    private router:Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private renterService:RenterDBService,
    private translateService: TranslateService
  ) { 
    this.activatedRoute.queryParams.subscribe(params =>{
      if(this.router.getCurrentNavigation().extras.state){
        this.currentRenter = this.router.getCurrentNavigation().extras.state.currentRenter;
      }
    });
   }

   ngOnInit(): void {
    this.initializeFormGroup();
  }

  initializeFormGroup() {
    this.RenterDetailsForm = this.formBuilder.group({
      lastName: [
        this.currentRenter.lastName,
        [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')],
      ],
      firstName: [
        this.currentRenter.firstName,
        [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')],
      ],
      cnp: [this.currentRenter.cnp, [Validators.required, VerifyCNP()]],
      email: [this.currentRenter.email, [Validators.required, Validators.email]],
      address: [this.currentRenter.address, [Validators.required]],
      telephone: [
        this.currentRenter.telephone,
        [
          Validators.required,
          Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s./0-9]*$'),
        ],
      ], // Phone number regex
      number_of_individuals: [
        this.currentRenter.number_of_individuals,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.min(1),
          Validators.max(8),
        ],
      ], // number less than 8
      bankAccount: this.currentRenter.bankAccount ? this.currentRenter.bankAccount : '',
      secondPhoneNumber: [
        this.currentRenter.secondPhoneNumber,
        [
          Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s./0-9]*$'),
        ],
      ],
      firstAuxiliaryPaymentMethod: this.currentRenter.firstAuxiliaryPaymentMethod ? this.currentRenter.firstAuxiliaryPaymentMethod : '',
      secondAuxiliaryPaymentMethod: this.currentRenter.secondAuxiliaryPaymentMethod ? this.currentRenter.secondAuxiliaryPaymentMethod : ''
    });
  }

  goToMainPage(){
    this.router.navigate(['rent-main-menu-page']);
  }

  async onSubmit() {  
    
    // check if form is invalid
    if (this.RenterDetailsForm.invalid) {
      this.showErrorModal(this.getTranslation('renter-edit.form-invalid'));      
    } else {
      // try to add the renter
                
      const formControls = this.RenterDetailsForm.controls; 

      this.currentRenter.email = formControls.email.value;
      this.currentRenter.firstName = formControls.firstName.value;
      this.currentRenter.lastName = formControls.lastName.value;
      this.currentRenter.cnp = formControls.cnp.value;
      this.currentRenter.address = formControls.address.value;
      this.currentRenter.telephone = formControls.telephone.value;
      this.currentRenter.number_of_individuals = formControls.number_of_individuals.value;
      
      // optional fields
      this.currentRenter.bankAccount = formControls.bankAccount.value ? formControls.bankAccount.value : '';
      this.currentRenter.secondPhoneNumber = formControls.secondPhoneNumber.value ?
        formControls.secondPhoneNumber.value : '';
      this.currentRenter.firstAuxiliaryPaymentMethod = formControls.firstAuxiliaryPaymentMethod.value ?
        formControls.firstAuxiliaryPaymentMethod.value : '';
      this.currentRenter.secondAuxiliaryPaymentMethod = formControls.secondAuxiliaryPaymentMethod.value ?
        formControls.secondAuxiliaryPaymentMethod.value : '';
        
      try {
        await this.renterService.updatecurrentRenter(this.currentRenter);
        // success
        this.showSuccessModal(this.getTranslation('renter-edit.form-success'));
        // reload the page
        // this.router.navigate(['/rent-main', {id: this.currentRenter.propertyID}]);
        this.goToMainPage();
      } catch (err) {
        // error, showing the error message is not the best thing to do, 
        // could have security implications...
        this.showErrorModal(err);
      }
    }
  } 

  // translate any given key with the currentnly loaded language file
  // used to get translations for modals
  getTranslation(key: string): string {
    return this.translateService.instant(key);
  }

  // wrapper functions for creating sweetalert modals
  showErrorModal(message: string) {
    swal({
      title: message,
      icon: 'error',
    })
  }

  showSuccessModal(message: string) {
    swal({
      title: message,
      icon: 'success',
    })
  }
}

