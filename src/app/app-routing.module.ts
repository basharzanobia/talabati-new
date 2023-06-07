import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppRouteGuard } from 'src/shared/auth/auth-route-guard';
import { EditAddressResolverService } from './resolver/edit-address-resolver.service';

const routes: Routes = [

   { 
    path: '', redirectTo: 'intro', pathMatch: 'full'
   }, 
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'guard',
    loadChildren: () => import('./guard-page/guard.module').then( m => m.GuardPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'log-in',
    loadChildren: () => import('./log-in/log-in.module').then( m => m.LogInPageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./verify/verify.module').then( m => m.VerifyPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'new-password',
    loadChildren: () => import('./new-password/new-password.module').then( m => m.NewPasswordPageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'intro',
    loadChildren: () => import('./intro/intro.module').then( m => m.IntroPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'resturant/:vendorId',
    loadChildren: () => import('./resturant/resturant.module').then( m => m.ResturantPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'product/:productId',
    loadChildren: () => import('./product/product.module').then( m => m.ProductPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'invoice/:orderId',
    loadChildren: () => import('./invoice/invoice.module').then( m => m.InvoicePageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'order-confirmed',
    loadChildren: () => import('./order-confirmed/order-confirmed.module').then( m => m.OrderConfirmedPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'tracking/:orderId',
    loadChildren: () => import('./tracking/tracking.module').then( m => m.TrackingPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'order-canceled',
    loadChildren: () => import('./order-canceled/order-canceled.module').then( m => m.OrderCanceledPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'tabs/profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then( m => m.SupportPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then( m => m.BlogPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'addres',
    loadChildren: () => import('./addres/addres.module').then( m => m.AddresPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'edit-addres/:id',
    resolve: {
      address: EditAddressResolverService
    },
    loadChildren: () => import('./edit-address/edit-addres.module').then( m => m.EditAddresPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'edit-addres/:id/:lat/:lang/:addr',
    resolve: {
      address: EditAddressResolverService
    },
    loadChildren: () => import('./edit-address/edit-addres.module').then( m => m.EditAddresPageModule),
    canActivate: [AppRouteGuard]
  },

  {
    path: 'commingsoon',
    loadChildren: () => import('./commingsoon/commingsoon.module').then( m => m.CommingsoonPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'saved-address',
    loadChildren: () => import('./saved-address/saved-address.module').then( m => m.SavedAddressPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then( m => m.WalletPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'coupons',
    loadChildren: () => import('./coupons/coupons.module').then( m => m.CouponsPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'massage',
    loadChildren: () => import('./massage/massage.module').then( m => m.MassagePageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'tchat/:senderId/:recieverId',
    loadChildren: () => import('./tchat/tchat.module').then( m => m.TchatPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'introtow',
    loadChildren: () => import('./introtow/introtow.module').then( m => m.IntrotowPageModule),
    canActivate: [AppRouteGuard]
  },

  {
    path: 'buy-for-me',
    loadChildren: () => import('./buy-for-me/buy-for-me.module').then( m => m.BuyForMePageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'serve-me',
    loadChildren: () => import('./serve-me/serve-me.module').then( m => m.ServeMePageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'favorite',
    loadChildren: () => import('./favorite/favorite.module').then( m => m.FavoritePageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'payments',
    loadChildren: () => import('./payments/payments.module').then( m => m.PaymentsPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'add-payment',
    loadChildren: () => import('./add-payment/add-payment.module').then( m => m.AddPaymentPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'locate-me',
    loadChildren: () => import('./locate-me/locate-me.module').then( m => m.LocateMePageModule),
    canActivate: [AppRouteGuard]
  },

  {
    path: 'addres/:lat/:lang/:addr',
    loadChildren: () => import('./addres/addres.module').then( m => m.AddresPageModule),
    canActivate: [AppRouteGuard]
  },
 
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'reset-token',
    loadChildren: () => import('./reset-token/reset-token.module').then( m => m.ResetTokenPageModule)
  },
  {
    path: 'restaurant-new/:vendorId',
    loadChildren: () => import('./restaurant-new/restaurant-new.module').then( m => m.RestaurantNewPageModule),
    canActivate: [AppRouteGuard]
  },
  {
    path: 'locate-me-edit/:id',
    loadChildren: () => import('./locate-me-edit/locate-me-edit.module').then( m => m.LocateMeEditPageModule)
  },  {
    path: 'image-modal',
    loadChildren: () => import('./image-modal/image-modal.module').then( m => m.ImageModalPageModule)
  },
  {
    path: 'offers',
    loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
  }









];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [AppRouteGuard],
  exports: [RouterModule]
})
export class AppRoutingModule {}
