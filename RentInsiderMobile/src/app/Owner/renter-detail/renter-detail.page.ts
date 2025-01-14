import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Renter } from 'src/app/Models/renter';
import { ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-renter-detail',
  templateUrl: './renter-detail.page.html',
  styleUrls: ['./renter-detail.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RenterDetailPage implements OnInit {

  RenterDetailForm: FormGroup;
  submitted = false;
  valid = false;
  data: any;
  currentRenter: Renter;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _location:Location,
    private formBuilder: FormBuilder
    ) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.currentRenter = this.router.getCurrentNavigation().extras.state.currentRenter;
        this.initializeFormGroup(this.currentRenter);
        
      }
    });

  }
  
  initializeFormGroup(currentRenter: Renter) {
    this.RenterDetailForm = this.formBuilder.group({
      lastName: [currentRenter.lastName],
      firstName: [currentRenter.firstName],
      cnp: [currentRenter.cnp],
      address:[currentRenter.address],
      email: [currentRenter.email],
      telephone:[currentRenter.telephone],
      number_of_individuals:[currentRenter.number_of_individuals],
    });
  }

  close(){
    this._location.back();
  }

 
}
