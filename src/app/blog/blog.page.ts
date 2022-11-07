import { Component, OnInit } from '@angular/core';
import { DynamicPageModel, DynamicpagesServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {

  pages: DynamicPageModel[] = [];

constructor(  
  private _dynamicpagesService: DynamicpagesServiceProxy,
) { }


  ngOnInit() {
    this._dynamicpagesService.getpages().subscribe((res: DynamicPageModel[]) => this.pages = res);
  
  }
  
  }
  

