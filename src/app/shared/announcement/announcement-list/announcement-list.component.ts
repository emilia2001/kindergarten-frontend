import {Component, TemplateRef, ViewChild} from '@angular/core';

import {BehaviorSubject, finalize, take} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

import {AccountService} from "../../../services/account/account.service";
import {IAnnouncement} from "../../models/IAnnouncement";
import {AnnouncementService} from "../../../services/announcement/announcement.service";
import {IGroup} from "../../models/IGroup";

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
  currentPage: number = 1;
  pageSize: number = 2;
  totalItems: number = 0;
  totalPages: number = 0;
  paginatedAnnouncementsList: any[] = [];

  constructor(
    private _accountService: AccountService,
    private _announcementService: AnnouncementService,
    public modalService: NgbModal
  ) {
    this.isAdminLoggedIn = _accountService.getIsAdminLoggedIn()
    _announcementService.getAll().subscribe(data => {
      this.announcementList.next(data);
      this.updatePagination();
    });
  }

  encodeAnnouncement(announcement: IAnnouncement): string {
    return JSON.stringify(announcement);
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
        this.updatePagination();
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

  updatePagination() {
    this.currentPage = 1;
    this.totalItems = this.announcementList.getValue().length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.paginatedAnnouncementsList = this.applyPagination(this.announcementList.getValue());

  }

  applyPagination(list: any[]): IAnnouncement[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return list.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginatedAnnouncementsList = this.applyPagination(this.announcementList.getValue());
    }
  }
}
