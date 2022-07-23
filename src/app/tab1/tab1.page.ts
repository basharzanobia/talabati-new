import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConsts } from 'src/shared/AppConsts';
import { 
  UserResponseModel,
  VendorapiServiceProxy,
  VendorSubCategory } 
from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  catId:number;
  subcats$: Observable<VendorSubCategory[]>;
  vendors$: Observable<UserResponseModel[]>;
  catSlideOpts = {
    slidesPerView: 5.7,
    spaceBetween: 5,
  };

  AppConsts = AppConsts;

  constructor(private route: ActivatedRoute,
    private _vendorService: VendorapiServiceProxy) {}
  
  ngOnInit(): void {
    this.subcats$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.catId = Number(params.get('catId'));
        return this._vendorService.subcategories(this.catId);
      })
    );

    this.vendors$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.catId = Number(params.get('catId'));
        return this._vendorService.vendorsbycatid(this.catId);
      })
    );
  }

}
