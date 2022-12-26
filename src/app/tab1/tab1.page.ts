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
  subcats$: VendorSubCategory[] = [];
  vendors$: UserResponseModel[] = [];
  filteredVendors : UserResponseModel[] = [];
  catSlideOpts = {
    slidesPerView: 3.8,
    spaceBetween: 8,
  };

  AppConsts = AppConsts;

  constructor(private route: ActivatedRoute,
    private _vendorService: VendorapiServiceProxy) {}
  
  ngOnInit(): void {

    this.catId =  Number(this.route.snapshot.paramMap.get('catId'));
    this._vendorService.subcategories(this.catId).subscribe(
      (res: VendorSubCategory[]) => {
        this.subcats$ = res;
        this._vendorService.vendorsbycatid(this.catId).subscribe(
          (res1: UserResponseModel[])=>{
            this.vendors$ = res1;
            this.filteredVendors = res1;
          }
        );
      }
    );
  }

  search(event: Event){
    const query = (event.target as HTMLInputElement).value;

     if (query) { 
      this.filteredVendors = this.vendors$.filter((item) => {
        return (item.name.includes(query) || item.region.includes(query));
      })
    }
    else{
      this.filteredVendors = this.vendors$;
    }
   
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };

}
