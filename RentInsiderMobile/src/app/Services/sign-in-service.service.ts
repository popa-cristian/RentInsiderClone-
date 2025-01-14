import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Owner } from '../Models/owner';
import { Renter } from '../Models/renter';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class SignInServiceService {
  ownerUserData: any;
  isLoggedIn = false
  isOwner = false;
  emailIsCorrect = false;
  constructor(
    public firebaseAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private router: Router
  ) { }

  async signin(
    email: string,
    password: string
  ) {
    var isvalidowner = false;
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(async res => {
        this.isLoggedIn = true
        var user = this.firebaseAuth.currentUser;
        sessionStorage.setItem('user', JSON.stringify(res.user))
        if ((await user).emailVerified) {
        }
        else {
          sessionStorage.setItem('user', JSON.stringify(res.user))
          // window.alert("Emailul nu a fost verificat!");
          this.isLoggedIn = false;
          throw new Error("Emailul nu a fost verificat!");
        }
      })
  }

  secondOwnersignin(email: string, password: string, owners: Owner[]) {

    if (owners == undefined) {
      console.log("Array GOL");
    } else {
      for (let index of Object.keys(owners)) {
        var emailcurent = owners[index];
        if (owners[index].email == email) {
          this.firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(async res => {
              this.isLoggedIn = true
              var user = this.firebaseAuth.currentUser;
              sessionStorage.setItem('user', JSON.stringify(res.user));
              if ((await (user)).emailVerified) {
                this.router.navigateByUrl('/owner-main-menu-page');
              } else {
                this.handleLogout();
              }
            })
          break;
        }
      }
    }
  }

  secondRentersignin(email: string, password: string, Renters: Renter[]) {

    if (Renters == undefined) {
      console.log("Array GOL");
    } else {
      for (let index of Object.keys(Renters)) {
        var emailcurent = Renters[index];
        if (Renters[index].email == email) {
          this.firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(async res => {
              this.isLoggedIn = true
              var user = this.firebaseAuth.currentUser;
              sessionStorage.setItem('user', JSON.stringify(res.user));
              if ((await (user)).emailVerified) {
                console.log("RENTMENU");
                this.router.navigateByUrl('/rent-main-menu-page');
              } else {
                this.handleLogout();
              }
            })
          break;
        }
      }
    }
  }

  handleLogout() {
    this.isLoggedIn = false;
    this.logout();
    sessionStorage.removeItem('user');
    // window.alert("Eroare la autentificare!");
  }

  getallRenters() {
    return this.afs.collection('Renters').snapshotChanges().pipe
      (map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Renter;
          data.id = a.payload.doc.id;
          return data;
        });
      }))
  }

  getallOwners() {
    return this.afs.collection('Owners').snapshotChanges().pipe
      (map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Owner;
          data.doc_id = a.payload.doc.id;
          return data;
        });
      }))
  }


  logout() {
    this.isLoggedIn = false;
    sessionStorage.removeItem('user');
    this.firebaseAuth.signOut();
    this.router.navigateByUrl('sign-in');
  }

  getOwnerswithemail(email: string) {
    return this.afs.collection('Owners', owners => owners.where('email', '==', email)).snapshotChanges().pipe
      (map(changes => {
        changes.map(a => {
          const data = a.payload.doc.data() as Owner;
          data.doc_id = a.payload.doc.id;
        });
      }))
  }


  async resetPassword(email: string) {
    await this.firebaseAuth.sendPasswordResetEmail(email).then(function () {
      // window.alert("Emailul pentru resetarea parolei a fost trimis!")
    }).catch((error) => {
      throw new Error(error.message);
    });
  }
  response() {
    console.log("Service works!");
  }

  getCurrentuseremail() {
    this.ownerUserData = JSON.parse(sessionStorage.getItem('user'));
    return this.afs.collection("Owners", ref => ref.where(
      'email', '==', this.ownerUserData.email).limit(1)).snapshotChanges().pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Owner;
          data.doc_id = a.payload.doc.id;
          return data;
        })
      }));
  }

  async OwnerAuthentication(email: string, password: string, owners: Owner[]) {
    if ((owners == undefined) || (owners.length == 0)) {
      /* window.alert("Something went wrong. Please try again");
      return; */
      throw new Error("Ceva nu a functionat. Te rugam sa incerci din nou.");
    } else {
      for (let index of Object.keys(owners)) {
        var emailcurent = owners[index];
        if (owners[index].email == email) {
          this.emailIsCorrect = true;
          await this.firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(async res => {
              this.isLoggedIn = true
              var user = this.firebaseAuth.currentUser;
              if (user == null || user == undefined) {
                throw new Error("Email gresit!");
              }
              sessionStorage.setItem('user', JSON.stringify(res.user));
              if ((await (user)).emailVerified) {
                this.router.navigateByUrl('/owner-main-menu-page');
              } else {
                this.handleLogout();
              }
            }).catch((error) => {
              throw new Error(error.message);
            });
          break;
        }
      }
    }
    if ((!this.emailIsCorrect) && (owners != undefined)) {
      //  window.alert('Ati introdus e-mail-ul gresit!');
      throw new Error("Email gresit!");
    }
  }

  RenterAuthentication(email: string, password: string, renters: Renter[]) {

    if ((renters == undefined) || (renters.length == 0)) {
      throw new Error("Ceva n-a functionat. Te rugam sa incerci din nou!");
      return;
    } else {
      for (let index of Object.keys(renters)) {
        var emailcurent = renters[index];
        if (renters[index].email == email) {
          this.emailIsCorrect = true;
          this.firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(async res => {
              this.isLoggedIn = true
              var user = this.firebaseAuth.currentUser;

              if (user == null || user == undefined) {
                throw new Error("Ati introdus email-ul gresit!");
              }
              sessionStorage.setItem('user', JSON.stringify(res.user));
              if ((await (user)).emailVerified) {
                //this.router.navigateByUrl('/rent-main');
                console.log("RENTMENU");
                this.router.navigateByUrl('/rent-main-menu-page');
              } else {
                this.handleLogout();
              }
            }).catch((error) => {
              throw new Error("Parola introdusa este gresita!");
            });
          break;
        }
      }
    }
    if ((!this.emailIsCorrect) && (renters != undefined)) {
      throw new Error("Ati introdus email-ul gresit!");
    }
  }


}

