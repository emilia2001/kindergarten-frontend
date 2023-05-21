import {Component, Input, OnInit} from '@angular/core';

import {IRegistrationRequest} from "../../../shared/models/IRequest";

@Component({
  selector: 'app-admin-registration-request',
  templateUrl: './admin-registration-request.component.html',
  styleUrls: ['./admin-registration-request.component.scss']
})
export class AdminRegistrationRequestComponent implements OnInit {
  @Input() request!: IRegistrationRequest;
  @Input() isLoading!: boolean;
  currentPdf!: string;

  ngOnInit(): void {
    this.currentPdf = this.request.applicationForm
  }
}
