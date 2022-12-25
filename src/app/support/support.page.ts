import { Component, OnInit } from '@angular/core';
import { DynamicPageModel, DynamicpagesServiceProxy,PopularQuestions,PopularquestionsapiServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  Questions: PopularQuestions[] = [];
  page: DynamicPageModel = new DynamicPageModel();

  constructor(private _dynamicpagesService: DynamicpagesServiceProxy,private _popularQestionsService: PopularquestionsapiServiceProxy,) { }

  ngOnInit() {
    this._dynamicpagesService.getbyslug("support").subscribe((res: DynamicPageModel) => this.page = res);
    this._popularQestionsService.listbycategory(2).subscribe((res: PopularQuestions[]) => this.Questions = res);
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
