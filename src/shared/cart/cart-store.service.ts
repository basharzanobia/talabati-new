import { Injectable } from '@angular/core';

@Injectable()
export class CartStoreService {
  private items = [];
  private readonly storageKey = 'TalabakCart';
  constructor() {
    this.items = JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  addToCart(product) {
    this.items.push(product);
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  get Items() {
    return this.items;
  }
  clearCart() {
    this.items = [];
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    return this.items;
  }

  get Total() {
    const sum = this.items.reduce((sum, current) => sum + (current.varientId!=0?current.varient.price:current.product.price) * current.quantity, 0);
    return sum;
  }







  decItem(productId, varientId) {
    const i = this.items.findIndex(e => e.productId === productId && e.varientId === varientId);
    if (i > -1) {
      const item = this.Items[i];
      if(item.quantity > 1)
      item.quantity =  item.quantity - 1 ;
      else if(item.quantity === 1)
      {
        this.items.splice(i, 1);
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      }
    } 
  }

  incItem(product) {
    const i = this.items.findIndex(e => e.productId === product.productId && e.varientId === product.varientId);
    if (i > -1) {
      const item = this.Items[i];
      item.quantity = item.quantity + 1;
    } 
    else{
      this.addToCart(product)
    }
  }
addNote(note,productId,varientId){
  console.log(note+" "+ productId+" "+ varientId);
  const i = this.items.findIndex(e => e.productId === productId && e.varientId === varientId);
  if (i > -1) {
    console.log("hi")
   this.Items[i].note =   note;
   localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }  
}
  getCountOfItem(productId: number) : number{
    const i = this.items.findIndex(e => e.productId === productId);
    if (i > -1) {
      return(this.Items[i].quantity);
    } 
    else return 0;
  }
  
  getCountOfItemWithVarient(productId,varientId) : number{
    const i = this.items.findIndex(e => e.productId === productId && e.varientId === varientId);
    if (i > -1) {
      return(this.Items[i].quantity);
    } 
    else return 0;
  }
  
  removeFromCart(index: number) {
    this.items.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
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
 

  getShippingPrices() {
    
  }
}
