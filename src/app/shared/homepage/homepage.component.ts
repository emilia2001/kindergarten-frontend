import {Component, OnInit} from '@angular/core';

import {TeacherService} from "../../services/teacher/teacher.service";
import {ITeacher} from "../models/ITeacher";

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

  constructor(
    private _teacherService: TeacherService
  ) {
  }

  ngOnInit(): void {
    this._teacherService.getAll().subscribe(data => this.teacherList = data);
  }

  computeAge(birthDate: Date): number {
    birthDate = new Date(birthDate)
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
