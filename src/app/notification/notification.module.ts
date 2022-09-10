import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationPage } from './notification.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { NotificationPageRoutingModule } from './notification-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: NotificationPage }]),
    NotificationPageRoutingModule,
  ],
  declarations: [NotificationPage]
})
export class NotificationPageModule {}
