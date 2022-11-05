import { Component, OnInit } from '@angular/core';
import { PopularQuestions,PopularquestionsapiServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  Questions: PopularQuestions[] = [];

  constructor(private _popularQestionsService: PopularquestionsapiServiceProxy,) { }

  ngOnInit() {
    this._popularQestionsService.listbycategory(2).subscribe((res: PopularQuestions[]) => this.Questions = res);
  }

  call() {
    
  }

}
