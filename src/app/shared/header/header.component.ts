import { Component } from '@angular/core';
import {AccountService} from "../../services/account/account.service";
import {Router} from "@angular/router";

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
    this.router.navigate(['/admin'])
    window.location.reload();
  }
}
