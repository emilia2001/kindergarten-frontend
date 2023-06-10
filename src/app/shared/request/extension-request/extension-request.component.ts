import {Component, Input, OnInit} from '@angular/core';

import {IExtensionRequest} from "../../models/IRequest";

@Component({
  selector: 'app-extension-request',
  templateUrl: './extension-request.component.html',
  styleUrls: ['./extension-request.component.scss']
})
export class ExtensionRequestComponent implements OnInit{
  @Input() request!: IExtensionRequest;
  @Input() isLoading!: boolean;
  currentPdf!: string;

  ngOnInit(): void {
    this.currentPdf = this.request.applicationForm
  }
}
