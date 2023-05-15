import { Injectable } from '@angular/core';

@Injectable()
export class CartStoreService {
  private items = [];
  private readonly storageKey = 'TalabakCart';
  constructor() {
    this.items = JSON.parse(sessionStorage.getItem(this.storageKey)) || [];
  }

  addToCart(product) {
    this.items.push(product);
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  get Items() {
    return this.items;
  }

  removeFromCart(index: number) {
    this.items.splice(index, 1);
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }
  getItemById(id: number) : number {
    var q = 0;
    this.items.forEach(function (value) {
      if(value.productId == id)
      {
        q = value.quantity;
      }
    }); 
    return q;
  }
  isItemExist(id:number): boolean{
    var q = false;
    this.items.forEach(function (value) {
      if(value.productId == id)
      {
        q= true;
      }
    }); 
    return q;
  }
  clearCart() {
    this.items = [];
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
    return this.items;
  }

  get Total() {
    const sum = this.items.reduce((sum, current) => sum + (current.varientId!=0?current.varient.price:current.product.price) * current.quantity, 0);
    return sum;
  }

  getShippingPrices() {
    
  }
}
