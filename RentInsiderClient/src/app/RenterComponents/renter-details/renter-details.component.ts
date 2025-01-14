import { Component, Inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TemplateRef } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Counties } from '../../CommonComponents/counties-cities-Romania/judete';
import { PropertyService } from '../../Services/propertyService/property.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Property } from '../../Models/property';
import { FormBuilder, FormGroup, Validator } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Renter } from '../../Models/renter';
import { RenterDBService } from '../../Services/renterDbService/renter-db.service';
import { VerifyCNP } from 'src/app/utils/CNP.validator';

@Component({
  selector: 'app-renter-details',
  templateUrl: './renter-details.component.html',
  styleUrls: ['./renter-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RenterDetailsComponent implements OnInit {
  RenterDetailsForm: FormGroup;
  submitted = false;
  valid = false;
  currentRenter: Renter;
  constructor(
    private modalService: BsModalService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RenterDetailsComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private renterservice: RenterDBService
  ) {
    if (data.currentRenter === undefined) {
      this.currentRenter = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        cnp: '',
        address: '',
        telephone: '',
        secondPhoneNumber: '',
        number_of_individuals: 0,
        bankAccount: '',
        id: '',
        propertyID: '',
      };
    } else {
      this.currentRenter = data.currentRenter;
    }
  }

  ngOnInit(): void {
    /* this.RenterDetailsForm = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      cnp: ['', [VerifyCNP()]],
      bankAccount: ['', Validators.nullValidator],
      secondPhoneNumber: ['', Validators.nullValidator],
      address: ['', Validators.nullValidator],
      number_of_individuals: ['', Validators.required],
      firstAuxiliaryPayment: ['', Validators.nullValidator],
      secondAuxiliaryPayment: ['', Validators.nullValidator],
    }); */

    this.initializeFormGroup(this.data.currentRenter);
  }
  get getForm() {
    return this.RenterDetailsForm.controls;
  }

  initializeFormGroup(currentRenter: Renter) {
    this.RenterDetailsForm = this.formBuilder.group({
      lastName: [currentRenter.lastName, Validators.required],
      firstName: [currentRenter.firstName, Validators.required],
      email: [currentRenter.email, [Validators.required, Validators.email]],
      telephone: [currentRenter.telephone, Validators.required],
      cnp: [
        currentRenter.cnp,
        [
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(13),
        ],
      ],
      bankAccount: [currentRenter.bankAccount, Validators.nullValidator],
      secondPhoneNumber: [currentRenter.secondPhoneNumber, Validators.nullValidator],
      address: [currentRenter.address, Validators.nullValidator],
      number_of_individuals: [currentRenter.number_of_individuals, [Validators.required, Validators.pattern("^[1-8]$")]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.RenterDetailsForm.invalid) {
      return;
    }
    if (this.RenterDetailsForm.valid) {
      const currentRenter = this.RenterDetailsForm.value as Renter;
      
      if (currentRenter.id === '') {
      } else {
        this.renterservice.updatecurrentRenter(currentRenter);
      }
      this.dialogRef.close();
    }
  }
}
