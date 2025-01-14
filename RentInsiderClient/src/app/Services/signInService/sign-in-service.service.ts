import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, windowCount } from 'rxjs/operators';
import { Owner } from '../../Models/owner';
import { Renter } from '../../Models/renter';
import { Router } from '@angular/router';
import { DialogService } from '../dialogService/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class SignInServiceService {
  ownerUserData: any;
  isLoggedIn = false;
  emailIsCorrect = false;
  isOwner = false;
  constructor(
    public firebaseAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private router: Router,
    private dialogService: DialogService
  ) {}

  OwnerAuthentication(
    email: string,
    password: string,
    owners: Owner[],
    callback
  ) {
    if (owners.some((owner) => owner.email == email)) {
      this.emailIsCorrect = true;
      this.firebaseAuth
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          var user = this.firebaseAuth.currentUser;
          if (user == null || user == undefined) {
            //signInWithEmailAndPassword maybe failed
            alert(
              'signInWithEmailAndPassword maybe failed - look sign-in-service-OwnerAuthentication'
            );
          } else {
            this.isLoggedIn = true;
            sessionStorage.setItem('user', JSON.stringify(res.user));
            this.router.navigateByUrl('/owner-main-page');
          }
        })
        .catch((error) => {
          //signInWithEmailAndPassword failed
          callback(new Error('wrong-credentials'));
          return;
        });
    } else {
      this.emailIsCorrect = false;
      callback(new Error('wrong-credentials'));
    }
  }

  RenterAuthentication(
    email: string,
    password: string,
    renters: Renter[],
    callback
  ) {
    if (renters.some((renter) => renter.email == email)) {
      this.emailIsCorrect = true;
      this.firebaseAuth
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          var user = this.firebaseAuth.currentUser;
          if (user == null || user == undefined) {
            //signInWithEmailAndPassword maybe failed
            alert(
              'signInWithEmailAndPassword maybe failed - look sign-in-service-OwnerAuthentication'
            );
          } else {
            this.isLoggedIn = true;
            sessionStorage.setItem('user', JSON.stringify(res.user));
            this.router.navigateByUrl('/rent-main-page');
          }
        })
        .catch((error) => {
          //signInWithEmailAndPassword failed
          callback(new Error('wrong-credentials'));
          return;
        });
    } else {
      this.emailIsCorrect = false;
      callback(new Error('wrong-credentials'));
    }
  }

  handleLogout() {
    this.isLoggedIn = false;
    this.emailIsCorrect = false;
    this.logout();
    sessionStorage.removeItem('user');
  }

  getAllRenters() {
    return this.afs
      .collection('Renters')
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((a) => {
            const data = a.payload.doc.data() as Renter;
            data.id = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getAllOwners() {
    return this.afs
      .collection('Owners')
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((a) => {
            const data = a.payload.doc.data() as Owner;
            data.doc_id = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  logout() {
    this.isLoggedIn = false;
    sessionStorage.removeItem('user');
    this.firebaseAuth.signOut();
    this.router.navigateByUrl('sign-in-component');
  }

  getOwnerswithemail(email: string) {
    return this.afs
      .collection('Owners', (owners) => owners.where('email', '==', email))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          changes.map((a) => {
            const data = a.payload.doc.data() as Owner;
            data.doc_id = a.payload.doc.id;
          });
        })
      );
  }

  async resetPassword(email: string) {
    await this.firebaseAuth
      .sendPasswordResetEmail(email) /* .then(function()
    {
      window.alert("Email-ul pentru resetarea parolei a fost trimis!")
    }) */
      .catch((error) => {
        //window.alert(error.message)
        throw new Error(error.message);
      });
  }

  getCurrentuseremail() {
    this.ownerUserData = JSON.parse(sessionStorage.getItem('user'));
    return this.afs
      .collection('Owners', (ref) =>
        ref.where('email', '==', this.ownerUserData.email).limit(1)
      )
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((a) => {
            const data = a.payload.doc.data() as Owner;
            data.doc_id = a.payload.doc.id;
            return data;
          });
        })
      );
  }
}
