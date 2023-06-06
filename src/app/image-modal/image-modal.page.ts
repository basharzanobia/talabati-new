import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
  constructor(private modalController: ModalController) { console.log(this.img)}
ionViewDidEnter(){
  this.slides.update();
}
  ngOnInit() {
  }
  dissmis(){
    this.modalController.dismiss();
  }
}
