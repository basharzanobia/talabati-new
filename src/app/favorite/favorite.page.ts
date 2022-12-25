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

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {

  customFormatter;
  vendorlist :VendorWishListResponseModel[]=[];
  productlist:WishListModel[]=[]; 
  AppConsts = AppConsts;
  favVendors=[];
  favProducts=[];
  productId=1;
  vendortId='';

  constructor(private _session: AppSessionService,
    private _vendorwishlistService: VendorwishlistapiServiceProxy,
    private _vendorService: VendorapiServiceProxy,
    private _wishListService: WishlistapiServiceProxy,
    private _productService: ProductapiServiceProxy
    ) {

  }
  
  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  };
  
getWishList(){
  this._wishListService.getwishlist(this._session.userId).subscribe((res:WishListModel[])=>{ this.productlist = res;
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
    
    this.getVendorsWishList();
    this.getWishList();
    
  }

}
