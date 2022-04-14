import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
        private _router: Router
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

    private processAuthenticateResult(
        authenticateResult: LoginResponseModel
    ) {
        this.authenticateResult = authenticateResult;

        if (authenticateResult.success) {
            // Successfully logged in
            this.login(
                authenticateResult.token,
                this.rememberMe
            );
        } else {
            // Unexpected result!

            console.log('Unexpected authenticateResult!');
            this._router.navigate(['/log-in']);
        }
    }

    private login(
        accessToken: string,
        rememberMe?: boolean
    ): void {
        // const tokenExpireDate = rememberMe
        //     ? new Date(new Date().getTime() + 1000 * expireInSeconds)
        //     : undefined;

        localStorage.setItem("token", accessToken);

        this._router.navigate(['/intro']);
    }

    private clear(): void {
        this.authenticateModel = new LoginApiModel();
        this.authenticateResult = null;
        this.rememberMe = false;
    }
}