import { Routes } from '@angular/router';
import { HomeComponent } from './conversazioni/home/home.component/home.component';
import { LoginComponent } from './conversazioni/session/login.component/login.component';
import { SignupComponent } from './conversazioni/session/signup.component/signup.component';
import { AdminOrderListComponent } from './conversazioni/admin/adminorderlist/adminorderlist';
import { Adminviaggiocreate } from './conversazioni/admin/adminviaggiocreate/adminviaggiocreate';
import { Listaviaggio } from './conversazioni/catalogo/listaviaggio/listaviaggio';
import { Dettaglioviaggio } from './conversazioni/catalogo/dettaglioviaggio/dettaglioviaggio';
import { AdminViaggioEdit } from './conversazioni/admin/admin-viaggio-edit/admin-viaggio-edit';
import { AdminViaggioList } from './conversazioni/admin/admin-viaggio-list/admin-viaggio-list';
import { AdminUserList } from './conversazioni/admin/admin-user-list/admin-user-list';
import { Cart } from './conversazioni/cliente/cart/cart';
import { CheckOut } from './conversazioni/cliente/check-out/check-out';
import { OrderHistory } from './conversazioni/cliente/order-history/order-history';
import { Wishlist } from './conversazioni/cliente/wishlist/wishlist';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  { path: 'viaggi', component: Listaviaggio },
  { path: 'viaggi/nuovo', component: Adminviaggiocreate },
  { path: 'viaggi/:id', component: Dettaglioviaggio },
  { path: 'viaggi/:id/edit', component: AdminViaggioEdit },

  { path: 'admin/prenotazioni', component: AdminOrderListComponent },
  { path: 'admin/utenti', component: AdminUserList },
  { path: 'admin/viaggi', component: AdminViaggioList },
  { path: 'admin/viaggi/nuovo', component: Adminviaggiocreate },
  { path: 'admin/viaggi/:id/edit', component: AdminViaggioEdit },

  { path: 'carrello', component: Cart },
  { path: 'checkout', component: CheckOut },
  { path: 'order-history', component: OrderHistory },
  { path: 'wishlist', component: Wishlist },


  { path: '**', redirectTo: '' }
];
