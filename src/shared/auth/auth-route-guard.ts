import { Injectable } from '@angular/core';
import { AppSessionService } from '../session/app-session.service';

import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild
} from '@angular/router';

@Injectable()
export class AppRouteGuard implements CanActivate, CanActivateChild {

    constructor(
        private _router: Router,
        private _sessionService: AppSessionService,
    ) { 
        console.log("in guard auth")
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log('_sessionService ', this._sessionService.user);
        
        if (!this._sessionService.user) {
            this._router.navigate(['/log-in']);
            return false;
        }

        //this._router.navigate([this.selectBestRoute()]);
        return true;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    selectBestRoute(): string {
        if (!this._sessionService.user) {
            return '/log-in';
        }

       // return '/intro';
       this._router.navigate(['/splash']);
    }
}
