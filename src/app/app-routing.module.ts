import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from "./shared/login/login.component";
import {ChildrenListComponent} from "./admin/children/children-list/children-list.component";
import {ChildrenEditComponent} from "./admin/children/children-edit/children-edit.component";
import {AdminComponent} from "./admin/admin.component";
import {ParentComponent} from "./parent/parent.component";
import {AuthGuard} from "./guards/auth.guard";
import {LoginGuard} from "./guards/login.guard";
import {TeacherListComponent} from "./admin/teacher/teacher-list/teacher-list.component";
import {TeacherEditComponent} from "./admin/teacher/teacher-edit/teacher-edit.component";
import {HomepageComponent} from "./shared/homepage/homepage.component";
import {ParentRequestsListComponent} from "./parent/request/parent-requests-list/parent-requests-list.component";
import {AdminPaymentListComponent} from "./admin/admin-payment-list/admin-payment-list.component";
import {ParentPaymentListComponent} from "./parent/parent-payment-list/parent-payment-list.component";
import {AnnouncementListComponent} from "./shared/announcement/announcement-list/announcement-list.component";
import {ClassBookComponent} from "./admin/classbook/class-book.component";
import {AdminRequestListComponent} from "./admin/request/admin-request-list/admin-request-list.component";
import {AnnouncementEditComponent} from "./shared/announcement/announcement-edit/announcement-edit.component";
import {NewRequestComponent} from "./parent/request/new-request/new-request.component";
import {ParentRequestEditComponent} from "./parent/request/parent-request-edit/parent-request-edit.component";
import {AdminRequestEditComponent} from "./admin/request/admin-request-edit/admin-request-edit.component";
import {RegisterComponent} from "./parent/register/register.component";
import {AddAccountComponent} from "./admin/add-account/add-account.component";

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {path: '', component: HomepageComponent},
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'add-account',
        component: AddAccountComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'children',
        component: ChildrenListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'children/add',
        component: ChildrenEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'children/:id',
        component: ChildrenEditComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'classbook',
        component: ClassBookComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'requests',
        component: AdminRequestListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'requests/:id',
        component: AdminRequestEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'teachers',
        component: TeacherListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'teachers/add',
        component: TeacherEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'teachers/:id',
        component: TeacherEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'payments',
        component: AdminPaymentListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'announcements',
        component: AnnouncementListComponent,
      },
      {
        path: 'announcements/add',
        component: AnnouncementEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'announcements/:id',
        component: AnnouncementEditComponent,
        canActivate: [AuthGuard],
      },
    ]
  },
  {
    path: '', component: ParentComponent, children: [
      {path: '', component: HomepageComponent},
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'requests',
        component: ParentRequestsListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'requests/add',
        component: NewRequestComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'requests/:id',
        component: ParentRequestEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'payments',
        component: ParentPaymentListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'announcements',
        component: AnnouncementListComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ]
  },

  {path: '**', redirectTo: '/login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
