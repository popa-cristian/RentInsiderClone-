import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Location} from '@angular/common';
import { Partitioning, Property } from 'src/app/Models/property';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropertyService } from 'src/app/Services/property.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Counties } from '../../counties-cities-Romania/judete';

import swal from 'sweetalert';
@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.page.html',
  styleUrls: ['./add-property.page.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class AddPropertyPage implements OnInit {

  selectedProperty:Property;
  property_item:Property;
  PropertyFormGroup: FormGroup;
  AddPropertyForm: FormGroup;
  submitted=false;
  valid=false;
  initialCounty:string;
  initialCity:string;
  modifiedCounty: boolean;
  public cities = [];//  need this 
  public counties = Counties;// import here  
  currentCounty: string; // i need this 
  data:any;
  propertyExists:boolean;

  constructor(private _location:Location,
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private propertyservice: PropertyService
    ) {

    
    if(this.selectedProperty === undefined)
    {
      console.log("3");
      
      this.propertyExists=false;
      this.selectedProperty = {
        title: '',
        surface: 0,
        water_consumption_index: 0,
        price: 0,
        partitioning: null,
        floor: 0,
        county: '',
        city:'',
        address:'',
        number_of_rooms: 0,
        ownerID:'',
        id:'',
        type:'',
        due_date: 0,
        renterID:''
      }
    }
   }

  ngOnInit() {
    this.modifiedCounty = false;
    //this.setCitiesInit();
    this.activatedRoute.queryParams.subscribe(params =>{
      if(this.router.getCurrentNavigation().extras.state){
        console.log("4");
        this.selectedProperty = this.router.getCurrentNavigation().extras.state.currentItem;
        
        this.propertyExists=true;
      }
    });

    this.initializeFormGroup(this.selectedProperty);
  }

  initializeFormGroup(prop: Property) {
    this.initialCounty=prop.county;    
    this.initialCity=prop.city;
    

    this.AddPropertyForm = this.formBuilder.group({
      title: [prop.title, Validators.required],
      county: [prop.county, [Validators.required]],
      city: [prop.city, [Validators.required]],
      address: [prop.address, Validators.required],
      price: [prop.price, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')] ],
      surface: [prop.surface, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')] ],
      water_consumption_index: [prop.water_consumption_index, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')] ],
      floor: [prop.floor, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+$')]],
      partitioning: [prop.partitioning, Validators.required],
      number_of_rooms: [prop.number_of_rooms, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')] ],
      due_date: [prop.due_date, [Validators.required, Validators.min(1), Validators.max(30), Validators.pattern('^[0-9]*$')]] // needs to be changed
    });
  }
  
  public setCities() {
    console.log("1");
    
    this.modifiedCounty = true;
    if (this.AddPropertyForm.controls.county.value) {
      let allCities = [];
      console.log("a");
      
      var close_for = false;
      for (
        let index = 0;
        index < this.counties.length && close_for == false;
        index++
      ) {
        console.log("b");
        console.log(this.AddPropertyForm.controls.county.value);
        
        if (
          this.counties[index].name ===
          this.AddPropertyForm.controls.county.value
        ) {
          console.log("c");
          allCities = this.counties[index].city;
          close_for = true;
        }
      }
      this.cities = allCities.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else {
      console.log("d");
      this.cities = [];
    }
  }

  public setCitiesInit() {
    console.log("2");
    
    if (this.initialCounty) {
      let allCities = [];
      var close_for = false;
      for (
        let index = 0;
        index < this.counties.length && close_for == false;
        index++
      ) {
        if (this.counties[index].name === this.initialCounty) {
          allCities = this.counties[index].city;
          close_for = true;
        }
      }
      this.cities = allCities.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else {
      this.cities[0] = this.initialCity;
    }
  }
  PreviousPage(){
    this._location.back();
  }
    FormularInv()
  {
    swal({
        title:"Formular invalid!",
        icon:"error",

    });
  }
  get getForm() {
    return this.AddPropertyForm.controls;
  }
  onSubmit(){
    this.submitted = true;
    if (this.AddPropertyForm.invalid) {
      this.FormularInv();
     return;
    }
  
    if (this.AddPropertyForm.valid) {
      var propertyToBeAdded = this.AddPropertyForm.value as Property;
      if (this.selectedProperty.id === '') {
        this.propertyservice.addProperty(propertyToBeAdded);
      }
      else {
        propertyToBeAdded.id = this.selectedProperty.id;
        this.propertyservice.updateProperty(propertyToBeAdded);
      }
      this.router.navigate(['owner-main-menu-page']);
      
    }
  }

  checkControls(){
    console.log(this.AddPropertyForm.controls);
  }
    PropNoua()
  { 
    swal({
      title:"Proprietatea a fost salvata!",
      icon:"success",

    });

  }
}
