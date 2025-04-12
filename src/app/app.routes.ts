import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CategoriesComponent } from './forum/categories/categories.component';
import { ThreadsComponent } from './forum/threads/threads.component';
import { ThreadComponent } from './forum/thread/thread.component';
import { NewThreadComponent } from './forum/new-thread/new-thread.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { PanelComponent } from './admin/panel/panel.component';
import { adminGuard } from './auth/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [authGuard],
  },
  { path: 'categories', component: CategoriesComponent },
  { path: 'category/:id', component: ThreadsComponent },
  { path: 'thread/:id', component: ThreadComponent, canActivate: [authGuard] },
  { path: 'new-thread', component: NewThreadComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'admin', component: PanelComponent, canActivate: [adminGuard] },
];
