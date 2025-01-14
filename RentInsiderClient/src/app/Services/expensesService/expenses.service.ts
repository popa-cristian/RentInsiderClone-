import { EventEmitter, Injectable,NgZone } from '@angular/core';
import {AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument, DocumentReference, fromDocRef} from '@angular/fire/firestore'
import {Property} from '../../Models/property';
import { Observable, Subscription} from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import {Expense} from '../../Models/expense'
import { Myfile } from '../../Models/fileupload';
import {FileUploadService} from '../fileService/file.service'
import { Renter } from '../../Models/renter';
import { AngularFireStorage } from '@angular/fire/storage';



@Injectable({
  providedIn: 'root'
  
})
export class ExpensesService {
  expenses:Expense[];
  private basePath = '/expenses';
  invokeFirstComponentFunction = new EventEmitter();    
    subsVar: Subscription; 
  constructor(
    private afs:AngularFirestore,
    private fileservice:FileUploadService,
    private storage: AngularFireStorage,

    

  ) { }


  ExpenseInterrogation(property:Property) {    
    this.invokeFirstComponentFunction.emit(property);    
  }  

  addExpenseWithoutDocument(renter:Renter,ExpenseToBeAdded:any) {
    this.afs.collection("Expenses").add({
    due:true,
    consumed:ExpenseToBeAdded.consumed,
    date_of_submition:ExpenseToBeAdded.date_of_submition,
    pdf:'',
    duration:{
      start:ExpenseToBeAdded.start,
      end:ExpenseToBeAdded.end,
    },
    service:ExpenseToBeAdded.service,
    sum:ExpenseToBeAdded.sum,
    type:ExpenseToBeAdded.type,
    propertyID:renter.propertyID,
    }).then((docRef) => {
      console.log("Expense added with ID: ", docRef.id);
    }).catch((error) => {
      console.error("Error adding expense: ", error);
    });
  }


  addDocumentedExpense(fileUpload:Myfile,expenseToBeAdded:any,renter:Renter){
    var renterID = JSON.parse(sessionStorage.getItem('user')).uid;
    const filePath = `${this.basePath}/${renterID}/${renter.propertyID}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.saveExpenseFileData(fileUpload,renter,expenseToBeAdded);
        });
      })
    ).subscribe();
  }

  private saveExpenseFileData(fileUpload: Myfile,renter:Renter,ExpenseToBeAdded:any): void {
    var renterID = JSON.parse(sessionStorage.getItem('user')).uid;
    console.log(ExpenseToBeAdded);
    this.afs.collection("Expenses").add({
    name: fileUpload.name,
    pdf: fileUpload.url,
    renterID: renterID,
    propertyID:renter.propertyID,
    due:true,
    consumed:ExpenseToBeAdded.consumed,
    date_of_submition:fileUpload.upload_date,
    duration:{
      start:ExpenseToBeAdded.start,
      end:ExpenseToBeAdded.end,
    },
    service:ExpenseToBeAdded.service,
    sum:ExpenseToBeAdded.sum,
    type:ExpenseToBeAdded.type,
    }).then((docRef) => {
      console.log("File added with ID: ", docRef.id);
    }).catch((error) => {
      console.error("Error adding file: ", error);
    });
  }


  getExpensesFromProperty(Property:Property) {
    return this.afs.collection("Expenses", ref => ref.where('propertyID', '==', Property.id)).snapshotChanges().pipe
    (map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Expense;
        data.id = a.payload.doc.id;
        return data;
      });
    }))
  }

  getDueExpensesFromProperty(Property:Property) {
    return this.afs.collection("Expenses", ref => ref
    .where('propertyID', '==', Property.id)
    .where('due','==','true')).snapshotChanges().pipe
    (map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Expense;
        data.id = a.payload.doc.id;
        return data;
      });
    }))
  }

  updateExpense(ExpenseToBeUpdated:Expense){
    this.afs.doc(`Expenses/${ExpenseToBeUpdated.id}`).update({
      due:ExpenseToBeUpdated.due,
      consumed:ExpenseToBeUpdated.consumed,
      date_of_submition:ExpenseToBeUpdated.date_of_submition,
      duration:ExpenseToBeUpdated.duration,
      service:ExpenseToBeUpdated.service,
      sum:ExpenseToBeUpdated.sum,
      type:ExpenseToBeUpdated.type,
    })
  }

  changeStatusOfExpense(expense:Expense)
  {
    this.afs.doc(`Expenses/${expense.id}`).update(
      {
        due:!expense.due,
      }
    )
  }

  deleteExpense(ExpenseToBeDeleted:Expense){
    return this.afs.collection("Expenses").doc(ExpenseToBeDeleted.id).delete();
  }

  getSumOfUnpaidExpenses(expenses: Expense[])
  {
    var total = 0;
    var index = 0;
    
    while(index<expenses.length)
    {
      if(expenses[index].due==true)
      {
        total = total + (+expenses[index].sum);
      }
      index++;
    }
    return total;
  }

}
