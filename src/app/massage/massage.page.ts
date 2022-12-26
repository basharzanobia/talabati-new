import { Component, OnInit } from '@angular/core';
import {
  ApplicationUser,
  ChatapiServiceProxy, ChatLog , UserapiServiceProxy
} from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-massage',
  templateUrl: './massage.page.html',
  styleUrls: ['./massage.page.scss'],
})
export class MassagePage implements OnInit {

  chatId = 1;
  AppConsts = AppConsts;
  chats:ChatLog[]=[];
  profileImages = [];
  sentMsg:boolean;
  userId;
  lastMsg:ChatLog;
 
constructor(  
  private _session: AppSessionService,
  private _router: Router,
  private _chatService: ChatapiServiceProxy,
  private _userService: UserapiServiceProxy
) { }

ngOnInit(): void {
  this.userId=this._session.userId;
  this._chatService.getmessagesbyuserid(this._session.userId).subscribe((res: ChatLog[] ) => 
  {
    this.chats= res;
    const length = this.chats.length;
    //this.lastMsg = this.chats[length - 1];
    
    this.chats.forEach(chat => {
      let id = chat.recieverId==this.userId?chat.senderId:chat.recieverId;
      console.log (id);
      this._userService.getuserbyid(id).subscribe((res: ApplicationUser) => {
        this.profileImages[chat.id] = res.storeLogo;
        console.log(this.profileImages[chat.id]);
      });
    });


  });
}

handleRefresh(event) {
  setTimeout(() => {
    this.ngOnInit();
    event.target.complete();
  }, 2000);
};

}
