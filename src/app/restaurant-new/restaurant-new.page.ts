import { Component, OnInit, ViewChild } from '@angular/core';
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
  VendorwishlistapiServiceProxy,
  VendorWishListResponseModel,
  ReviewuserapiServiceProxy,
  UserReview,
  ReviewUserResponse,
  Varient,
  VarientapiServiceProxy,
  WishlistapiServiceProxy,
  WishListModel,
  IWishListModel,
  Wishlist,
} 
from 'src/shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConsts } from 'src/shared/AppConsts';
import { ActionSheetController, AlertController, IonModal } from '@ionic/angular';  
import { AppSessionService } from 'src/shared/session/app-session.service';
import { CartStoreService } from 'src/shared/cart/cart-store.service';


@Component({
  selector: 'app-restaurant-new',
  templateUrl: './restaurant-new.page.html',
  styleUrls: ['./restaurant-new.page.scss'],
})
export class RestaurantNewPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  featuredProducts: Product[] = [];
  varients: Varient[] = [];
  vendorId: string;
  vendor$: Observable<UserResponseModel>;
  categories$: Observable<Category[]>;
  catSlideOptsR = {
    slidesPerView: 5.7,
    spaceBetween: 5,
  };
  rating;
  currentUserId = "";
  selectedCategory;
  vendorlist :VendorWishListResponseModel[]=[];
  productslist :IWishListModel[]=[];
  isFav:boolean=false;
  vendorWishListId;
  varientId = 0;
  product: Product = new Product();
  AppConsts = AppConsts;
  Review: ReviewUserResponse[]=[];
  dictionary= new Map<number, number>();
   indexedArray: {[key: number]: boolean};
  constructor(
    private _session: AppSessionService,
    private route: ActivatedRoute,
    public cart: CartStoreService,
    private _vendorService: VendorapiServiceProxy,
    private _productsService: ProductapiServiceProxy,
    private _homeService: HomeapiServiceProxy,
    private _vendorwishlistService: VendorwishlistapiServiceProxy,
    public alertCtrl: AlertController,
    private _reviewuserService: ReviewuserapiServiceProxy,
    private actionSheetCtrl: ActionSheetController,
    private _varientService : VarientapiServiceProxy,
    private _productsWishList : WishlistapiServiceProxy

  ) { }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss('confirm');
  }

  onWillDismiss(event: Event) {
   
  }
  

  ngOnInit() {
    this.currentUserId = this._session.userId;
    this.vendor$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.vendorId = params.get('vendorId');
       
        const productFilter = new ProductFilterModel();
        productFilter.init({ 
          creatorId: this.vendorId,
          currentPage: 1,
          take: 20
        });
    
        this._productsService.list(productFilter)
        .subscribe((res: ProductResponseModel) => {
          this.featuredProducts = res.products;
          this._productsWishList.getwishlist(this._session.userId).subscribe((res:WishListModel[])=>{ this.productslist = res;
            this.productslist.forEach(element=>{
            //this.indexedArray[element.productId] = true;
            this.dictionary.set(element.productId,element.id);
            console.log("hiii "+       this.dictionary.get(element.productId))
           });
     
          });
        });
        this.getReview(this.vendorId);
        return this._vendorService.vendorbyid(this.vendorId);
      })
    );

    this.categories$ = this._homeService.menu();
    this.isFavVendor();

  }
