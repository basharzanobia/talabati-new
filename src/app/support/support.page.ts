import { Component, OnInit } from '@angular/core';
import { DynamicPageModel, DynamicpagesServiceProxy,PopularQuestions,PopularquestionsapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppConsts } from 'src/shared/AppConsts';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  Questions: PopularQuestions[] = [];
  page: DynamicPageModel = new DynamicPageModel();
  userId;
  adminId; 

  constructor(private _dynamicpagesService: DynamicpagesServiceProxy,
    private _popularQestionsService: PopularquestionsapiServiceProxy,
    private router: Router,
    private _session: AppSessionService,
    private menuCtrl : MenuController) { }

  ngOnInit() {
    this._dynamicpagesService.getbyslug("support").subscribe((res: DynamicPageModel) => this.page = res);
    this._popularQestionsService.listbycategory(2).subscribe((res: PopularQuestions[]) => this.Questions = res);
  }
  goToMenu(){
    this.router.navigate(['/tabs/tab1/1'],{replaceUrl:true});
    this.menuCtrl.toggle();
  }
  openChat(){
    this.adminId = AppConsts.adminId; 
    this.userId=this._session.userId; 
    this.router.navigate(['/tchat',this.userId,this.adminId],{replaceUrl:true});
  }
  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };
  
  call() {
    
  }

}
