import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
@Input('img')img : any;
@ViewChild(IonSlides) slides :  IonSlides;
sliderOpts={
zoom:true
}
  constructor(private modalController: ModalController,
    private router: Router) { console.log(this.img)}
ionViewDidEnter(){
  this.slides.update();
}
  ngOnInit() {
  }
  dissmis(){
    this.modalController.dismiss();
  }
  openOffers(){
    this.modalController.dismiss();
    this.router.navigate(['/offers'])
  }
}
