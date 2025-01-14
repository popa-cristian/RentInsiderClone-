import { Injectable,NgZone } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth'
import {AngularFirestore,AngularFirestoreDocument} from '@angular/fire/firestore'
import * as firebase from 'firebase';
import {first} from 'rxjs/internal/operators/first';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})

export class SignUpServiceService {
  isLoggedIn = false
  constructor(
    public firebaseAuth : AngularFireAuth,
    public afs: AngularFirestore,
    public NgZone:NgZone) { }

    response(){
      console.log("Service works!");
    }

  async signup(user: User) {
    await this.firebaseAuth.createUserWithEmailAndPassword(user.email,user.password)
      .then((res)=>{
      this.isLoggedIn = true
      sessionStorage.setItem('user',JSON.stringify(res.user))
      res.user.sendEmailVerification();
        this.afs.doc(`Owners/${res.user.uid}`).set({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          telephone: user.telephone
        })
      }).catch(() => {})
  }

  logout(){
    this.firebaseAuth.signOut()
    sessionStorage.removeItem('user')
  }
}




