import { Component, OnInit } from '@angular/core';
import { UserapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { LoadingService } from '../services/loading.service';
@Component({
  selector: 'app-reset-token',
  templateUrl: './reset-token.page.html',
  styleUrls: ['./reset-token.page.scss'],
})
export class ResetTokenPage implements OnInit {
  validation_messages = {
   
    'token': [

      { type: 'required', message: 'هذا الحقل مطلوب' },
    ],

    };
  tokenForm: FormGroup;
  email;errorMsg;
  _userService:UserapiServiceProxy;
  constructor(public loading: LoadingService,userService:UserapiServiceProxy, private _router: Router,public formBuilder: FormBuilder) {
    this._userService = userService;
    this.tokenForm = new FormGroup({
      token: new FormControl('',Validators.required)
    });
   }
  
    ngOnInit() {
   
    }
    checkToken(){
      this.loading.present();
     this.email = localStorage.getItem('email-reset');
     console.log(this.tokenForm.value.token);
     var token = this.tokenForm.value.token;
     this._userService.checktokenforpassreset(token,this.email).subscribe((res)=>{
      if(res){
        this.loading.dismiss();
        console.log("true token");
        this._router.navigate(['/new-password']);
      }
      else{
        this.loading.dismiss();
      this.errorMsg = "رمز التفعيل غير صالح";
      }
     },
     error => {
      this.loading.dismiss();
      this.errorMsg = "عذرا حصل خطأ غير متوقع";
     });
    }
  }