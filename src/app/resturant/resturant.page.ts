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
  VendorapiServiceProxy ,
  VendorWishlist,
  VendorwishlistapiServiceProxy} 
from 'src/shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConsts } from 'src/shared/AppConsts';
import { AlertController } from '@ionic/angular';  
import { AppSessionService } from 'src/shared/session/app-session.service';

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
    private _session: AppSessionService,
    private route: ActivatedRoute,
    private _vendorService: VendorapiServiceProxy,
    private _productsService: ProductapiServiceProxy,
    private _homeService: HomeapiServiceProxy,
    private _vendorwishlistService: VendorwishlistapiServiceProxy,
    public alertCtrl: AlertController

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

  async  showAlert() {  
    const alert = await this.alertCtrl.create({  
      header: 'المفضلة',  
      subHeader: '',  
      message: 'تمت إضافة المنتج إلى المفضلة بنجاح!',  
      buttons: ['تم']  
    });  
    await alert.present();  
    const result = await alert.onDidDismiss();  
    console.log(result);  
  }  
  createVendorWishList(){
    const vendorWhishlist = new VendorWishlist();
    vendorWhishlist.init({
      vendorId: this.vendorId,
      userId:this._session.userId,
    });
   
    this._vendorwishlistService.createwish(vendorWhishlist).subscribe(
      (res) => {
        this.showAlert();   
      },
      async (error) => {
        // Unexpected result!
        // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
        console.log('error ', error);
      });
  }


}
