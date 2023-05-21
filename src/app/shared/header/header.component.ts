import { Component } from '@angular/core';
import {Router} from "@angular/router";

import {AccountService} from "../../services/account/account.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    public accountService: AccountService,
    public router: Router) {
  }

  handleLogout(){
    this.accountService.logout();
    this.isAdminPage() ? this.router.navigate(['/admin']) : this.router.navigate([''])
  }

  isAdminPage() {
    return this.router.url.startsWith('/admin');
  }
}
