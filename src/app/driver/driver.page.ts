import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConsts } from 'src/shared/AppConsts';
import { ReviewUserResponse, ReviewuserapiServiceProxy, UserapiServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {
  AppConsts = AppConsts;
  driver:any;
  arr: number[] = [];
  left: number[] = [];
  rating = 0;
  reviews : ReviewUserResponse[] = [];
  driverId;
  constructor(private userApi: UserapiServiceProxy,
      private route: ActivatedRoute,
      private ReviewService : ReviewuserapiServiceProxy) { }

  ngOnInit() {
    this.driverId =this.route.snapshot.paramMap.get('id');
     this.userApi.getuserbyid(this.driverId).subscribe((res)=>{
      this.driver = res;
    });
    this.ReviewService.getratingofuser(this.driverId).subscribe((res)=>{
      let temp = 0;
      res.forEach((review)=>{
        temp += review.rating;
      });
      this.rating = temp/ res.length;
  });
  this.ReviewService.getreviewsbyuserid(this.driverId).subscribe((res)=>{
    this.reviews = res;
  })
  }


}
