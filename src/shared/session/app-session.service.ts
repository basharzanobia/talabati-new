import { Injectable } from '@angular/core';
import { LoginResponseModel } from '../service-proxies/service-proxies';

@Injectable()
export class AppSessionService {
     rememberMe;
    constructor() {
    }

    get user(): LoginResponseModel {
        const user = new LoginResponseModel();
        this.rememberMe = JSON.parse(localStorage.getItem("rememberMe")) ? JSON.parse(localStorage.getItem("rememberMe")) : null;
console.log(" remember from session "+this.rememberMe);
     
      if(this.rememberMe !=null){
        if(this.rememberMe){
            user.init({
                name : localStorage.getItem("talabati-username"),
                email : localStorage.getItem("talabati-email"),
                role : localStorage.getItem("talabati-role"),
                id: localStorage.getItem("talabati-id")
            });
        }
        else {
            user.init({
                name : sessionStorage.getItem("talabati-username"),
                email : sessionStorage.getItem("talabati-email"),
                role : sessionStorage.getItem("talabati-role"),
                id: sessionStorage.getItem("talabati-id")
            }); 
        }
    }
   
    
        return user.id ? user : undefined;
    }

    get userId(): string {
        if(this.rememberMe){
            return localStorage.getItem("talabati-id") ? localStorage.getItem("talabati-id") : null;
        }
        else{
            return sessionStorage.getItem("talabati-id") ? sessionStorage.getItem("talabati-id") : null;
        }

    }

}
