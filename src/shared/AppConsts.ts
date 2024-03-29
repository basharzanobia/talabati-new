﻿export class AppConsts {

    static remoteServiceBaseUrl: string;
    static appBaseUrl: string;
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish
    static logoAssetBaseUrl: string;
    static adminId: string = "11111111-1111-1111-1111-111111111111";
    static currency = "ريال" ;

    static localeMappings: any = [];

    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'talabati'
    };

    static readonly authorization = {
        encryptedAuthTokenName: 'enc_auth_token'
    };
}

