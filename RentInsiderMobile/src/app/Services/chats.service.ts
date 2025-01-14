import { Injectable,NgZone, EventEmitter } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth'
import {AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument, DocumentReference, fromDocRef} from '@angular/fire/firestore'
import * as firebase from 'firebase';
import {Property} from '../Models/property';
import {Subject} from '../Models/subject';
import {first} from 'rxjs/internal/operators/first';
import { Reference } from '@angular/compiler/src/render3/r3_ast';
import { from, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { LiteralPrimitive } from '@angular/compiler';
import { stringify } from '@angular/compiler/src/util';
import { Renter } from '../Models/renter';
import { Subscription } from 'rxjs/internal/Subscription'; 
import { Router } from '@angular/router';
import { Chat } from '../Models/chat';


@Injectable({
    providedIn: 'root'
  })
export class ChatsService{
    subsVar: Subscription; 
    constructor(
        private database: AngularFirestore,
        public NgZone: NgZone,
        private afs: AngularFirestore,
        private router: Router,
        ){
        }
        response(){
          console.log("Service works!");
        }

        test(){
          this.afs.collection("Chats").doc("Merge").set({
            merge:"merge"
          })
        }

    addChat(chat: Chat){
      this.afs.collection("Chats").add({
        date: chat.date,
        message: chat.message,
        sender: chat.sender,
        subjectID: chat.subjectID,
        type: chat.type
      }).then((docRef) => {
        console.log("/Chat added with ID: ", docRef.id);
      }).catch((error) => {
        console.error("Error adding subject: ", error);
      });
    }

    updateChat(chat: Chat){
      this.afs.doc(`Chats/${chat.id}`).update({
        subjectId: chat.subjectID
      })
    }

    deleteChat(chatID){
      return this.afs.collection("Chats").doc(chatID).delete();
    }

    getChatBySubjectID(subjectID:string){
      return this.afs.collection('Chats').doc(subjectID).ref.get().then(doc=>{
        if(doc.exists)
        {
        return doc.data() as Chat;
        }
        else
        console.log("Chatul selectat nu exista!");
      });
    }

    getChatByID(chatID: string){
      return this.afs.collection('Subjects').doc(chatID).ref.get().then(doc=>{
        if(doc.exists)
        {
        return doc.data() as Chat;
        }
        else
        console.log("Chatul selectat nu exista!");
      });
    }

    getChats(subjectID: string){
        return this.database.collection('Chats', chat => chat.where('subjectID', '==', subjectID)).snapshotChanges().pipe
        (map(changes => {
        return changes.map(a => {
            const data = a.payload.doc.data();
            return data;
        });
        }));
    }
}