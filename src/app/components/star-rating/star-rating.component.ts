import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { ReviewuserapiServiceProxy, UserReview, UserapiServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent implements OnInit {

 
  checked_5: boolean;
  checked_45: boolean;
  checked_4: boolean;
  checked_35: boolean;
  checked_3: boolean;
  checked_25: boolean;
  checked_2: boolean;
  checked_15: boolean;
  checked_1: boolean;
  checked_05: boolean;
  checked_0: boolean;

  connection: any;
  messageObjectResponse: any;
  messageObject: any = {};

  newRating = 0;
  validation;
  @Input('id') driverId: any;
  @Input('ratingVal') ratingVal: any;
  @ViewChild('comment') comment; 
  constructor( private ReviewService : ReviewuserapiServiceProxy,
    private loading :LoadingService,
    private userApi : UserapiServiceProxy) { }

  ngOnInit() {
    console.log('in ng-ratings module init');
    console.log(this.ratingVal);
    this.ratingVal = this.ratingVal + 0;
    this.rate(this.ratingVal);

  }

  rate(rateVal: number) {
      if (rateVal> 0 && rateVal<= 0.5) {
          this.checked_05 = true;
      } else if (rateVal > 0.5 && rateVal<= 1) {
          this.checked_1 = true;
      } else if (rateVal > 1 && rateVal <= 1.5) {
          this.checked_15 = true;
      } else if (rateVal > 1.5 && rateVal <= 2) {
          this.checked_2 = true;
      } else if (rateVal > 2 && rateVal <= 2.5) {
          this.checked_25 = true;
      } else if (rateVal > 2.5 && rateVal <= 3) {
          this.checked_3 = true;
      } else if (rateVal > 3 && rateVal <= 3.5) {
          this.checked_35 = true;
      } else if (this.ratingVal > 3.5 && rateVal <= 4) {
          this.checked_4 = true;
      } else if (rateVal > 4 && rateVal <= 4.5) {
          this.checked_45 = true;
      } else if (rateVal > 4.5) {
          this.checked_5 = true;
      }
  }

  send(event: any) {
    console.log(event);
    this.newRating = +event;
    this.messageObject.rating = event;
    this.messageObject.driver_id = this.driverId;
    console.log('rating: ');
    console.log(this.messageObject);
    this.messageObject = {};
    let review = new UserReview();
    review.userId = this.driverId;
    review.rating = +event;

  }


  createComment(){
  
    this.validation ="";
  if(this.newRating === 0){
    this.validation = "الرجاء اختيار تقييم";
    return false;
  }
  if(this.comment.value === ""){
    this.validation = "الرجاء كتابة تعليق";
    return false;
  }
  this.loading.present();
    console.log(this.comment.value);
    console.log(this.newRating);
    let review = new UserReview();
    review.commentText = this.comment.value;
    review.rating = this.newRating;
    review.userId = this.driverId;
    this.ReviewService.create(review).subscribe((res)=>{
      this.loading.dismiss();
      // this.comment = "";
      // this.userApi.getuserbyid(this.driverId).subscribe((res)=>{
      //   this.ratingVal = res.rating;
      // });
    })
  }

}