import { Component, OnInit } from '@angular/core';
import { ChatapiServiceProxy, ChatLog} from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tchat',
  templateUrl: './tchat.page.html',
  styleUrls: ['./tchat.page.scss'],
})
export class TchatPage implements OnInit {
  chatMessage :string;
  messageList = [];
  userId;
  RecieverId;
  SenderId;
  
  

  constructor(
    private _session: AppSessionService,
    private _chatService: ChatapiServiceProxy,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this._chatService.getmessagesbyuserid(this._session.userId).subscribe((res: ChatLog[] ) =>
     {
      this.messageList= res ;
      this.userId=this._session.userId;
      
      //this.userId === true ? this.displayString = 'looping data' : this.displayString = 'Record not found';
     const SenderId= this.route.snapshot.paramMap.get('senderId');
     const RecieverId=this.route.snapshot.paramMap.get('recieverId');
     this.SenderId=this.userId;
     //console.log(RecieverId);
     console.log(this.userId);
     if(this.userId==SenderId)
     {
      this.RecieverId=RecieverId;
     }
     else 
     {    
      this.RecieverId=SenderId;
     }
    });
  // console.log(this.RecieverId);
  }

  sendMessage() {
    const message = new ChatLog();
    message.init({
      text : this.chatMessage,
      recieverId:this.RecieverId, 
      senderId:this.SenderId,
    });
   
    this._chatService.createmessage(message).subscribe(
      (res) => {
        this._chatService.getmessagesbyuserid(this._session.userId).subscribe((res: ChatLog[] ) => this.messageList= res);
      },
      async (error) => {
        // Unexpected result!
        // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
        console.log('error ', error);
      });
  }

}
