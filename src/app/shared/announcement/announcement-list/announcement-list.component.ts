import {Component, TemplateRef, ViewChild} from '@angular/core';

import {BehaviorSubject, finalize, take} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

import {AccountService} from "../../../services/account/account.service";
import {IAnnouncement} from "../../models/IAnnouncement";
import {AnnouncementService} from "../../../services/announcement/announcement.service";

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.scss']
})
export class AnnouncementListComponent {
  @ViewChild('myModal') myModal: TemplateRef<any> | undefined;
  isAdminLoggedIn: boolean;
  announcementList: BehaviorSubject<IAnnouncement[]> = new BehaviorSubject<IAnnouncement[]>([]);
  isLoadingDelete: boolean = false;
  deleteMessage: string = '';
  deleteError: string = '';
  modalRef: NgbModalRef | undefined;
  deleteId:number = 0;

  constructor(
    private _accountService: AccountService,
    private _announcementService: AnnouncementService,
    public modalService: NgbModal
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

  openModal(announcement: IAnnouncement) {
    this.deleteId = announcement.id!;
    if (this.myModal) {
      this.modalRef = this.modalService.open(this.myModal);

      this.modalRef!.result.then(
        () => {
          console.log('Modal closed');
        },
        () => {
          console.log('Modal dismissed');
        }
      );
    }
  }


  deleteAnnouncement() {
    this.isLoadingDelete = true;
    this.deleteMessage = '';
    this.deleteError = '';

    this._announcementService.delete(this.deleteId).pipe(
      take(1),
      finalize(() => this.isLoadingDelete = false)
    ).subscribe({
      next: data => {
        this.deleteMessage = "Anunțul a fost șters cu succes";
        this.announcementList.next(this.announcementList.getValue().filter(a => a.id !== this.deleteId))
      },
      error: _ => {
        this.deleteError = 'S-a produs o eroare, te rugăm încearcă mai tărziu';
      }
    });
  }

  closeModal() {
    if (this.myModal) {
      this.modalRef?.close();
    }
  }
}
