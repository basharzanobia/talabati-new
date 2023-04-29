import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppAuthService } from 'src/shared/auth/app-auth.service';
import { 
  StringBaseResponse,
  UserapiServiceProxy,
  UserRegisterModel } 
from 'src/shared/service-proxies/service-proxies';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidators } from '../validators/password-validators';
import { LoadingService } from '../services/loading.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  submitted = false;
  model: UserRegisterModel = new UserRegisterModel();
  saving = false;
  showPass: boolean = false;
  showConfirm: boolean = false;
  name;
  signupForm: FormGroup;

  constructor(private _accountService: UserapiServiceProxy,
    private _router: Router,
    private authService: AppAuthService,
    private loading : LoadingService) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      name: new FormControl(this.model.name, [
        Validators.required
      ]),
      middleName: new FormControl(this.model.middleName,[
        Validators.required,
      ]),
      lastName: new FormControl(this.model.lastName,[
        Validators.required,
      ]),
      nickName: new FormControl(this.model.nickName,[
      ]),
      gender: new FormControl(this.model.gender,[
        Validators.required,
      ]),
      mobile: new FormControl(this.model.mobile,[
        Validators.required,
      ]),
      additionalMobile: new FormControl(this.model.additionalMobile,[
      ]),
      email: new FormControl(this.model.email,[
        Validators.email, Validators.required,
      ]),
      password: new FormControl(this.model.password,[
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl(this.model.confirmPassword,[
        Validators.required,
      ]),
    },
    {
      validators: PasswordValidators.MatchValidator
    }
    );
  }
  get f() {
    return this.signupForm.controls;
  }
  get minLengthValid() {
    return !this.signupForm.controls["password"].hasError("minlength");
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.signupForm.invalid) {
      for (const control of Object.keys(this.signupForm.controls)) {
        this.signupForm.controls[control].markAsTouched();
      }
      return;
    } 
    this.loading.present();
    this.saving = true;
    this.model = this.signupForm.value;
    this._accountService
      .register(this.model)
      .subscribe((result: StringBaseResponse) => {
        this.loading.dismiss();
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

  password() {
    this.showPass = !this.showPass;
  }

  confirmPassword() {
    this.showConfirm = !this.showConfirm;
  }

}
