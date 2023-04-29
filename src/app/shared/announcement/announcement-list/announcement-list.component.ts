import {Component} from '@angular/core';
import {AccountService} from "../../../services/account/account.service";
import {BehaviorSubject} from "rxjs";
import {IAnnouncement} from "../../models/IAnnouncement";
import {AnnouncementService} from "../../../services/announcement/announcement.service";

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.scss']
})
export class AnnouncementListComponent {
  isAdminLoggedIn: boolean;
  announcementList: BehaviorSubject<IAnnouncement[]> = new BehaviorSubject<IAnnouncement[]>([]);

  constructor(
    private _accountService: AccountService,
    private _announcementService: AnnouncementService
  ) {
    this.isAdminLoggedIn = _accountService.getIsAdminLoggedIn()
    _announcementService.getAll().subscribe(data => this.announcementList.next(data));
  }

  encodeAnnouncement(announcement: IAnnouncement): string {
    return JSON.stringify(announcement);
  }

  handleDeleteAnnouncement(announcement: IAnnouncement) {
    this._announcementService.delete(announcement.id).subscribe({
        next: data => {
          console.log(data);
          this.announcementList.next(this.announcementList.getValue().filter(a => a.id !== announcement.id))
        }
      }
    );
  }
}
