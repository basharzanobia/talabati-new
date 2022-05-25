import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppAuthService } from 'src/shared/auth/app-auth.service';
import { 
  StringBaseResponse,
  UserapiServiceProxy,
  UserRegisterModel } 
from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  model: UserRegisterModel = new UserRegisterModel();
  saving = false;
  name;

  constructor(private _accountService: UserapiServiceProxy,
    private _router: Router,
    private authService: AppAuthService) { }

  ngOnInit() {
  }

  save(): void {
    this.saving = true;
    this._accountService
      .register(this.model)
      .subscribe((result: StringBaseResponse) => {
        if (!result.success) {
          console.log(result.response);
          this._router.navigate(['/sign-up']);
          return;
        }

        // Autheticate
        this.saving = true;
        this.authService.authenticateModel.email = this.model.email;
        this.authService.authenticateModel.password = this.model.password;
        this.authService.authenticate(() => {
          this.saving = false;
        });
      });
  }

}
