import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { 
  Category,
  HomeapiServiceProxy,
  Product,
  ProductapiServiceProxy,
  ProductFilterModel,
  ProductResponseModel,
  UserResponseModel,
  VendorapiServiceProxy } 
from 'src/shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConsts } from 'src/shared/AppConsts';

@Component({
  selector: 'app-resturant',
  templateUrl: './resturant.page.html',
  styleUrls: ['./resturant.page.scss'],
})
export class ResturantPage implements OnInit {
  featuredProducts: Product[] = [];
  vendorId: string;
  vendor$: Observable<UserResponseModel>;
  categories$: Observable<Category[]>;
  catSlideOpts = {
    slidesPerView: 5.7,
    spaceBetween: 5,
  };
  selectedCategory;

  AppConsts = AppConsts;

  constructor(
    private route: ActivatedRoute,
    private _vendorService: VendorapiServiceProxy,
    private _productsService: ProductapiServiceProxy,
    private _homeService: HomeapiServiceProxy
  ) { }

  ngOnInit() {
    
    this.vendor$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.vendorId = params.get('vendorId');
        const productFilter = new ProductFilterModel();
        productFilter.init( {
          creatorId: this.vendorId,
          currentPage: 1,
          take: 20
        });
    
        this._productsService.list(productFilter)
        .subscribe((res: ProductResponseModel) => {
          this.featuredProducts = res.products;
        });
        return this._vendorService.vendorbyid(this.vendorId);
      })
    );

    this.categories$ = this._homeService.menu();
   
  }

  slidePrev() {

  }

  slideNext() {

  }

  callSupport() {
    
  }

}
