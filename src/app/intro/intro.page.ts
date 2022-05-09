import { Component, OnInit } from '@angular/core';
import { AppConsts } from 'src/shared/AppConsts';
import { VendorapiServiceProxy, VendorCategory } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  categories: VendorCategory[];

  AppConsts = AppConsts;

  constructor(private _vendorService: VendorapiServiceProxy) { }

  ngOnInit() {
    this._vendorService.categories()
    .subscribe((res: VendorCategory[]) => {
      this.categories = res;
    });
  }

}
