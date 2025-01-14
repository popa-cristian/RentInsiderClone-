import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { Owner } from 'src/app/Models/owner';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-owner-details',
  templateUrl: './owner-details.page.html',
  styleUrls: ['./owner-details.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OwnerDetailsPage implements OnInit {
  OwnerDetailsForm: FormGroup;
  submitted = false;
  valid = false;
  data: any;
  currentOwner: Owner;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.currentOwner = this.router.getCurrentNavigation().extras.state.currentOwner;
        this.initializeFormGroup(this.currentOwner);
      }
    });
  }
  
  initializeFormGroup(currentOwner: Owner) {
    this.OwnerDetailsForm = this.formBuilder.group({
      lastName: [currentOwner.lastName],
      firstName: [currentOwner.firstName],
      email: [currentOwner.email],
      firstPhoneNumber: [currentOwner.firstPhoneNumber],
      cnp: [currentOwner.cnp],
      bankAccount: [currentOwner.bankAccount],
      secondPhoneNumber: [currentOwner.secondPhoneNumber],
      address: [currentOwner.address],
      first_payment_method: [currentOwner.first_payment_method],
      second_payment_method: [currentOwner.second_payment_method],
    });
  }

  close(){
    this.router.navigate(['rent-main-menu-page']);
  }

}
