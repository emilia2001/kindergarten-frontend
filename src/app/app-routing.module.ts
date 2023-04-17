import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginAdminComponent} from "./admin/login-admin/login-admin.component";
import {WelcomeAdminComponent} from "./admin/welcome-admin/welcome-admin.component";
import {ChildrenListComponent} from "./children/children-list/children-list.component";
import {ChildrenEditComponent} from "./children/children-edit/children-edit.component";
import {AdminComponent} from "./admin/admin.component";
import {UserComponent} from "./user/user.component";
import {AuthGuard} from "./guards/auth.guard";
import {LoginGuard} from "./guards/login.guard";

const routes: Routes = [
  { path: '', component: UserComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {path: '', component: WelcomeAdminComponent},
      {
        path: 'login',
        component: LoginAdminComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'children',
        component: ChildrenListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'children/:id',
        component: ChildrenEditComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
