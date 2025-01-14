import { Component, Inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TemplateRef } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Counties } from '../counties-cities-Romania/judete';
import { PropertyService } from '../../Services/propertyService/property.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Property } from '../../Models/property';
import { FormBuilder, FormGroup, Validator } from '@angular/forms';
import { Validators } from '@angular/forms';
import { OwnerService } from '../../Services/ownerService/owner.service';
import { Owner } from '../../Models/owner';
import { from } from 'rxjs';
import { VerifyCNP } from 'src/app/utils/CNP.validator';

@Component({
  selector: 'app-owner-details',
  templateUrl: './owner-details.component.html',
  styleUrls: ['./owner-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OwnerDetailsComponent implements OnInit {
  OwnerDetailsForm: FormGroup;
  submitted = false;
  valid = false;
  value: any;
  currentOwner: Owner;
  constructor(
    private modalService: BsModalService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OwnerDetailsComponent>,
    private formBuilder: FormBuilder,
    private ownerservice: OwnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.currentOwner === undefined) {
      this.currentOwner = {
        lastName: '',
        firstName: '',
        email: '',
        firstPhoneNumber: '',
        cnp: '',
        bankAccount: '',
        secondPhoneNumber: '',
        address: '',
        details: '',
        doc_id: '',
      };
      // this.getCurrentOwner();
    } else {
      this.currentOwner = data.currentOwner;
    }
    this.getCurrentOwner();
  }

  ngOnInit(): void {
    this.initializeFormGroup(this.currentOwner);
  }
  get getForm() {
    return this.OwnerDetailsForm.controls;
  }
  reloadCurrentPage() {
    window.location.reload();
  }

  getCurrentOwner() {
    var obsowners = from(this.ownerservice.getCurrentOwner());
    obsowners.subscribe((owners) => {
      this.currentOwner = owners;
    });
  }

  initializeFormGroup(currentOwner: Owner) {
    this.OwnerDetailsForm = this.formBuilder.group({
      lastName: [this.currentOwner.lastName, Validators.required],
      firstName: [this.currentOwner.firstName, Validators.required],
      email: [this.currentOwner.email, [Validators.required, Validators.email]],
      firstPhoneNumber: [
        this.currentOwner.firstPhoneNumber,
        Validators.required,
      ],
      cnp: [this.currentOwner.cnp, [Validators.required, VerifyCNP()]],
      bankAccount: [this.currentOwner.bankAccount],
      secondPhoneNumber: [this.currentOwner.secondPhoneNumber],
      address: [this.currentOwner.address],
      details: [this.currentOwner.details],
    });
  }

  async onSubmit() {
    this.submitted = true;
    if (this.OwnerDetailsForm.invalid) {
      return;
    }
    if (this.OwnerDetailsForm.valid) {
      var currentOwner = this.OwnerDetailsForm.value as Owner;
      if (currentOwner.doc_id !== '') {
        currentOwner.doc_id = this.currentOwner.doc_id;
        await this.ownerservice.updatecurrentOwner(currentOwner);
      }
      this.dialogRef.close();
    }
  }
}
