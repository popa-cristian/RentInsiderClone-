import { Inject, Input, TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RenterDBService } from '../../Services/renterDbService/renter-db.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Renter } from '../../Models/renter';
import { ViewEncapsulation } from '@angular/core';
import { Property } from '../../Models/property';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PropertyService } from '../../Services/propertyService/property.service';
import { Validators } from '@angular/forms';
import { VerifyCNP } from 'src/app/utils/CNP.validator';
import { DialogService } from 'src/app/Services/dialogService/dialog.service';
import { RenterAlertSuccessComponent } from '../renter-alert-success/renter-alert-success.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-renter',
  templateUrl: './renter.component.html',
  styleUrls: ['./renter.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RenterComponent implements OnInit {
  public modalRef: BsModalRef;
  submitted = false;
  signUpErrors: string = null;
  RenterDetailsForm: FormGroup;
  selectedProperty: Property;

  // translated properties for placeholders
  translatedPassword = '';

  // initialization of text fields (we want them to be empty at first)
  @Input() item: Property;
  renter: Renter = {
    email: '',
    password: '',
    lastName: '',
    firstName: '',
    cnp: '',
    address: '',
    telephone: '',
    secondPhoneNumber: '',
    bankAccount: '',
    number_of_individuals: null, // if 0, the text field is going to be on focus from the start (css related); cannot be = ''
    propertyID: '',
    id: '',
  };

  constructor(
    private modalService: BsModalService,
    public renterDb: RenterDBService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RenterComponent>,
    public propertyService: PropertyService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private readonly translateService: TranslateService, // for placeholders
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.selectedProperty === undefined) {
      this.selectedProperty = {
        title: '',
        surface: 0,
        water_consumption_index: 0,
        price: 0,
        partitioning: null,
        floor: 0,
        county: '',
        city: '',
        address: '',
        number_of_rooms: 0,
        ownerID: '',
        id: '',
        type: '',
        due_date: 0,
        renterID: '',
      };
    } else {
      this.selectedProperty = data.selectedProperty;
    }
  }

  ngOnInit() {
    this.initializeFormGroup();
    this.translatePlaceholders();
  }

  initializeFormGroup() {
    this.RenterDetailsForm = this.formBuilder.group({
      lastName: [
        this.renter.lastName,
        [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')],
      ],
      firstName: [
        this.renter.firstName,
        [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')],
      ],
      cnp: [this.renter.cnp, [Validators.required, VerifyCNP()]],
      email: [this.renter.email, [Validators.email]],
      address: [this.renter.address, [Validators.required]],
      telephone: [
        this.renter.telephone,
        [
          Validators.required,
          Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s./0-9]*$'),
        ],
      ], // Phone number regex
      secondPhoneNumber: [
        this.renter.secondPhoneNumber,
        [
          Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s./0-9]*$'),
        ],
      ],
      number_of_individuals: [
        this.renter.number_of_individuals,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.min(1),
          Validators.max(8),
        ],
      ], // number less than 8
      password: [this.renter.password, [Validators.required]],
    });
  }

  input: any = { generatedPassword: '' };

  async onsignup(renterToBeSignedUp: Renter, selectedProperty: Property) {
    this.renterDb.signup(renterToBeSignedUp, selectedProperty);
    try {
      await this.renterDb.signup(renterToBeSignedUp, selectedProperty);
      this.getForm.err;
      this.dialogRef.close();
      this.openAddRenterSuccess(); // open an alert to tell the user that the submition was successful
    } catch (err) {
      this.signUpErrors = err.message;
    }
  }

  get getForm() {
    return this.RenterDetailsForm.controls;
  }

  translatePlaceholders() {
    this.translatedPassword = this.translateService.instant('renter.pass');
  }

  randomPassword(length) {
    var chars =
      'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890';
    var pass = '';
    for (var x = 0; x < length; x++) {
      var i = Math.floor(Math.random() * chars.length);
      pass += chars.charAt(i);
    }
    return pass;
  }

  generatePassword() {
    this.renter.password = this.randomPassword(10);
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onSubmit() {
    this.submitted = true;
    if (this.RenterDetailsForm.invalid) {
      return;
    }
  }

  openAddRenterSuccess() {
    const dialogConfig = new MatDialogConfig(); // create

    // config
    dialogConfig.disableClose = false; // the dialog can be closed by clicking outside it
    dialogConfig.id = 'renter-alert-success-component';

    // open
    const modalDialog = this.dialog.open(
      RenterAlertSuccessComponent,
      dialogConfig
    );
  }
}
