import { Component, OnInit } from '@angular/core';
import { UserapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { LoadingService } from '../services/loading.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  validation_messages = {
   
    'email': [

      { type: 'required', message: 'هذا الحقل مطلوب' },
    ],

    };
    emailForm: FormGroup;
 // loading: boolean;
 errorMsg;
  _userService:UserapiServiceProxy;
  constructor(public loading: LoadingService,userService:UserapiServiceProxy, private _router: Router) {
    this._userService = userService;
    this.emailForm = new FormGroup({
      email: new FormControl('',Validators.required)
    });
   }

  ngOnInit() {
  }
reset(){
 // this.loading = true;
 this.loading.present();
  var email = this.emailForm.value.email;
  localStorage.setItem('email-reset',email);
  console.log( localStorage.getItem('email-reset'));
  this._userService.forgetpasswordapp(email).subscribe((res)=>{
    if(res)
    {
      this.loading.dismiss();
      console.log("reset");
      this._router.navigate(['/reset-token']);
    }
    else{
      this.loading.dismiss();
    this.errorMsg = "عذرا حصل خطأ غبر متوقع، الرجاء أعد المحاولة بعد فترة زمنية";
    } 
  },
  error => {
    this.loading.dismiss();
    console.log(error);
    this.errorMsg = "عذرا حصل خطأ غبر متوقع، الرجاء أعد المحاولة بعد فترة زمنية";
    
  });
 /*this._userService.forgetpasswordapp(email).pipe(
  finalize(() => this.loading = false)
).subscribe((res)=>{
  if(res)
  {
    console.log("reset");
    this._router.navigate(['/reset-token']);
  }
  else{
  this.errorMsg = "عذرا حصل خطأ غبر متوقع، الرجاء أعد المحاولة بعد فترة زمنية";
  }
 
});*/
}
}
