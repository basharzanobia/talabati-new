import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import * as moment from 'moment';


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
  vendor = new  UserResponseModel();
  categories$: Observable<Category[]>;
  catSlideOptsR = {
    slidesPerView: 5.7,
    spaceBetween: 5,
  };
  rating;
  currentUserId = "";
  selectedCategory=0;
  now;
  startTime;
  endTime;
  isClosed = false;
  vendorlist :VendorWishListResponseModel[]=[];
  productslist :IWishListModel[]=[];
  isFav:boolean=false;
  vendorWishListId;
  varientId = 0;
  product: Product = new Product();
  AppConsts = AppConsts;
  Review: ReviewUserResponse[]=[];
  dictionary= new Map<number, number>();
  myWishList : number[]=[];
   indexedArray: {[key: number]: boolean};
  constructor(
    private _session: AppSessionService,
    private router : Router,
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
    this.now = new  Date().toString().split(' ')[4];
    this.currentUserId = this._session.userId;
   
        this.vendorId = this.route.snapshot.paramMap.get('vendorId');
       console.log("vendor Id "+ this.vendorId);
        const productFilter = new ProductFilterModel();
        productFilter.init({ 
          creatorId: this.vendorId,
          currentPage: 1,
          take: 20
        });
        this._vendorService.vendorbyid(this.vendorId).subscribe((res)=>{
          this.vendor = res;
          var start = res.startTime.split(":");
          var end = res.endTime.split(":");
          this.startTime = moment({ hour:+start[0], minute:+start[1] }).format('HH:mm');
          this.endTime = moment({ hour:+end[0], minute:+end[1] }).format('HH:mm');
          if((this.startTime > this.now) || ( this.endTime < this.now)){
                this.isClosed = true;
          }
          this._productsService.list(productFilter)
          .subscribe((res: ProductResponseModel) => {
            this.featuredProducts = res.products;
         
          });
        });
  
     
        this.getReview(this.vendorId);
    

    this.categories$ = this._homeService.menu();


  }
  filterBySubcat(subcat){
    if(subcat === 0){
      this.selectedCategory = subcat;
      const productFilter = new ProductFilterModel();
      productFilter.init({ 
        creatorId: this.vendorId,
        currentPage: 1,
        take: 20
      });
      this._productsService.list(productFilter)
      .subscribe((res: ProductResponseModel) => {
        this.featuredProducts = res.products;
     
      });
    }
    else{
      this.selectedCategory = subcat;
      const productFilter = new ProductFilterModel();
      productFilter.init({ 
        creatorId: this.vendorId,
        category : subcat,
        currentPage: 1,
        take: 20
      });
      this._productsService.list(productFilter)
      .subscribe((res: ProductResponseModel) => {
        this.featuredProducts = res.products;
     
      });
    }

  }
ionViewWillEnter(){
  this.isFavVendor();
  this._productsWishList.getwishlist(this._session.userId).subscribe((res:WishListModel[])=>{ this.productslist = res;
    this.productslist.forEach(element=>{
    this.myWishList.push(element.productId);
   });

  });

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
      varient : this.getVarientById(res,varientId),
      note : ""
    });
  });
 }
  incItem(i: number) {
    if(!this.isClosed){
      this._productsService.single(i).subscribe((res)=>{
        this.cart.incItem({
          productId: i,
          quantity: 1,
          product: res,
          varientId : this.varientId,
          varient : this.getVarientById(res,this.varientId),
          note : ""
        });
      });
    }
  }

  async addNote(productId,varientId) {
    const alert = await this.alertCtrl.create({
      header: 'معلومات اضافية',
      message: '',
      cssClass:'custom-alert',
      buttons: [
        {
          text: 'ارسال',
              handler: (alertData) => { //takes the data 
                if (alertData.refuseMsg == "") {
                  alert.message ="ادخال ملاحظاتك حول الطلب" ;
                  return false;
              } else {
                console.log(alertData.refuseMsg);
                if(this.cart.isItemExist(productId))
                {
                  this.cart.addNote(alertData.refuseMsg,productId,varientId);
                }
              }
              
              }
      }, 
      ],
      inputs: [     
        {
          name:'refuseMsg',
          cssClass:'textarea-alert',
          type: 'textarea',
          placeholder: "ادخال ملاحظاتك حول الطلب" ,
        },
      ],
    });
  
    await alert.present();
  }
  
  incItemWithVarient(pid , vid) {
    console.log(vid+ " vid")
    if(!this.isClosed){
      this._productsService.single(pid).subscribe((res)=>{
        this.cart.incItem({
          productId: pid,
          quantity: 1,
          product: res,
          varientId : vid,
          varient : this.getVarientById(res,vid),
          note:""
        });
      });
    }
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
  decItem(productId,varientId) {
    if(!this.isClosed){
      this.cart.decItem(productId,varientId); 
    }
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
   // this.createWishListDictionary();
   this.myWishList.push(productId);
    },
    async (error) => {
      // Unexpected result!
      // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
      console.log('error ', error);
    });
}
deleteWishList(productId){

  this._productsWishList.deletewishbyproductid(productId).subscribe((res:boolean)=>{ 
   if(res==true)
   {
    this.showAlert('تمت إزالة المنتج من المفضلة بنجاح!' );
    const index =this.myWishList.indexOf(productId);
    if (index !== -1) {
      this.myWishList.splice(index, 1);
    }
   }
   else
   this.showAlert('لم تتم إزالة المنتج من المفضلة !');

  });
}
/* deleteWishList(wishListId){

  this._productsWishList.deletewish(wishListId).subscribe((res:boolean)=>{ 
   if(res==true)
   {
    this.showAlert('تمت إزالة المنتج من المفضلة بنجاح!' );
    
   }
   else
   this.showAlert('لم تتم إزالة المنتج من المفضلة !');

  });
} */
createWishListDictionary(){
  this.dictionary.clear();
  this._productsWishList.getwishlist(this._session.userId).subscribe((res:WishListModel[])=>{ this.productslist = res;
    this.productslist.forEach(element=>{
    this.dictionary.set(element.productId,element.id);
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
