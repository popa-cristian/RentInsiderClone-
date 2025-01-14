import { Injectable,NgZone } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth'
import {AngularFirestore,AngularFirestoreDocument} from '@angular/fire/firestore'
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { Renter } from '../Models/renter';
import { Property } from '../Models/property';
import { Owner } from '../Models/owner';

@Injectable({
  providedIn: 'root'
})
export class RenterDBService {

  properties: Property[];

  constructor(
    public firebaseAuth : AngularFireAuth,
    public afs: AngularFirestore,
    public NgZone:NgZone) { }

    response(){
      console.log("Service works!");
    }

    test(){
      this.afs.collection("Renters").doc("Merge").set({
        merge:"merge"
      })
    }

  async signup(renterToBeSignedUp: Renter) {
    await this.firebaseAuth
      .createUserWithEmailAndPassword(
        renterToBeSignedUp.email,
        renterToBeSignedUp.password
      )
      .then(res => {        
        const ownerID = JSON.parse(sessionStorage.getItem('user')).uid;

        res.user.sendEmailVerification();

        this.afs.doc(`Renters/${res.user.uid}`).set({
          email: renterToBeSignedUp.email,
          lastName: renterToBeSignedUp.lastName,
          firstName: renterToBeSignedUp.firstName,
          cnp: renterToBeSignedUp.cnp,
          address: renterToBeSignedUp.address,
          telephone: renterToBeSignedUp.telephone,
          number_of_individuals: renterToBeSignedUp.number_of_individuals,
          propertyID: renterToBeSignedUp.propertyID,
          ownerId: ownerID
        });

        this.afs.doc(`Properties/${renterToBeSignedUp.propertyID}`).update({
          renterID: res.user.uid
        });
      }).catch((error) => {
        throw new Error(error.message);
      });
  }

  updateCurrentRenterNumberOfIndividuals(new_number_of_individuals:number){
    var userID = JSON.parse(sessionStorage.getItem('user')).uid;
    this.afs.doc(`Renters/${userID}`).update({
      number_of_individuals:new_number_of_individuals
    })
  }

  getCurrentRenter(){
    var renterID=JSON.parse(sessionStorage.getItem('user')).uid;
      return this.afs.collection('Renters').doc(renterID).ref.get().then(doc=>{
        if(doc.exists) {
          return doc.data() as Renter;
        } else {
          console.log("Nu exista");
          return null;
        }
      });    
  }

  getRenterByID(id:string){
      return this.afs.collection('Renters').doc(id).ref.get().then(doc=>{
        if(doc.exists) {
          return doc.data() as Renter;
        } else {
          console.log("Nu exista");
          return null;
        }
      });    
  }
  
  paymentDate()
  {
    var returned_date;
    this.getPropertyOfCurrentUser().subscribe(properties=>{
      this.properties=properties;
      return this.properties[0].due_date;
    })
  }

  getPropertyOfCurrentUser()
  {
    var renterID = JSON.parse(sessionStorage.getItem('user')).uid;
    return this.afs.collection("Properties", property => property.where('renterID', '==', renterID).limit(1)).snapshotChanges().pipe
    (map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Property;
        data.id = a.payload.doc.id;
        return data;
      });
    }))
  }

  deleteRenter(renterID: string, propertyID: string){
    this.afs.doc(`Properties/${propertyID}`).update({
      renterID:''
    });
    return this.afs.collection("Renters").doc(renterID).delete();
  }

  getCurrentOwner(ownerID:string){
    return this.afs.collection('Owners').doc(ownerID).ref.get().then(doc=>{
      if(doc.exists) {
        return doc.data() as Owner;
      } else {
        console.log("Nu exista");
        return null;
      }
    });
  }
  
  getRentersFromCurrentOwner() {
    var ownerId = JSON.parse(sessionStorage.getItem('user')).uid;
    return this.afs.collection("Renters", renter => renter.where('OwnerID', '==', ownerId)).snapshotChanges().pipe
    (map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Renter;
        data.id = a.payload.doc.id;
        return data;
      });
    }))
  }

  getRentersFromUser() {
    var renteremail = JSON.parse(sessionStorage.getItem('user')).email;
    return this.afs.collection("Renters", property => property.where('Email', '==', renteremail)).snapshotChanges().pipe
    (map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Renter;
        data.id = a.payload.doc.id;
        return data;
      });
    }))
  }

  updatecurrentRenter(rentermods:Renter){
    const currentRenter = JSON.parse(sessionStorage.getItem('user'));
    // la fel ca la Web, dau direct toata entitatea.
    return this.afs.doc(`Renters/${currentRenter.uid}`).update(rentermods);
}

  getRenterOfProperty(property:Property){
    return this.afs.collection('Renters').doc(property.renterID).ref.get().then(doc=>{
      if(doc.exists)
      {
      return doc.data() as Renter;
      }
      else
      console.log("Nu exista");
    });
  }
 

}
