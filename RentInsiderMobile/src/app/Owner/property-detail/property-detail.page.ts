import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Owner } from 'src/app/Models/owner';
import { Property } from 'src/app/Models/property';
import { Renter } from 'src/app/Models/renter';
import { FileUploadService } from 'src/app/Services/file.service';
import { OwnerService } from 'src/app/Services/owner.service';
import { Location } from '@angular/common';
import { SignInServiceService } from 'src/app/Services/sign-in-service.service';
import { PropertyService } from 'src/app/Services/property.service';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

// delete renter functionality
import { RenterDBService } from 'src/app/Services/renter-db.service';
// for delete renter confirmation modal
import swal from 'sweetalert';


@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.page.html',
  styleUrls: ['./property-detail.page.scss'],
})
export class PropertyDetailPage implements OnInit {

  currentProperty:Property;
  currentOwner:Owner;
  renters:Renter[];
  renter:Renter;
  fullName: string;
  currentPropertyID: string;
  static translator: TranslateService;

  constructor(
    private afs:AngularFirestore,
    private ownerService:OwnerService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private _location:Location,
    private signInService:SignInServiceService,
    private propertyService:PropertyService,
    private menuController:MenuController,
    private renterService: RenterDBService,
    private readonly translateService: TranslateService
  ){}

  ngOnInit() {
    PropertyDetailPage.translator = this.translateService;
    this.currentPropertyID = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.currentPropertyID!=null)
      this.getInfoByPropertyID(this.currentPropertyID);    
  }

  ionViewWillEnter(){
    this.menuController.enable(true, "first");
  }

  getInfoByPropertyID(propertyID:string){
    from(this.propertyService.getPropertyByID(propertyID)).subscribe(property=>{
      this.currentProperty=property;
      this.currentProperty.id=this.currentPropertyID;
      this.getCurrentRenter();
    })
  }

  getCurrentOwner(){
    from(this.ownerService.getCurrentOwner()).subscribe(owner=>{
      this.currentOwner=owner;
    })
  }

  getCurrentRenter(){
    this.getRenterofselectedProperty(this.currentProperty).subscribe(renters=> {
      this.renter=renters[0];
    })   
  }

  getRenterofselectedProperty(selectedProperty:Property){
    return this.afs.collection("Renters",ref=>ref.where('propertyID','==',selectedProperty.id).limit(1)).snapshotChanges().pipe
    (map(changes => {
    return changes.map(a => {
      const data = a.payload.doc.data() as Renter;
      data.id = a.payload.doc.id;
      return data;
    });
  }))
  }

  editProperty(item:Property){
    let navigationExtras: NavigationExtras = {
      state: {
        currentItem: item,
      }
    };
    
    this.router.navigate(['/add-property'], navigationExtras);
  }

  PreviousPage(){
    this._location.back();
  }

  openRenterDetailPage(){
    const navigationExtras: NavigationExtras={
      state:{
        selectedProperty:this.currentProperty,
        currentRenter:this.renter
      }
    };
    this.router.navigate(['renter-detail'], navigationExtras);
  }

  openAddRenterPage() {
    const navigationExtras: NavigationExtras={
      state:{
        selectedProperty:this.currentProperty,
      }
    };
    this.router.navigate(['/add-renter'], navigationExtras);
  }

  // delete renter modal
  deleteRenter() {
    swal({
      title: this.translateService.instant('property-detail.delete-renter-modal-title'),
      icon: 'warning',
      buttons: [this.translateService.instant('property-detail.delete-modal-cancel'),
                this.translateService.instant('property-detail.delete-modal-delete')],
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        try {
          this.renterService.deleteRenter(this.renter.id, this.renter.propertyID)
        } catch (err) {
          swal({
            title: this.translateService.instant('property-detail.delete-modal-error'),
            icon: 'error'
          });
        }
      }
    });
  }

  // delete property
  deleteProperty() {
    swal({
      title: this.translateService.instant('property-detail.delete-property-modal-title'),
      icon: 'warning',
      buttons: [this.translateService.instant('property-detail.delete-modal-cancel'),
                this.translateService.instant('property-detail.delete-modal-delete')],
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        try {
          if (this.renter)
          {
            this.renterService.deleteRenter(this.renter.id, this.renter.propertyID);
          }
          this.propertyService.deleteProperty(this.currentProperty);
          this.router.navigate(['owner-main-menu-page']);

        } catch (err) {
          swal({
            title: this.translateService.instant('property-detail.delete-modal-error'),
            icon: 'error'
          });
        }
      }
    });
  }

  close(){
    this.signInService.logout();
    this.router.navigateByUrl('');
  }

  getFullName(): String{
    if(this.renter)
      {
        var firstName= new String(" "+ this.renter.firstName);
        var lastName= new String(this.renter.lastName);
        this.fullName= lastName.concat(firstName.toString());
        return this.fullName;
      }
  }

  openSubjectList(){
    let navigationExtras: NavigationExtras = {
      state: {
        currentItem: this.currentProperty,
      }
    };
    this.router.navigate(['/chatroom-menu'], navigationExtras);
  }

  openExpensePage(item:Property){
    this.router.navigate(['/expenses', { id: item.id }]);
  }

  openUploadedFiles(item:Property){
    this.router.navigate(['/uploaded-files', { id: item.id }]);
  }


}

export function getPropertyDetailTranslateService() {
  return PropertyDetailPage.translator;
}