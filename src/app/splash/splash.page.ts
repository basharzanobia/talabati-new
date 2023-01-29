import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AppSessionService } from 'src/shared/session/app-session.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  userName = this._session.user?.name;

  constructor(private _session: AppSessionService,public router:Router) { 
    setTimeout(()=>{
      this.router.navigateByUrl('/intro');
    },3000);
  }

  ngOnInit() {
  }

}
