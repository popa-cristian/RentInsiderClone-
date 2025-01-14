import { Injectable,NgZone, EventEmitter } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth'
import {AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument, DocumentReference, fromDocRef} from '@angular/fire/firestore'
import * as firebase from 'firebase';
import {Property} from '../Models/property';
import {first} from 'rxjs/internal/operators/first';
import { Reference } from '@angular/compiler/src/render3/r3_ast';
import { from, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { SignInServiceService } from './sign-in-service.service';
import { LiteralPrimitive } from '@angular/compiler';
import { stringify } from '@angular/compiler/src/util';
import { Renter } from '../Models/renter';
import { Subscription } from 'rxjs/internal/Subscription'; 

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  properties: Observable<Property[]>;
  propertycollection: AngularFirestoreCollection;
  userNames: any;
  ownerUserData;
  signinservice:SignInServiceService;
  id:string;
  invokeFirstComponentFunction = new EventEmitter();    
  subsVar: Subscription;
  propertyForRefresh: Property;
  
  constructor(
    private afs: AngularFirestore,
    private afauth:AngularFireAuth,
    public NgZone:NgZone) { 
      this.propertycollection = this.afs.collection('Properties');
    }
    items=[];

    refreshOwnerMainPage(property:Property) {    
      this.invokeFirstComponentFunction.emit(property);    
    } 

    addProperty(PropertyToBeAdded:Property) {
      var ownerID = JSON.parse(sessionStorage.getItem('user')).uid;
      this.afs.collection("Properties").add({
        title:PropertyToBeAdded.title,
        price:PropertyToBeAdded.price,
        county:PropertyToBeAdded.county,
        city:PropertyToBeAdded.city,
        address:PropertyToBeAdded.address,
        surface: PropertyToBeAdded.surface,
        water_consumption_index:PropertyToBeAdded.water_consumption_index,
        partitioning:PropertyToBeAdded.partitioning,
        floor: PropertyToBeAdded.floor,
        due_date: PropertyToBeAdded.due_date,
        number_of_rooms:PropertyToBeAdded.number_of_rooms,
        ownerID: ownerID,
        renterID:''
      }).then((docRef) => {
        console.log("Property added with ID: ", docRef.id);
      }).catch((error) => {
        console.error("Error adding property: ", error);
      });
    }

    updateProperty(PropertyToBeModified:Property){
      var ownerID = JSON.parse(sessionStorage.getItem('user')).uid;
      
      this.afs.doc(`Properties/${PropertyToBeModified.id}`).update({
        title:PropertyToBeModified.title,
        price:PropertyToBeModified.price,
        county:PropertyToBeModified.county,
        city:PropertyToBeModified.city,
        address:PropertyToBeModified.address,
        surface: PropertyToBeModified.surface,
        water_consumption_index:PropertyToBeModified.water_consumption_index,
        partitioning:PropertyToBeModified.partitioning,
        floor: PropertyToBeModified.floor,
        due_date: PropertyToBeModified.due_date,
        number_of_rooms:PropertyToBeModified.number_of_rooms,
        ownerID: ownerID,
      })
        this.getPropertyWIthID(PropertyToBeModified.id);
    }

    deleteProperty(PropertyToBeDeleted:Property){
      this.afs.doc(`Properties/${PropertyToBeDeleted.id}`).delete();
    }

getPropertyWIthID(propertyID:string){
    var obsprop= from(this.getPropertyByID(propertyID))
    obsprop.subscribe(property=>{
      this.propertyForRefresh=property;
      this.propertyForRefresh.id=propertyID;
        this.refreshOwnerMainPage(this.propertyForRefresh)
    })
  }

getPropertyByID(propertyID:string){
      return this.afs.collection('Properties').doc(propertyID).ref.get().then(doc=>{
        if(doc.exists)
        {
        return doc.data() as Property;
        }
        else
        console.log("Nu exista proprietatea selectata");
      });
    }

  getPropertiesFromUser() {
    var ownerId = JSON.parse(sessionStorage.getItem('user')).uid;
    return this.afs.collection("Properties", property => property.where('ownerID', '==', ownerId)).snapshotChanges().pipe
    (map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Property;
        data.id = a.payload.doc.id;
        return data;
      });
    }))
  }

  updateWaterConsumptionIndex(new_index:number,propertyID:string){
    this.afs.collection("Properties").doc(propertyID).update({
      water_consumption_index:new_index
    });
  }

  response(){
    console.log("Service works!");
  }
  test(){
    this.afs.collection("Properties").doc("Merge").set({
      merge:"merge"
    })
  }
}