ionViewWillEnter(){
  this.dictionary.clear();
  this.vendor$ = this.route.paramMap.pipe(
    switchMap(params => {
      this.vendorId = params.get('vendorId');
     
      const productFilter = new ProductFilterModel();
      productFilter.init({ 
        creatorId: this.vendorId,
        currentPage: 1,
        take: 20
      });
  
      this._productsService.list(productFilter)
      .subscribe((res: ProductResponseModel) => {
        this.featuredProducts = res.products;
        this._productsWishList.getwishlist(this._session.userId).subscribe((res:WishListModel[])=>{ this.productslist = res;
          this.productslist.forEach(element=>{
          //this.indexedArray[element.productId] = true;
          this.dictionary.set(element.productId,element.id);
          console.log("hiii "+       this.dictionary.get(element.productId))
         });
   
        });
      });
      this.getReview(this.vendorId);
      return this._vendorService.vendorbyid(this.vendorId);
    })
  );

  this.categories$ = this._homeService.menu();
  this.isFavVendor(); 
}
 getItemCountInCart(id : number){ 
  var quantity = this.cart.getItemById(id);

 }
 addToCart(productId,varientId){
  console.log(productId,varientId)
  this._productsService.single(productId).subscribe((res)=>{
    this.cart.incItem({
      productId: productId,
      quantity: 1,
      product: res,
      varientId : varientId,
      varient : this.getVarientById(res,varientId)
    });
  });
 }
  incItem(i: number) {
    this._productsService.single(i).subscribe((res)=>{
      this.cart.incItem({
        productId: i,
        quantity: 1,
        product: res,
        varientId : this.varientId,
        varient : this.getVarientById(res,this.varientId)
      });
    });
  }
  getVarientById(product,id) : Varient{
    var v:Varient = new Varient();
      product.varient.forEach(element => {
        if (element.id==id) {
          v=element;
        }
      });
      return v;
    }
  decItem(i: number) {
      this.cart.decItem(i);
 
   
  }
  getVarients(productId:number): Varient[]{
    this._varientService.listbyproductid(productId).subscribe((res)=>{
      this.varients = res;
      return res;
    });
    return this.varients;
  }
  async presentActionSheet(id:number) {
    this._productsService.single(id).subscribe(async (res)=>{
      let radio_options = [];
      for(let i=0;i<res.varient.length ;++i){
        var size = res.varient[i].size!=null?res.varient[i].size.name:"";
        var color =  res.varient[i].color !=null?res.varient[i].color.name:"";
        console.log(size);
        console.log(color);
         radio_options.push({
          text : size + " " + color,
          
      
        });
  
    }
      
    const actionSheet = await this.actionSheetCtrl.create({
      header: ' الخيارات المتوفرة',
      buttons:   radio_options,
  
      
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    })
 
}
  slidePrev() {

  }

  slideNext() {

  }

  callSupport() {
    
  }


  getReview(vendorId){
   
    this._reviewuserService.getreviewsbyuserid(vendorId).subscribe((res: ReviewUserResponse[]) =>{ this.Review = res
      var sum=0;
      var number=0;
      this.Review.forEach(element=>{
             sum+=element.rating;
             number++;
            });
           var rating=sum/number;
           this.rating=Math.round(rating);
          
        });
     
            
  }
  addReview(rate){
    
      const review = new UserReview();
      review.init({
        userId: this.vendorId,
        raterId:this._session.userId,
        rating:rate
      });

      this._reviewuserService.create(review).subscribe(
        (res) => {    

        },
        async (error) => {
          // Unexpected result!
          // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
          console.log('error ', error);
        });
  }

  async  showAlert(msg) {  
    const alert = await this.alertCtrl.create({  
      header: 'المفضلة',  
      subHeader: '',  
      message:  msg , 
      buttons: ['تم']  
    });  
    await alert.present();  
    const result = await alert.onDidDismiss();  
    console.log(result);  
  }  
  createVendorWishList(){
    const vendorWishlist = new VendorWishlist();
    vendorWishlist.init({
      vendorId: this.vendorId,
      userId:this._session.userId,
    });
   
    this._vendorwishlistService.createwish(vendorWishlist).subscribe(
      (res) => {
        this.showAlert('تمت إضافة المطعم إلى المفضلة بنجاح!' );  
        this.isFavVendor(); 
      },
      async (error) => {
        // Unexpected result!
        // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
        console.log('error ', error);
      });
  }

  isFavVendor(){
    this._vendorwishlistService.getwishlist(this._session.userId).subscribe((res:VendorWishListResponseModel[])=>{ this.vendorlist = res;
    this.vendorlist.forEach(element=>{
    if( this.vendorId ==element.vendorId)
    {
      this.isFav=true; 
      this.vendorWishListId=element.id;
    }

   });
 });
}
createWishList(productId){
  const whishlist = new Wishlist();
  whishlist.init({
    productId: productId,
    userId:this._session.userId,
  });
 
  this._productsWishList.createwish(whishlist).subscribe(
    (res) => {
      this.showAlert('تمت إضافة المنتج إلى المفضلة بنجاح!'); 
    this.ionViewWillEnter();
    },
    async (error) => {
      // Unexpected result!
      // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
      console.log('error ', error);
    });
}
deleteWishList(wishListId){
  this._productsWishList.deletewish(wishListId).subscribe((res:boolean)=>{ 
   if(res==true)
   {
    this.showAlert('تمت إزالة المنتج من المفضلة بنجاح!' );
    this.ionViewWillEnter();
   }
   else
   this.showAlert('لم تتم إزالة المنتج من المفضلة !');

  });
}
isFavProduct(){
  this._productsWishList.getwishlist(this._session.userId).subscribe((res:WishListModel[])=>{ this.productslist = res;
  this.productslist.forEach(element=>{
  this.indexedArray[element.productId] = true;
 });
});
}

handleRefresh(event) {
  setTimeout(() => {
    this.ngOnInit();
    event.target.complete();
  }, 2000);
};

deleteVendorWishList (){
    this._vendorwishlistService.deletewish(this.vendorWishListId).subscribe((res:boolean)=>{ 
     if(res==true)
     {
      this.showAlert('تمت إزالة المطعم من المفضلة بنجاح!' );
      this.isFav=false;
     }
     else
     this.showAlert('لم تتم إزالة المطعم من المفضلة !');

    });
  }

}
