import { Component, OnInit } from '@angular/core';
import { ResetPasswordViewModel , UserapiServiceProxy} from 'src/shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { AppAuthService } from 'src/shared/auth/app-auth.service';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { LoadingService } from '../services/loading.service';
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {
  validation_messages = {
   
    'newPass': [

      { type: 'required', message: 'هذا الحقل مطلوب' },
      { type: 'pattern', message: ' ويجب أن تحتوي كلمة المرور على حرف صغير وآخر كبير بالإضافة للأرقام وألا تقل عن 6 محارف' },
    ],
    'matching_passwords': [
      { type: 'checkpassword', message: 'كلمة المرور والتأكيد غير متطابقتان' }
    ],
    };
  resetPasswordViewModel = new  ResetPasswordViewModel();
  validations_form;errorMsg;
  matching_passwords_group: FormGroup;
  _userService:UserapiServiceProxy;
passError;
  constructor(public loading: LoadingService,userService:UserapiServiceProxy, private _router: Router, public formBuilder: FormBuilder) {
    this._userService = userService;
    this.matching_passwords_group = new FormGroup({
      newPass: new FormControl('', Validators.compose([
    
        Validators.required,
        Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,30}$/)
      ])),
      confirmPass: new FormControl('',)
    }, (formGroup: FormGroup) => {
      return this.checkpassword(formGroup);
    });
    this.validations_form = this.formBuilder.group({
      matching_passwords: this.matching_passwords_group,
    },
);

   }
   checkpassword(formGroup: FormGroup) {
    let val;
    let valid = true;
    for (let key in formGroup.controls) {
    
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = <FormControl>formGroup.controls[key];
        if (val === undefined) {
          val = control.value
        } else {
          if (val !== control.value) {
            valid = false;
            break;
          }
        }
       
      }
    }

    if (valid) {
      return null;
    }

    return {
     checkpassword: true
    };
  
   }
  ngOnInit() {
  }

  save(){
    this.loading.present();
    this.resetPasswordViewModel.email = localStorage.getItem('email-reset');  
    this.resetPasswordViewModel.token = "-";
   console.log(this.matching_passwords_group.get('newPass').value);
   console.log(this.matching_passwords_group.get('confirmPass').value);
   this.resetPasswordViewModel.newPassword = this.matching_passwords_group.get('newPass').value;
   this.resetPasswordViewModel.confirmPassword = this.matching_passwords_group.get('confirmPass').value;
  this._userService.resetpasswordapp(this.resetPasswordViewModel).subscribe((res)=>{
if (res){
  this.loading.dismiss();
  console.log("changed pass");
  this._router.navigate(['/log-in']);
}
else{
  this.loading.dismiss();
  this.errorMsg = " عذرا حصل خطأ، حاول مرة أخرى بعد فترة زمنية";
}
  },
  error => {
    this.loading.dismiss();
    this.errorMsg = " عذرا حصل خطأ، حاول مرة أخرى بعد فترة زمنية";
  })

}
}