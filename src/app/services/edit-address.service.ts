import { Injectable } from '@angular/core';
import { AddressapiServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class EditAddressService {
  
  constructor(private _addressService: AddressapiServiceProxy) { }

  /*
  setData(id, data) {
    this.data[id] = data;
  }
 */

  getData(id) {
    let address = this._addressService.getbyid(id);
    return address;
  }
}
