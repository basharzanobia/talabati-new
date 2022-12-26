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
import { filter } from 'rxjs/operators';

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
    slidesPerView: 3.8,
    spaceBetween: 8,
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

  search(event: Event){
    const query = (event.target as HTMLInputElement).value;
    console.log(query);

    if (!query) { // revert back to the original array if no query
      this.vendors$ = this.vendors$;
    } else { // filter array by query
      this.vendors$.forEach(obj => {
        obj.forEach(childObj=> {
          //childObj.name = "";
          console.log(childObj.name);
       });
      });
    }


    /*
     if (!query) { // revert back to the original array if no query
      this.usersArrayFiltered = [...this.usersArray];
    } else { // filter array by query
      this.usersArrayFiltered = this.usersArray.filter((user) => {
        return (user.name.includes(query) || user.email.includes(query) || user.phone.includes(query));
      })
    }
    */
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };

}
