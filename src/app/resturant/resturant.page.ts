import { Component, OnInit } from '@angular/core';
import { HomeapiServiceProxy, Product } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-resturant',
  templateUrl: './resturant.page.html',
  styleUrls: ['./resturant.page.scss'],
})
export class ResturantPage implements OnInit {
  featuredProducts: Product[] = [];

  constructor(
    private _homeService: HomeapiServiceProxy
  ) { }

  ngOnInit() {
    this._homeService.featuredproduct()
    .subscribe((res: Product[]) => {
      this.featuredProducts = res;
    });
  }

}
