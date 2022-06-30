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

  clearCart() {
    this.items = [];
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
    return this.items;
  }

  get Total() {
    const sum = this.items.reduce((sum, current) => sum + current.product.price * current.quantity, 0);
    return sum;
  }

  getShippingPrices() {
    
  }
}
