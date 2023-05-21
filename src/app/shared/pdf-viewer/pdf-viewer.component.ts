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
  ) {
  }

  downloadPdf() {
    // Create an anchor element and set its href attribute to the PDF URL
    const link = document.createElement('a');
    link.href = this.pdfSrc;
    link.target = 'blank';

    // Set the download attribute to the desired filename for the downloaded PDF
    link.download = 'document.pdf';

    // Programmatically trigger the click event of the anchor element to initiate the download
    link.dispatchEvent(new MouseEvent('click'));
  }

  ngOnInit(): void {
    console.log(this.pdfSrc)

  }
}
