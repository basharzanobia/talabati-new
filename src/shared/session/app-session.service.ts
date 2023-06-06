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
     
            user.init({
                name : localStorage.getItem("talabati-username"),
                email : localStorage.getItem("talabati-email"),
                role : localStorage.getItem("talabati-role"),
                id: localStorage.getItem("talabati-id")
            });
       
    
   
    
        return user.id ? user : undefined;
    }

    get userId(): string {
            var u = localStorage.getItem("talabati-id") ? localStorage.getItem("talabati-id") : null;
        
       
console.log(u);
return u;
    }

}
