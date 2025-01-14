import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Chat } from '../Models/chat';
import { Property } from '../Models/property';
import { Subject } from '../Models/subject';
import { ChatsService } from '../Services/chatService/chats.service';
import { SubjectsService } from '../Services/subjectService/subjects.service';

// to determine the names of the users
import { RenterDBService } from '../Services/renterDbService/renter-db.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit {

  // inputs from "subject-list" parent component
  @Input() subject: Subject;
  @ViewChild('scrollBottom') private scrollBottom: ElementRef;
  chatcontent!: ElementRef;
  currentSubjectID: string = '';
  currentSubject: Subject;
  scrolltop: number = 10000;
  currentUserID: string = '';
  senderName: string = 'Sender';
  receiverName: string = 'Receiver';
  chatForm: FormGroup;
  nickname: any = '';
  property: Property;
  message = '';
  users: any[];
  chats: any[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private database: AngularFirestore,
    private chatService: ChatsService,
    private subjectService: SubjectsService,
    private renterService: RenterDBService,
  ) {}

  ngOnInit(): void {
    this.property=JSON.parse(sessionStorage.getItem('property'));
    this.currentUserID = JSON.parse(sessionStorage.getItem('user')).uid;
    this.chatForm = this.formBuilder.group({
      message: [null, Validators.required],
    });
    this.setSenderAndReceiverNames();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 
   scrollToBottom(): void {
     console.log("SCROLL");
    try {
        this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch(err) { }
}
    
  ngOnChanges() {
    if (this.subject == undefined) {
      this.router.navigateByUrl('/subject-list');
    } else {
      this.getMessagesFromDatabase();
      //this.setSenderAndReceiverNames();
    }
  }

  // set the names of the users
  setSenderAndReceiverNames() {
      this.renterService.getCurrentOwner(this.property.ownerID).then(owner =>{
        this.renterService.getRenterByID(this.property.renterID).then(renter => {
          if(this.property.ownerID === this.currentUserID){
            this.senderName = owner.firstName + ' ' + owner.lastName;
            this.receiverName = renter.firstName + ' ' + renter.lastName;
          }else{
            this.receiverName = owner.firstName + ' ' + owner.lastName;
            this.senderName = renter.firstName + ' ' + renter.lastName;
          }
          console.log(owner);
          console.log(renter);
        })
      }) 
  }

  // chat methods
  getMessagesFromDatabase(): void {
    this.chatService.getChats(this.subject.id).subscribe((messages) => {
      this.chats = messages;
      this.sortArrayByDate();
    });
  }

  sortArrayByDate(): void {
    this.chats.sort(function (a, b) {
      var first_date = new Date(a.date).getTime();
      var second_date = new Date(b.date).getTime();
      return first_date > second_date ? 1 : -1;
    });
  }

  onFormSubmit(form: any) {
    const chat = form;
    chat.date = new Date().toLocaleString('en-US', { hour12: false });
    chat.sender = this.currentUserID;
    chat.subjectID = this.subject.id;
    chat.type = 'message';
    this.database.collection('Chats').add(chat);
    this.chatForm = this.formBuilder.group({
      message: [null, Validators.required],
    });
  }
}
