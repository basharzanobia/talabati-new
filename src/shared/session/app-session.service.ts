import { Injectable } from '@angular/core';
import { LoginResponseModel } from '../service-proxies/service-proxies';

@Injectable()
export class AppSessionService {

    constructor() {
    }

    get user(): LoginResponseModel {
        const user = new LoginResponseModel();
        user.init({
            name : localStorage.getItem("talabati-username"),
            email : localStorage.getItem("talabati-email"),
            role : localStorage.getItem("talabati-role"),
            id: localStorage.getItem("talabati-id")
        });
        return user.id ? user : undefined;
    }

    get userId(): string {
        return localStorage.getItem("talabati-id") ? localStorage.getItem("talabati-id") : null;
    }

}
