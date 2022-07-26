import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
    UserapiServiceProxy,
    LoginApiModel,
    LoginResponseModel,
    
} from '../service-proxies/service-proxies';

@Injectable()
export class AppAuthService {
    authenticateModel: LoginApiModel;
    authenticateResult: LoginResponseModel;
    rememberMe: boolean;

    constructor(
        private _userService: UserapiServiceProxy,
        private _router: Router,
        public alertController: AlertController
    ) {
        this.clear();
    }

    logout(reload?: boolean): void {
        localStorage.clear();
    }

    authenticate(finallyCallback?: () => void): void {
        finallyCallback = finallyCallback || (() => { });

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

        localStorage.setItem("token", authenticateResult.token);
        localStorage.setItem("talabati-username", authenticateResult.name);
        localStorage.setItem("talabati-email", authenticateResult.email);
        localStorage.setItem("talabati-role", authenticateResult.role);
        localStorage.setItem("talabati-id", authenticateResult.id);

        this._router.navigate(['/intro']);
    }

    private clear(): void {
        this.authenticateModel = new LoginApiModel();
        this.authenticateResult = null;
        this.rememberMe = false;
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