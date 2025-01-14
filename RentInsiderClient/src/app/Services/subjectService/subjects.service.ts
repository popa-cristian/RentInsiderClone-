import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentReference,
  fromDocRef,
} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { Property } from '../../Models/property';
import { Subject } from '../../Models/subject';
import { first } from 'rxjs/internal/operators/first';
import { Reference } from '@angular/compiler/src/render3/r3_ast';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LiteralPrimitive } from '@angular/compiler';
import { stringify } from '@angular/compiler/src/util';
import { Renter } from '../../Models/renter';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription;

  constructor(
    private http: HttpClient,
    private database: AngularFirestore,
    public NgZone: NgZone,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  onFirstComponentButtonClick(property: Property) {
    if (property != undefined) this.invokeFirstComponentFunction.emit(property);
  }

  addSubject(subject: Subject) {
   
    this.afs
      .collection('Subjects')
      .add({
        ownerID: subject.ownerID,
        renterID: subject.renterID,
        propertyID: subject.propertyID,
        title: subject.title,
        description: subject.description,
        importance: subject.importance.toString(),
      })
      .then((docRef) => {
        console.log('Subject added with ID: ', docRef.id);
      })
      .catch((error) => {
        console.error('Error adding subject: ', error);
      });
  }

  updateSubject(subject: Subject) {
    this.afs.doc(`Subjects/${subject.id}`).update({
      title: subject.title,
      description: subject.description,
      importance: subject.importance,
    });
  }

  deleteSubject(subjectID) {
    return this.afs.collection('Subjects').doc(subjectID).delete();
  }

  getPropertyBySubjectID(ID: string) {
    return this.afs
      .collection('Properties')
      .doc(ID)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data() as Property;
        } else console.log('Subiectul selectat nu exista!');
      });
  }
  getSubjectByID(ID: string) {
    return this.afs
      .collection('Subjects')
      .doc(ID)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data() as Subject;
        } else {
          console.log('Subiectul selectat nu exista!');
          return null;
        }
      });
  }

  getSubjectsCreatedOnProperty(property: Property) {
    return this.afs
      .collection('Subjects', (subject) =>
        subject.where('propertyID', '==', property.id)
      )
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((a) => {
            const data = a.payload.doc.data() as Subject;
            data.id = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getSubjects() {
    return this.database
      .collection('Subjects')
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((a) => {
            const data = a.payload.doc.data();
            return data;
          });
        })
      );
  }
}
