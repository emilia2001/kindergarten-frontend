import {Component, Input, OnInit} from '@angular/core';

import {FirebaseService} from "../../services/firebase/firebase.service";

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {
  @Input() pdfSrc!: string;

  constructor(
    private _firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {}

  downloadPdf() {
    const link = document.createElement('a');
    link.href = this.pdfSrc;
    link.target = 'blank';
    link.download = 'document.pdf';
    link.dispatchEvent(new MouseEvent('click'));
  }


}
