import { Injectable } from '@angular/core';
import { EditAddressService } from './../services/edit-address.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EditAddressResolverService implements Resolve<any> {

  constructor(private editAddressService: EditAddressService) { }

  resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('id');
    return this.editAddressService.getData(id);
  }

}
