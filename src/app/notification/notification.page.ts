import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatLogListBaseResponse,NotificationapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: 'notification.page.html',
  styleUrls: ['notification.page.scss']
})
export class NotificationPage {
    customFormatter;
    messageNotifications;
    notificationId = 1;
    AppConsts = AppConsts;
    messageNotificationsData=[]
  constructor(  
    private _session: AppSessionService,
    private _router: Router,
    private _notificationService: NotificationapiServiceProxy
  ) { }

  ngOnInit(): void {
    this._notificationService.getmessagesnotificationsbyuserid(this._session.userId).subscribe((res: ChatLogListBaseResponse ) => this.messageNotifications= res.data);
}

 

}
