import { Injectable } from '@angular/core';
import {UserAddress, AddressapiServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class AddressDataService {
  
  private _addressess:UserAddress[] = [];

  constructor(private _addressService: AddressapiServiceProxy) { }

  
  initAddresses(addressess:UserAddress[]) {
    this._addressess = addressess;
    console.log(addressess);
  }
 
  getAddresses():UserAddress[]{
    console.log("get");
    return this._addressess;
  }

  /*
  addAddress(address:UserAddress) {
    //let address = this._addressService.getbyid(id);
    this._addressess.push(address);
    return address;
  }
  */

}
