import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { AngularFireStorage } from '@angular/fire/storage';

import { from, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Myfile } from '../../Models/fileupload';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Property } from '../../Models/property';
import { Renter } from '../../Models/renter';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private basePath = '/uploads';
  fileToDelete: Myfile;
  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  onFirstComponentButtonClick(property: Property) {
    this.invokeFirstComponentFunction.emit(property);
  }

  pushFileToStorage(
    fileUpload: Myfile,
    Property: Property
  ): Observable<number | undefined> {
    var ownerID = JSON.parse(sessionStorage.getItem('user')).uid;
    const filePath = `${this.basePath}/${Property.ownerID}/${Property.renterID}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);

    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            this.saveFileData(fileUpload, Property);
          });
        })
      )
      .subscribe();
    return uploadTask.percentageChanges();
  }

  pushFileToStorage_Renter(
    fileUpload: Myfile,
    Property: Property
  ): Observable<number | undefined> {
    var renterID = JSON.parse(sessionStorage.getItem('user')).uid;
    const filePath = `${this.basePath}/${renterID}/${Property.ownerID}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);

    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            this.saveFileData(fileUpload, Property);
          });
        })
      )
      .subscribe();
    return uploadTask.percentageChanges();
  }

  private saveFileData(fileUpload: Myfile, Property: Property): void {
    var ownerID = JSON.parse(sessionStorage.getItem('user')).uid;
    this.afs
      .collection('Files')
      .add({
        name: fileUpload.name,
        url: fileUpload.url,
        ownerID: Property.ownerID,
        renterID: Property.renterID,
        upload_date: fileUpload.upload_date,
      })
      .then((docRef) => {
        console.log('File added with ID: ', docRef.id);
      })
      .catch((error) => {
        console.error('Error adding file: ', error);
      });
  }

  getFiles(renterid: string) {
    return this.afs
      .collection('Files', (ref) => ref.where('renterID', '==', renterid))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((a) => {
            const data = a.payload.doc.data() as Myfile;
            data.id = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getFilesBelongingtoOwner(ownerID: string) {
    return this.afs
      .collection('Files', (ref) => ref.where('ownerID', '==', ownerID))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((a) => {
            const data = a.payload.doc.data() as Myfile;
            data.id = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getFilesOfRenter(ownerID: string, renterID: string) {
    return this.afs
      .collection('Files', (ref) =>
        ref.where('ownerID', '==', ownerID).where('renterID', '==', renterID)
      )
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((a) => {
            const data = a.payload.doc.data() as Myfile;
            data.id = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  deleteFile(fileUpload: Myfile, id: string): void {
    this.deleteFileFromFirestore(id);
    this.deleteFileStorage(fileUpload);
  }

  getFilebyID(id: string) {
    return this.afs
      .collection('Files')
      .doc(id)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data() as Myfile;
        } else throw new Error('Fisierul nu exista!');
      });
  }

  private deleteFileDatabase(fileupload: Myfile) {
    this.afs
      .collection('Files', (ref) => ref.where('url', '==', fileupload.url))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          changes.map((a) => {
            const data = a.payload.doc.data() as Myfile;
            data.id = a.payload.doc.id;
            var doc_id = a.payload.doc.id;
            this.afs.doc(doc_id).delete();
          });
        })
      );
  }

  private deleteFileFromFirestore(id: string) {
    return this.afs.collection('Files').doc(id).delete();
  }

  private deleteFileStorage(file: Myfile): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef
      .child(file.ownerID)
      .child(file.renterID)
      .child(file.name)
      .delete();
  }
}
