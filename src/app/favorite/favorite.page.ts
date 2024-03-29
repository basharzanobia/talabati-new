import { Component, OnInit } from '@angular/core';
import { 
  VendorWishListResponseModel, 
  VendorwishlistapiServiceProxy ,
  VendorapiServiceProxy,
  WishlistapiServiceProxy,
  WishListModel,
  ProductapiServiceProxy,
  Product,
  UserResponseModel
} from 'src/shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {

  customFormatter;
  showEmptyVendorFavorite = false;
  showEmptyProductsFavorite = false;
  vendorlist :VendorWishListResponseModel[]=[];
  productlist:WishListModel[]=[]; 
  AppConsts = AppConsts;
  favVendors=[];
  favProducts=[];
  productId=1;
  vendortId='';
  segment: string = "rest";

  constructor(private _session: AppSessionService,
    private _vendorwishlistService: VendorwishlistapiServiceProxy,
    private _vendorService: VendorapiServiceProxy,
    private _wishListService: WishlistapiServiceProxy,
    private _productService: ProductapiServiceProxy,
    private menuCtrl : MenuController,
    private router : Router
    ) {

  }
  goToMenu(){
    this.router.navigate(['/tabs/tab1/1'],{replaceUrl:true});
    this.menuCtrl.toggle();
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };
  
getWishList(){
  this._wishListService.getwishlist(this._session.userId).subscribe((res:WishListModel[])=>{ this.productlist = res;
    if(res.length == 0 ){
      this.showEmptyProductsFavorite = true;
       }
       else{
        this.showEmptyProductsFavorite = false;
       }
    this.productlist.forEach(element=>{
      this.productId =Number(element.productId);
      this._productService.single(this.productId).subscribe((pro: Product)=> {
        const Product = pro;
        this.favProducts.push(Product);
      });
      
    });
  });
   
}


getVendorsWishList(){
  this._vendorwishlistService.getwishlist(this._session.userId).subscribe((res:VendorWishListResponseModel[])=>{ this.vendorlist = res;
  if(res.length == 0 ){
 this.showEmptyVendorFavorite = true;
  }
  else{
    this.showEmptyVendorFavorite = false; 
  }
    this.vendorlist.forEach(element=>{
      this.vendortId =element.vendorId;
      this._vendorService.vendorbyid(this.vendortId).subscribe((vendor: UserResponseModel)=> {
        const Vendor = vendor;
        this.favVendors.push(Vendor);
      });
      
    });
  });
   
}


  ngOnInit(): void {
    
    this.favProducts = [];
    this.favVendors = [];
    this.getVendorsWishList();
    this.getWishList();
    
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

}
