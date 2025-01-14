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
import { OwnerService } from '../../Services/ownerService/owner.service';
import { Owner } from '../../Models/owner';
import { from } from 'rxjs';

@Component({
  selector: 'app-owner-info',
  templateUrl: './owner-info.component.html',
  styleUrls: ['./owner-info.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OwnerInfoComponent implements OnInit {
  OwnerDetailsForm: FormGroup;
  submitted = false;
  valid = false;
  value: any;
  currentOwner: Owner;
  constructor(
    private modalService: BsModalService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OwnerInfoComponent>,
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
    } else {
      this.currentOwner = data.currentOwner;
    }
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

  onCancelClick(): void {
    this.dialogRef.close();
  }

  initializeFormGroup(currentOwner: Owner) {
    this.OwnerDetailsForm = this.formBuilder.group({
      lastName: [currentOwner.lastName, Validators.required],
      firstName: [currentOwner.firstName, Validators.required],
      email: [currentOwner.email, [Validators.required, Validators.email]],
      firstPhoneNumber: [currentOwner.firstPhoneNumber, Validators.required],
      bankAccount: [currentOwner.bankAccount],
      secondPhoneNumber: [currentOwner.secondPhoneNumber],
    });
  }
}
