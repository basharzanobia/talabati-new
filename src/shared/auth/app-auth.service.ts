import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
    UserapiServiceProxy,
    LoginApiModel,
    LoginResponseModel,
    
} from '../service-proxies/service-proxies';
import { AppSessionService } from '../session/app-session.service';

@Injectable()
export class AppAuthService {
    authenticateModel: LoginApiModel ;
    authenticateResult: LoginResponseModel; 
    rememberMe: boolean =  JSON.parse(localStorage.getItem("rememberMe")) ? JSON.parse(localStorage.getItem("rememberMe")) : true;

    constructor(
        private _userService: UserapiServiceProxy,
        private _router: Router,
        public alertController: AlertController,
        private usersession : AppSessionService
    ) {
      //  this.clear();
      this.authenticateModel = new LoginApiModel();
      console.log("auth instantiated ");
       
    }

    logout(reload?: boolean): void {
        console.log("from log out")
        localStorage.clear();
        console.log(this.usersession.user)
       /*  if (reload) {
            this._router.navigate(['/log-in']);
        } */
    }

    authenticate(finallyCallback?: () => void): void {
        finallyCallback = finallyCallback || (() => { });
console.log("in");
        this._userService
            .login(this.authenticateModel)
            .subscribe((result: LoginResponseModel) => {
                console.log('result ', result);
                
                this.processAuthenticateResult(result);
            });
    }

    private async processAuthenticateResult(
        authenticateResult: LoginResponseModel
    ) {
        this.authenticateResult = authenticateResult;

        if (authenticateResult.success) {
            // Successfully logged in
            this.login(
                authenticateResult,
                this.rememberMe
            );
        } else {
            // Unexpected result!
            await this.presentAlert('فشل', 'هناك خطأ في اسم المستخدم أو كلمة المرور', null)
            console.log('Unexpected authenticateResult!');
            this._router.navigate(['/log-in']);
        }
    }

    private login(
        authenticateResult: LoginResponseModel,
        rememberMe?: boolean
    ): void {
        // const tokenExpireDate = rememberMe
        //     ? new Date(new Date().getTime() + 1000 * expireInSeconds)
        //     : undefined;
        localStorage.setItem("rememberMe", String(rememberMe));
        console.log(rememberMe);
      if(rememberMe){
        localStorage.setItem("token", authenticateResult.token);
        localStorage.setItem("talabati-username", authenticateResult.name);
        localStorage.setItem("talabati-email", authenticateResult.email);
        localStorage.setItem("talabati-role", authenticateResult.role);
        localStorage.setItem("talabati-id", authenticateResult.id);
      }
      else{
        localStorage.setItem("token", authenticateResult.token);
        sessionStorage.setItem("talabati-username", authenticateResult.name);
        sessionStorage.setItem("talabati-email", authenticateResult.email);
        sessionStorage.setItem("talabati-role", authenticateResult.role);
        sessionStorage.setItem("talabati-id", authenticateResult.id);
      }
    

        this._router.navigate(['/intro']);
    }

    private clear(): void {
        this.authenticateModel = new LoginApiModel();
        //this.authenticateResult = null;
       // this.rememberMe = false;
    }

    async presentAlert(header: string, msg: string, subHeader: string) {
        const alert = await this.alertController.create({
          cssClass: 'app-alert',
          header: header,
          subHeader: subHeader,
          message: msg,
          buttons: ['OK']
        });
    
        await alert.present();
    
        const { role } = await alert.onDidDismiss();
        console.log('onDidDismiss resolved with role', role);
    }
}