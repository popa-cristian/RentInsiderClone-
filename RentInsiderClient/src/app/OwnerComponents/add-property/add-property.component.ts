import { Component, OnInit, Input, Inject } from '@angular/core';
import {} from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Counties } from '../../CommonComponents/counties-cities-Romania/judete';
import { PropertyService } from '../../Services/propertyService/property.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Property } from '../../Models/property';
import { FormBuilder, FormGroup, Validator } from '@angular/forms';
import { Validators } from '@angular/forms';
import { DialogService } from 'src/app/Services/dialogService/dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddPropertyComponent implements OnInit {
  property: Property;
  PropertyFormGroup: FormGroup;
  submitted = false;
  valid = false;
  selectedProperty: Property;
  initialCounty: string;
  initialCity: string;
  modifiedCounty: boolean;
  public cities = []; //  need this
  public counties = Counties; // i need this
  currentCounty: string; // i need this
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddPropertyComponent>,
    public propertyService: PropertyService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private dialogService: DialogService,
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

  ngOnInit(): void {
    this.dialogRef.updatePosition();
    this.initializeFormGroup(this.selectedProperty);
    this.modifiedCounty = false;
    this.setCitiesInit();
  }

  initializeFormGroup(prop: Property) {
    this.initialCounty = prop.county;
    this.initialCity = prop.city;
    this.PropertyFormGroup = this.formBuilder.group({
      title: [prop.title, Validators.required],
      county: [prop.county],
      city: [prop.city],
      address: [prop.address, Validators.required],
      price: [prop.price, Validators.min(0)],
      surface: [prop.surface, Validators.min(1)],
      water_consumption_index: [
        prop.water_consumption_index,
        Validators.min(1),
      ],
      floor: [prop.floor, [Validators.min(0), Validators.max(100)]],
      partitioning: [prop.partitioning, Validators.required],
      number_of_rooms: [prop.number_of_rooms, Validators.min(1)],
      due_date: [prop.due_date, [Validators.min(1), Validators.max(30)]],
    });
  }

  public setCities() {
    this.modifiedCounty = true;
    if (this.PropertyFormGroup.controls.county.value) {
      let allCities = [];
      var close_for = false;
      for (
        let index = 0;
        index < this.counties.length && close_for == false;
        index++
      ) {
        if (
          this.counties[index].name ===
          this.PropertyFormGroup.controls.county.value.name
        ) {
          allCities = this.counties[index].city;
          close_for = true;
        }
      }
      this.cities = allCities.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else {
      this.cities = [];
    }
  }

  public setCitiesInit() {
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

  get getForm() {
    return this.PropertyFormGroup.controls;
  }

  onSubmit() {
    if (this.PropertyFormGroup.invalid) {
      this.dialogService.openErrorDialog(
        this.translateService.instant("add-property.on-submit.error.title"),
        this.translateService.instant("add-property.on-submit.error.message")
      );
    } else {
      var propertyToBeAdded = this.PropertyFormGroup.value as Property;
      this.setValueOfCounty();
      if (this.selectedProperty.id === '') {
        this.propertyService.addProperty(propertyToBeAdded);
      } else {
        propertyToBeAdded.id = this.selectedProperty.id;
        this.propertyService.updateProperty(propertyToBeAdded);
      }
      this.dialogRef.close();
      this.dialogService.openSuccessDialog(
        this.translateService.instant("add-property.on-submit.success.title"),
        this.translateService.instant("add-property.on-submit.success.message")
      );
    }
  }

  reloadCurrentPage() {
    window.location.reload();
  }

  setValueOfCounty(): void {
    var propertyToBeAdded = this.PropertyFormGroup.value as Property;

    propertyToBeAdded.county =
      this.PropertyFormGroup.controls.county.value.name;
    if (propertyToBeAdded.county == undefined) {
      propertyToBeAdded.county = this.initialCounty;
    }
  }
}
