import {Component, Input, OnInit} from '@angular/core';

import {IRegistrationRequest} from "../../models/IRequest";

@Component({
  selector: 'app-registration-request',
  templateUrl: './registration-request.component.html',
  styleUrls: ['./registration-request.component.scss']
})
export class RegistrationRequestComponent implements OnInit {
  @Input() request!: IRegistrationRequest;
  @Input() isLoading!: boolean;
  currentPdf!: string;

  ngOnInit(): void {
    this.currentPdf = this.request.applicationForm
  }
}
