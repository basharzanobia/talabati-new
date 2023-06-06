import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppAuthService } from 'src/shared/auth/app-auth.service';
import { LoginApiModel } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {
  submitting = false;
  show: boolean = false;
  loginForm: FormGroup;
  model : LoginApiModel = new LoginApiModel();
  rememberMe: boolean =  JSON.parse(localStorage.getItem("rememberMe")) ? JSON.parse(localStorage.getItem("rememberMe")) : true;
  pass="";email="";
  constructor(public authService: AppAuthService) { 
  }

  ngOnInit() {
    if(this.rememberMe)
    {
  this.email = localStorage.getItem("talabati-email");
  this.pass = localStorage.getItem("talabati-password");
    }
    this.loginForm = new FormGroup({
      email: new FormControl( this.email, [
        Validators.required
      ]),
      password: new FormControl(  this.pass, [
        Validators.required
      ]),
      rememberMe: new FormControl(this.authService.rememberMe),
    });

  }


  login(): void {
    console.log("111");
    if (this.loginForm.invalid) {
      for (const control of Object.keys(this.loginForm.controls)) {
        this.loginForm.controls[control].markAsTouched();
      }
      return;
    } 
    this.submitting = true;
    console.log(this.loginForm.value['email']);
    this.authService.authenticateModel.email = this.loginForm.value['email'];
    this.authService.authenticateModel.password = this.loginForm.value['password'];
    if(this.rememberMe)
    {
       console.log("remember me");
       console.log( this.loginForm.value['password']);
        localStorage.setItem("talabati-password",  this.loginForm.value['password']);
       }
  
    this.authService.rememberMe = this.loginForm.value['rememberMe'];
    this.authService.authenticate(() => (this.submitting = false));
  }

  password() {
    this.show = !this.show;
}

}
