import { Component } from '@angular/core';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { Router } from '@angular/router';
import { AppConsts } from 'src/shared/AppConsts';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  userId;
  adminId; 

  constructor(private _session: AppSessionService,
    private _router: Router,
    ) {}

  openChat(){
    this.adminId = AppConsts.adminId; 
    this.userId=this._session.userId; 
    this._router.navigate(['/tchat',this.userId,this.adminId]);
  }
}
