import { Component, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { FormBuilder,FormGroup,Validator} from '@angular/forms';
import { Validators } from '@angular/forms';
import { Owner } from 'src/app/Models/owner';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {Location} from '@angular/common';
import { OwnerService } from 'src/app/Services/owner.service';
import { VerifyCNP } from 'src/app/utils/CNP.validator';
import { VerifyPhoneNr } from 'src/app/utils/PhoneNr.validator';
import swal from 'sweetalert';

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.page.html',
  styleUrls: ['./owner-edit.page.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class OwnerEditPage implements OnInit {
  OwnerDetailsForm: FormGroup;
  submitted=false;
  valid=false;
  currentOwner:Owner;
  data:any; 

  constructor(
    private activatedRoute:ActivatedRoute, 
    private router:Router,
    private formBuilder: FormBuilder,
    private ownerService:OwnerService,
    private _location:Location,
  ) { this.activatedRoute.queryParams.subscribe(params =>{
    if(this.router.getCurrentNavigation().extras.state){
      this.currentOwner = this.router.getCurrentNavigation().extras.state.currentOwner;
    }
  });}

  ngOnInit(): void {
    //Possibly duplicate code
    /* this.OwnerDetailsForm=this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      firstPhoneNumber: ['', Validators.required],
      cnp: ['', [VerifyCNP()]],
      bankAccount:[''],
      secondPhoneNumber:[''],
      address:[''],
      number_of_individuals:[''],
      firstAuxiliaryPayment:[''],
      secondAuxiliaryPayment:[''],
      details:[''],
      
    }); */    
    this.initializeFormGroup(this.currentOwner);
  }
  get getForm() {
    return this.OwnerDetailsForm.controls;
  }
  initializeFormGroup(currentOwner: Owner) {
    this.OwnerDetailsForm=this.formBuilder.group({
      lastName: [currentOwner.lastName, Validators.required],
      firstName: [currentOwner.firstName, Validators.required],
      email: [currentOwner.email, [Validators.required,Validators.email]],
      firstPhoneNumber: [currentOwner.firstPhoneNumber, [Validators.required, VerifyPhoneNr()]],
      cnp: [currentOwner.cnp, [VerifyCNP()]],
      address:[currentOwner.address, Validators.required],
      bankAccount:[currentOwner.bankAccount,Validators.required],
      secondPhoneNumber:[currentOwner.secondPhoneNumber,[Validators.required, VerifyPhoneNr()]],
    });
  }

  onSubmit(){
    this.submitted=true;
    
    if(this.OwnerDetailsForm.invalid){
      //At least the dev should see the wrong fields
      for(const name in this.getForm)
      {
          if(this.getForm[name].errors!=null)
            console.error(name, this.getForm[name].errors);          
      }
    }
    if(this.OwnerDetailsForm.valid) {
      var currentOwner = this.OwnerDetailsForm.value as Owner;
        this.ownerService.updatecurrentOwner(currentOwner);
      }
  }

  PreviousPage(){
    this._location.back();
  }

checkFormular(){

  if(this.OwnerDetailsForm.invalid)
  {
    swal({
      title:"Formularul este invalid!",
      icon:"error",

  });
  }
  else
  {
    swal({
      title:"Salvat!",
      icon:"success",

    });
  }

 }  
}

