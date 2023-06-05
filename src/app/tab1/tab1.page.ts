import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConsts } from 'src/shared/AppConsts';
import { 
  UserResponseModel,
  VendorapiServiceProxy,
  VendorSubCategory} 
from 'src/shared/service-proxies/service-proxies';
import { ModalController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import * as moment from 'moment';

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
  subCatId = 15;
  catSlideOpts = {
    slidesPerView: 4.5,
    spaceBetween: 7,
  };

  AppConsts = AppConsts;
 SubCatsOpts = [];
  constructor(private route: ActivatedRoute,
    private _vendorService: VendorapiServiceProxy,
    private modalCtrl: ModalController) {}
  
  ngOnInit(): void {

    this.catId =  Number(this.route.snapshot.paramMap.get('catId'));
    console.log(this.catId);
    this._vendorService.subcategories(this.catId).subscribe(
      (res: VendorSubCategory[]) => {
        this.subcats$ = res;
        this._vendorService.vendorsbycatid(this.catId).subscribe(
          (res1: UserResponseModel[])=>{
            this.vendors$ = res1;
            this.filterVendorsBySlider(this.subCatId);
          }
        );
      }
    );
  this._vendorService.subcategories(this.catId).subscribe((res)=>{
    res.forEach((el)=>{
      this.SubCatsOpts.push({"name" : el.name ,"id":el.id,"imagePath":el.imagePath ,"checked":true })
    })
   
  })
  }
  ionViewWillEnter(){
    this.catId =  Number(this.route.snapshot.paramMap.get('catId'));
    console.log(this.catId);
 
  }
  isClosed(startT,endT):boolean{
    let now = new  Date().toString().split(' ')[4];
    var start = startT.split(":");
          var end = endT.split(":");
          let startTime = moment({ hour:+start[0], minute:+start[1] }).format('HH:mm');
          let endTime = moment({ hour:+end[0], minute:+end[1] }).format('HH:mm');
          if((startTime > now) || ( endTime < now)){
                return true;
          }
          return false;
  }
  filterVendorsBySlider(id){
    this.subCatId = id;
    console.log(this.subCatId);
    if(id==0){
      this.subCatId = 0;
      this.filteredVendors=this.vendors$;
      return;
    }

    this.filteredVendors = this.vendors$.filter((item) => {
      return (item.subCategories[0]?.id==id);
    });

/*
    this._vendorService.vendorsbysubcatid(id).subscribe((res)=>{
    this.filteredVendors = res;
    })
    */
  }
  filerVendorsByFilter(){
    this.filteredVendors = [];
    this.SubCatsOpts.forEach((el)=>{
   // console.log(" el.id "+el.id+" el.checked "+ el.checked);
      if(el.checked === true){
           // console.log(" el.id "+el.id+" el.checked "+ el.checked);
        this._vendorService.vendorsbysubcatid(el.id).subscribe((res)=>{
          this.filteredVendors  =  this.filteredVendors.concat(res);
        });
      }
    });
    return this.modalCtrl.dismiss(null, 'confirm');
  }
  search(event: Event){
    const query = (event.target as HTMLInputElement).value;
console.log('query' +query);
     if (query) { 
      this.filteredVendors = this.filteredVendors.filter((item) => {
        console.log(item.name)
        return (item.name.includes(query) || item.region.includes(query));
      })
    }
    else{
      this.filterVendorsBySlider(this.subCatId);
    }
   
  }
  handleInput(event) { 
    const query = event.target.value.toLowerCase();
    if(this.subCatId === 0){
      this._vendorService.vendorsbycatid(this.catId).subscribe(
        (res1: UserResponseModel[])=>{
          if (query) { 
       
            this.filteredVendors = res1.filter((item) => {
              console.log(item.name)
              return (item.name.includes(query) );
            })
          }
          else{
            this.filterVendorsBySlider(this.subCatId);
          }
        }
      );
    }
    else{
      this._vendorService.vendorsbysubcatid( this.subCatId ).subscribe((res)=>{
        if (query) { 
       
          this.filteredVendors = res.filter((item) => {
            console.log(item.name)
            return (item.name.includes(query) );
          })
        }
        else{
          this.filterVendorsBySlider(this.subCatId);
        }
      });
    }
   
 
  }
  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };

}
