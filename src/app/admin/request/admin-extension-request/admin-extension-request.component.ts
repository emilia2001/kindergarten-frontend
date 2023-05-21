import {Component, Input, OnInit} from '@angular/core';

import {IExtensionRequest} from "../../../shared/models/IRequest";

@Component({
  selector: 'app-admin-extension-request',
  templateUrl: './admin-extension-request.component.html',
  styleUrls: ['./admin-extension-request.component.scss']
})
export class AdminExtensionRequestComponent implements OnInit{
  @Input() request!: IExtensionRequest;
  @Input() isLoading!: boolean;
  currentPdf!: string;

  ngOnInit(): void {
    this.currentPdf = this.request.applicationForm
  }
}
