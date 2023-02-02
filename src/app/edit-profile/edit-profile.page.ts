import { Component, OnInit } from '@angular/core';
import { AppAuthService } from 'src/shared/auth/app-auth.service';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { LoginResponseModel ,UserapiServiceProxy,ApplicationUser,EditUserAccount} from 'src/shared/service-proxies/service-proxies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  selectedImage;
  showPreview;
  usePicker = true;
  
  passError="";

  login_id="0";
  user = new EditUserAccount();

  constructor(private _auth: AppAuthService,
    private _userService : UserapiServiceProxy,
    private userSession :AppSessionService,
    private _router : Router
    ) {

     }

  ngOnInit() {
    this.login_id = this.userSession.userId;
    this._userService.getuserbyid(this.login_id).subscribe((res:ApplicationUser)=>
      {
        this.user.name =res.name;
        this.user.phone =res.phoneNumber;
        this.user.email = res.email;
        this.user.currentPassword = "";
        this.user.newPassword = "";
        this.user.confirmPassword = "";
      });
  }

  save() {
    if(this.user.currentPassword!=null){
      if(this.user.newPassword!=null){
        if(this.user.confirmPassword!=null && this.user.confirmPassword==this.user.newPassword){
          this._userService.changepassword(this.user).subscribe((res:boolean)=>{
            this._router.navigate(['/tabs/profile']);
          });
        }
        else{
          this.passError='كلمة المرور وتأكيد كلمة المرور غير متطابقتان';
        }
      }
      else {
        this._userService.changepassword(this.user).subscribe((res:boolean)=>{
          console.log("password not changed");
        });
        //this.passError='يرجى إدخال كلمة المرور الجديدة';
      }
    }
    else {
      this.passError='يرجى إدخال كلمة المرور';
    }
  }

}
