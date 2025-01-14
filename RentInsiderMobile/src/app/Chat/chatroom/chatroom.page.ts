import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonGrid, MenuController } from '@ionic/angular';
import { Chat } from 'src/app/Models/chat';
import { ChatsService } from 'src/app/Services/chats.service';
import { SubjectsService } from 'src/app/Services/subjects.service';

// to get the username of the currently logged in user (could either be an owner, or a renter)
// has methods for both owner + renter database retrieval
import { RenterDBService } from 'src/app/Services/renter-db.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})
export class ChatroomPage implements OnInit {
  newMsg='';
  @ViewChild(IonContent) content: IonContent;

  // wrapper (selector) for native html element
  @ViewChild('chatContainer') chatContainer: IonContent;

  senderName: string = "Sender"; // firstName + lastName of the sender
  receiverName: string = "Receiver"; // firstName + lastName of the receiver
  userID: string; // userID to separate sender-receiver message styles 
  isOwner: boolean; // used to not query the database unnecessary
  chatForm: FormGroup;
  chats: any[];
  fullName: string;
  currentSubjectID:string;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private chatService: ChatsService,
    private subjectService: SubjectsService,
    private renterService: RenterDBService,
    private activatedRoute:ActivatedRoute,
    private menuController:MenuController,
    private angularFireStore:AngularFirestore
    ) {}

  ngOnInit(): void {

     this.chatForm = this.formBuilder.group({
       'message' : [null, Validators.required]
     });

    this.userID = JSON.parse(sessionStorage.getItem('user')).uid;

    this.currentSubjectID = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.currentSubjectID != null){
      this.fetchMessagesBySubjectID(this.currentSubjectID);

      // set the names of the sender + receiver
      // get the ids from the current subject
      // async is not implemented in the service, so .then is used
      let senderID, receiverID;
      this.subjectService.getSubjectByID(this.currentSubjectID).then(subject => {
        if (this.userID === subject.ownerID) {
          senderID = subject.ownerID;
          receiverID = subject.renterID;
          this.isOwner = true;
        } else {
          senderID = subject.renterID;
          receiverID = subject.ownerID;
          this.isOwner = false;
        }
        this.setSenderName(senderID, this.isOwner);
        this.setReceiverName(receiverID, this.isOwner);
        
        // scroll chat to the bottom
        this.chatContainer.scrollToBottom(200);
      });
    }
  }

  ionViewWillEnter(){
    this.menuController.enable(true,"second");
  }

  // methods to set the sender + receiver names
  setSenderName(userID: string, isOwner: boolean) {
    if (isOwner) {
      this.renterService.getCurrentOwner(userID).then(owner => {
        this.senderName = owner.firstName + " " + owner.lastName;
      });
    } else {
      this.renterService.getRenterByID(userID).then(renter => {
        this.senderName = renter.firstName + " " + renter.lastName;
      });
    }
  }

  setReceiverName(userID: string, isOwner: boolean) {
    if (!isOwner) {
      this.renterService.getCurrentOwner(userID).then(owner => {
        this.receiverName = owner.firstName + " " + owner.lastName;
      });
    } else {
      this.renterService.getRenterByID(userID).then(renter => {
        this.receiverName = renter.firstName + " " + renter.lastName;
      });
    }
  }
  
  // chat methods
  fetchMessagesBySubjectID(subjectID){
    this.chatService.getChats(subjectID).subscribe(messages => {
      this.chats= messages;
      this.sortArrayByDate();
    });
  }

  sortArrayByDate(): void{
    this.chats.sort(function(a,b){
    var first_date = new Date(a.date).getTime();
    var second_date = new Date(b.date).getTime();
    return first_date > second_date ? 1 : -1; });
  }

  sendMessage() {
    const chat = new Chat;
    chat.message = this.newMsg;
    if((chat.message==undefined)||(chat.message.length==0))
      return;
    chat.date = new Date().toLocaleString('en-US',{hour12:false});
    chat.sender = this.userID;
    chat.subjectID = this.currentSubjectID;
    chat.type = 'message';
    this.chatService.addChat(chat);
    this.newMsg='';
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
  }
}
