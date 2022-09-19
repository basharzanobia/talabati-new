import { Component, OnInit } from '@angular/core';
import {
  ChatapiServiceProxy, ChatLog
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
  sentMsg:boolean;
  userId;
  lastMsg:ChatLog;
 
constructor(  
  private _session: AppSessionService,
  private _router: Router,
  private _chatService: ChatapiServiceProxy
) { }

ngOnInit(): void {
  this._chatService.getmessagesbyuserid(this._session.userId).subscribe((res: ChatLog[] ) => 
  {
    this.chats= res;
    const length = this.chats.length;
    this.lastMsg = this.chats[length - 1];
  });
  this.userId=this._session.userId;
  
}


}
