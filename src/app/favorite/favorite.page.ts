import { Component, OnInit } from '@angular/core';
import { 
  VendorWishListResponseModel, 
  VendorwishlistapiServiceProxy ,
  VendorapiServiceProxy,
  WishlistapiServiceProxy,
  WishListModel,
  ProductapiServiceProxy
} from 'src/shared/service-proxies/service-proxies';
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
  productlist :WishListModel[]=[];
  AppConsts = AppConsts;
  favVendors=[];
  favProducts=[];
  constructor(private _session: AppSessionService,
    private _vendorwishlistService: VendorwishlistapiServiceProxy,
    private _vendorService: VendorapiServiceProxy,
    private _wishListService: WishlistapiServiceProxy,
    private _productService: ProductapiServiceProxy
    ) {

  }

  ngOnInit(): void {
    this._vendorwishlistService.getwishlist(this._session.userId).subscribe((res:VendorWishListResponseModel[]) => this.vendorlist = res);
    this.vendorlist.forEach(element => {
      const vendor =  this._vendorService.vendorbyid(element.vendorId); 
      this.favVendors.push(vendor);
    });

    this._wishListService.getwishlist(this._session.userId).subscribe((res:WishListModel[]) => this.productlist = res);
    this.productlist.forEach(element => {
      const product =  this._productService.single(element.productId); 
      this.favProducts.push(product);
    });
  }

}
