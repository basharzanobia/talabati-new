import { Component, OnInit } from '@angular/core';
import { DynamicPageModel, DynamicpagesServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  page: DynamicPageModel = new DynamicPageModel();

  constructor(private _dynamicpagesService: DynamicpagesServiceProxy) { }

  ngOnInit() {
    this._dynamicpagesService.getbyslug("about").subscribe((res: DynamicPageModel) => this.page = res);
  }

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  };

}
