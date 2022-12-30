import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatLogListBaseResponse,NotificationapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';

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
    messageNotificationsData=[];
    notisTitle : string[]=[];
    notisBody : string[]=[];
    tempIsRead =false;
  constructor(  
    private _session: AppSessionService,
    private _router: Router,
    private _notificationService: NotificationapiServiceProxy
  ) { }

  ngOnInit(): void {
    this._notificationService.getmessagesnotificationsbyuserid(this._session.userId).subscribe((res: ChatLogListBaseResponse ) => {
      this.messageNotifications= res.data;
      res.data.forEach(element => {
        let obj = JSON.parse(element.notificationJson);
        console.log(obj.Body);
        this.notisBody.push(obj.Body);
        this.notisTitle.push(obj.Title);
      });
    });
}

openNoti(event,slidingItem : IonItemSliding,Id : number){
  console.log("noti Id" + Id);
 this._notificationService.openmessagenotification(Id).subscribe((res)=>{
    console.log(res.response);
    this.tempIsRead =true;
  });
 // slidingItem.close();
}

handleRefresh(event) {
  setTimeout(() => {
    this.ngOnInit();
    event.target.complete();
  }, 2000);
};

}
