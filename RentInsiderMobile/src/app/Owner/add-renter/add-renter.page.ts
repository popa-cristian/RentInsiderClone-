import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// add renter functionality
import { RenterDBService } from 'src/app/Services/renter-db.service';
import { Renter } from 'src/app/Models/renter';
import { VerifyCNP } from 'src/app/utils/CNP.validator';

// modal for feedback
import swal from 'sweetalert';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-renter',
  templateUrl: './add-renter.page.html',
  styleUrls: ['./add-renter.page.scss'],
})

export class AddRenterPage implements OnInit {

  AddRenterForm: FormGroup;
  renter: Renter = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    cnp: '',
    address: '',
    telephone: '',
    number_of_individuals: 1,
    propertyID: '',
    bankAccount: '',
    firstAuxiliaryPaymentMethod: '',
    secondAuxiliaryPaymentMethod: '',
    secondPhoneNumber: '',
    id: ''
  };
  
  constructor(
    private _location: Location,
    private router: Router,
    private formBuilder: FormBuilder,
    private renterService: RenterDBService,
    private translateService: TranslateService
  ) {
    // assign the renter to the property
    // property id is the id of the property from where this component (add-renter) has been opened
    this.renter.propertyID = this.router.getCurrentNavigation().extras.state.selectedProperty.id;
  }

  ngOnInit() {
    this.initializeFormGroup();
  }

  initializeFormGroup() {
    this.AddRenterForm = this.formBuilder.group({
      lastName: [
        this.renter.lastName,
        [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')],
      ],
      firstName: [
        this.renter.firstName,
        [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')],
      ],
      cnp: [this.renter.cnp, [Validators.required, VerifyCNP()]],
      email: [this.renter.email, [Validators.required, Validators.email]],
      address: [this.renter.address, [Validators.required]],
      telephone: [
        this.renter.telephone,
        [
          Validators.required,
          Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s./0-9]*$'),
        ],
      ], // Phone number regex
      number_of_individuals: [
        this.renter.number_of_individuals,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.min(1),
          Validators.max(8),
        ],
      ], // number less than 8
      password: [
        this.renter.password,
        [
          Validators.required
        ]
      ]
    });
  }
  
  PreviousPage() {
    this._location.back();
  }

  async onSubmit() {
    // check if form is invalid
    if (this.AddRenterForm.invalid) {
      this.showErrorModal(this.getTranslation('add-renter.form-invalid'));      
    } else {
      // try to add the renter
                
        const formControls = this.AddRenterForm.controls; 

        this.renter.email = formControls.email.value;
        this.renter.firstName = formControls.firstName.value;
        this.renter.lastName = formControls.lastName.value;
        this.renter.cnp = formControls.cnp.value;
        this.renter.address = formControls.address.value;
        this.renter.telephone = formControls.telephone.value;
        this.renter.number_of_individuals = formControls.number_of_individuals.value;
        
      try {
        await this.renterService.signup(this.renter);
        // success
        this.showSuccessModal(this.getTranslation('add-renter.form-success'));
        // reload the previous page
        this.router.navigate(['/owner-main-menu-page/property-detail', {id: this.renter.propertyID}]);
      } catch (err) {
        // error, showing the error message is not the best thing to do, 
        // could have security implications...
        this.showErrorModal(err);
      }
    }
  } 

  vecSwap(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  // standard length is 10 characters as seen in web client
  // contains at least 1 number, 1 upper- and lowercase characters, and 1 special character
  // the rest of the characters are chosen randomly, and mixed again in the end
  generatePassword(passLength = 10) {
    const numere = "0123456789";
    const upperChr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChr = "abcdefghijklmnopqrstuvwxyz";
    const specChr="!@#$%^&*/?<>`~+-"
    const allChars = numere + upperChr + lowerChr + specChr;
    let randPasswordArray = Array(passLength);
    randPasswordArray[0] = numere;
    randPasswordArray[1] = upperChr;
    randPasswordArray[2] = lowerChr;
    randPasswordArray[3] = specChr;
    randPasswordArray = randPasswordArray.fill(allChars, 4);
        
    this.renter.password = this.vecSwap(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');

    // set the value of the password readonly input field
    this.AddRenterForm.patchValue({
      password: this.renter.password
    });
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
