import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/internal/operators/first';
import { Renter } from '../../Models/renter';
import { Property } from '../../Models/property';
import { Owner } from '../../Models/owner';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  constructor(
    public firebaseAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public NgZone: NgZone
  ) {}

  async updatecurrentOwner(ownermods: Owner) {
    var currentOwner = JSON.parse(sessionStorage.getItem('user'));
    await this.afs.doc(`Owners/${currentOwner.uid}`).update({
      lastName: ownermods.lastName,
      firstName: ownermods.firstName,
      email: ownermods.email,
      firstPhoneNumber: ownermods.firstPhoneNumber,
      cnp: ownermods.cnp,
      bankAccount: ownermods.bankAccount,
      secondPhoneNumber: ownermods.secondPhoneNumber,
      address: ownermods.address,
      details: ownermods.details,
    });
  }

  getCurrentOwner() {
    var ownerID = JSON.parse(sessionStorage.getItem('user')).uid;
    return this.afs
      .collection('Owners')
      .doc(ownerID)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          const owner = doc.data() as Owner;          
          return owner;
        } else {
          console.log('Nu exista');
          return null;
        }
      });
  }
}