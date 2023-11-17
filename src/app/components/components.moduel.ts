import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from './star-rating/star-rating.component';
@NgModule({
    imports: [IonicModule,CommonModule],
    declarations: [ StarRatingComponent ],
    exports: [ StarRatingComponent],
  })
  export class ComponentsModule {}
