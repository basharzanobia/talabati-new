import { Component, OnInit } from '@angular/core';
import { LoginResponseModel } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppAuthService } from 'src/shared/auth/app-auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userInfo: LoginResponseModel;

  constructor(private _session: AppSessionService,
    private _auth: AppAuthService) { }

  ngOnInit() {
    this.userInfo = this._session.user;
  }

  logout() {
    this._auth.logout(true);
  }

}
