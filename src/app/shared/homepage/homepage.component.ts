import {Component, OnInit} from '@angular/core';

import {TeacherService} from "../../services/teacher/teacher.service";
import {ITeacher} from "../models/ITeacher";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {StyleDictionary, TDocumentDefinitions} from "pdfmake/interfaces";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  teacherList!: ITeacher[];
  carouselConfig: any = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000
  };


  title = 'ngSlick';


  slides = [342, 453, 846, 855, 234, 564, 744, 243];

  slideConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "dots": false,
    "infinite": false,
    "responsive": [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  slickInit(e: any) {
    console.log('slick initialized');
  }

  breakpoint(e: any) {
    console.log('breakpoint');
  }

  afterChange(e: any) {
    console.log('afterChange');
  }

  beforeChange(e: any) {
    console.log('beforeChange');
  }


  constructor(
    private _teacherService: TeacherService
  ) {
  }

  ngOnInit(): void {
    this._teacherService.getAll().subscribe(data => this.teacherList = data);
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

  }

  generatePDF() {
    // Define your table data
    const tableData = [
      [{ text: 'Unitate', bold: true }, 'Gradinita cu Program Prelungit "Dumbrava Minunata" Falticeni'],
      [{ text: 'Cod fiscal (C.I.F)', bold: true }, '18260453'],
      [{ text: 'Sediul', bold: true }, 'str. Tarancutei, nr. 19, Falticeni'],
      [{ text: 'Judetul', bold: true }, 'Suceava'],
    ];

    // Create the document definition
    const documentDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Chitanta', style: 'title' }, // Add the title
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*'], // Set column width for the first column as auto to fit the content
            body: tableData,
          },
          layout: {
            defaultBorder: false, // Set the default border to false
          },
        },
        { text: 'Data: ' + new Date().toLocaleDateString(), alignment: 'left', marginTop: 10, marginBottom: 10},
        { text: 'Am primit de la : ' + "Boamba Emilia" + "suma de " + 100 + " RON reprezentand" + "19 zile plata pentru" + "Boamba Emilia"},
      ],
      styles: {
        title: {
          fontSize: 18,
          bold: true,
          marginBottom: 10,
        },
      },
    };

    // Generate the PDF
    pdfMake.createPdf(documentDefinition).open();
  }

}
