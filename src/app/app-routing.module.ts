import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppRouteGuard } from 'src/shared/auth/auth-route-guard';

const routes: Routes = [

  { 
    path: '', redirectTo: 'guard', pathMatch: 'full'
   },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
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
    path: 'reset-passowrd',
    loadChildren: () => import('./reset-passowrd/reset-passowrd.module').then( m => m.ResetPassowrdPageModule)
  },
  {
    path: 'new-password',
    loadChildren: () => import('./new-password/new-password.module').then( m => m.NewPasswordPageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'resturant/:vendorId',
    loadChildren: () => import('./resturant/resturant.module').then( m => m.ResturantPageModule)
  },
  {
    path: 'product/:productId',
    loadChildren: () => import('./product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'invoice',
    loadChildren: () => import('./invoice/invoice.module').then( m => m.InvoicePageModule)
  },
  {
    path: 'order-confirmed',
    loadChildren: () => import('./order-confirmed/order-confirmed.module').then( m => m.OrderConfirmedPageModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./tracking/tracking.module').then( m => m.TrackingPageModule)
  },
  {
    path: 'order-canceled',
    loadChildren: () => import('./order-canceled/order-canceled.module').then( m => m.OrderCanceledPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then( m => m.SupportPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'addres',
    loadChildren: () => import('./addres/addres.module').then( m => m.AddresPageModule)
  },
  {
    path: 'commingsoon',
    loadChildren: () => import('./commingsoon/commingsoon.module').then( m => m.CommingsoonPageModule)
  },
  {
    path: 'saved-address',
    loadChildren: () => import('./saved-address/saved-address.module').then( m => m.SavedAddressPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'coupons',
    loadChildren: () => import('./coupons/coupons.module').then( m => m.CouponsPageModule)
  },
  {
    path: 'massage',
    loadChildren: () => import('./massage/massage.module').then( m => m.MassagePageModule)
  },
  {
    path: 'tchat',
    loadChildren: () => import('./tchat/tchat.module').then( m => m.TchatPageModule)
  },
  {
    path: 'introtow',
    loadChildren: () => import('./introtow/introtow.module').then( m => m.IntrotowPageModule)
  },

  {
    path: 'buy-for-me',
    loadChildren: () => import('./buy-for-me/buy-for-me.module').then( m => m.BuyForMePageModule)
  },
  {
    path: 'serve-me',
    loadChildren: () => import('./serve-me/serve-me.module').then( m => m.ServeMePageModule)
  },
  {
    path: 'favorite',
    loadChildren: () => import('./favorite/favorite.module').then( m => m.FavoritePageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'payments',
    loadChildren: () => import('./payments/payments.module').then( m => m.PaymentsPageModule)
  },
  {
    path: 'add-payment',
    loadChildren: () => import('./add-payment/add-payment.module').then( m => m.AddPaymentPageModule)
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
