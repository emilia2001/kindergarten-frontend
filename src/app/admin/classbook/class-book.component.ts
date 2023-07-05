import {Component, ElementRef, ViewChild} from '@angular/core';

import {BehaviorSubject, finalize, take} from "rxjs";
import {defineLocale, roLocale} from "ngx-bootstrap/chronos";
import {BsLocaleService} from "ngx-bootstrap/datepicker";

import {ChildrenService} from "../../services/children/children.service";
import {IChild} from "../../shared/models/IChild";
import {GroupService} from "../../services/group/group.service";
import {IGroup} from "../../shared/models/IGroup";
import {IAttendance} from "../../shared/models/IAttendance";
import {AttendanceService} from "../../services/attendance/attendance.service";

@Component({
  selector: 'app-classbook',
  templateUrl: './class-book.component.html',
  styleUrls: ['./class-book.component.scss']
})
export class ClassBookComponent {
  @ViewChild('successAlert') successAlertRef!: ElementRef;
  currentDate: Date;
  currentMonth: BehaviorSubject<string> = new BehaviorSubject<string>('');
  daysInMonth: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  weekendDays: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  allChildrenList: IChild[] = [];
  childrenList: BehaviorSubject<IChild[]> = new BehaviorSubject<IChild[]>([]);
  groupList: IGroup[] = [];
  attendanceList: BehaviorSubject<IAttendance[]> = new BehaviorSubject<IAttendance[]>([]);
  currentAttendances: IAttendance[] = [];
  totalAttendanceChild: BehaviorSubject<Map<string, number>> = new BehaviorSubject<Map<string, number>>(new Map<string, number>());
  currentMonthValue!: string;
  showSuccessAlert: any;
  showErrorAlert: any;
  sortKey: string = '';
  sortAsc: boolean = true;
  isLoading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 4;
  totalItems: number = 0;
  totalPages: number = 0;
  currentGroup: number = -1;
  paginatedChildrenList: any[] = [];

  constructor(
    private _childrenService: ChildrenService,
    private _groupService: GroupService,
    private _attendanceService: AttendanceService,
    private _localeService: BsLocaleService
  ) {

    this.currentDate = new Date();
    this.currentMonth.subscribe(month => this.currentMonthValue = month)
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.currentMonth.next(`${year}-${(month + 1).toString().padStart(2, '0')}`);

    _groupService.getAll().subscribe(data => this.groupList = data);
    _childrenService.getAll().subscribe(data => {
      this.allChildrenList = data;
      this.childrenList.next(data);
      this.updatePagination();
    });
    this.getAttendanceListForMonth(this.currentMonth.getValue());

    this.initializeDays(year, month);
    this.showSuccessAlert = false;
    this.showErrorAlert = false;

    defineLocale('ro', roLocale);
    this._localeService.use('ro');
  }

  initializeDays(year: number, month: number) {
    this.weekendDays.next([]);
    this.daysInMonth.next([]);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }

    dates.forEach(date => {
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        this.weekendDays.getValue().push(date.getDate());
      }
      this.daysInMonth?.getValue().push(date.getDate())
    });

  }

  getAttendanceListForMonth(month: string) {
    this.totalAttendanceChild.next(new Map<string, number>());
    this._attendanceService.getAllForMonth(month).subscribe(data => {
      this.attendanceList.next(data);
      this.attendanceList.getValue().forEach(attendance => {
        const cnp = attendance.childCnp;
        if (this.totalAttendanceChild.getValue().has(cnp)) {
          const oldAttendances = this.totalAttendanceChild.getValue().get(cnp)!;
          this.totalAttendanceChild.getValue().set(cnp, oldAttendances + 1);
        } else {
          this.totalAttendanceChild.getValue().set(cnp, 1);
        }
      })
    });
  }

  getAttendanceForChildAndDate(childCnp: string, day: number): boolean {
    let newDate = new Date(this.currentDate);
    newDate.setDate(day);
    newDate.setMonth(Number.parseInt(this.currentMonthValue.split('-')[1]) - 1);
    return this.attendanceList.getValue().filter(attendance => attendance.childCnp == childCnp && attendance.date == this.formatDate(newDate)).length !== 0;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // add leading zero for months < 10
    const day = ('0' + date.getDate()).slice(-2); // add leading zero for days < 10
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  handleAttendanceCheckboxChange(event: any, childCnp: string, day: number) {
    const monthStringArray = this.currentMonthValue.split('-');
    let newDate = new Date(this.currentDate);
    newDate.setDate(day);
    newDate.setMonth(Number.parseInt(monthStringArray[1]) - 1)
    let attendance: IAttendance = {childCnp, date: this.formatDate(newDate)};
    if (event.target.checked) {
      this.currentAttendances.push(attendance);
      const oldAttendances = this.totalAttendanceChild.getValue().get(childCnp)!;
      if(oldAttendances)
        this.totalAttendanceChild.getValue().set(childCnp, oldAttendances + 1);
      else
        this.totalAttendanceChild.getValue().set(childCnp, 1);
    } else {
      const oldAttendances = this.totalAttendanceChild.getValue().get(childCnp)!;
      this.totalAttendanceChild.getValue().set(childCnp, oldAttendances - 1);
      this.currentAttendances = this.currentAttendances.filter(attendance => attendance.childCnp != childCnp);
    }
  }

  handleSaveAttendances() {
    this.isLoading = true;
    if (this.currentAttendances.length > 0) {
      this._attendanceService.saveAll(this.currentAttendances).pipe(
        take(1),
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: _ => {
          const previousAttendances = this.attendanceList.getValue(); // Get the previous value
          const updatedAttendances = [...previousAttendances, ...this.currentAttendances]; // Combine previous and current attendances
          this.attendanceList.next(updatedAttendances); // Update attendanceList with the updated array
          this.showSuccessAlert = true;
          this.currentAttendances = [];
          setTimeout(() => this.scrollToSuccessAlert(), 0);
        },
        error: _ => this.showErrorAlert = true
      })
    }
  }

  handleMonthChange($event: any) {
    const monthStringArray = $event.target.value.split('-');
    this.currentMonth.next($event.target.value)
    this.initializeDays(Number.parseInt(monthStringArray[0]), Number.parseInt(monthStringArray[1]) - 1);
    this.getAttendanceListForMonth(this.currentMonth.getValue());
  }

  handleGroupChange($event: any) {
    this.currentPage = 1;
    this.currentGroup = $event.target.value;
    if ($event.target.value == -1)
      this.childrenList.next(this.allChildrenList);
    else
      this.childrenList.next(this.allChildrenList.filter(child => child.group.id == $event.target.value));
    this.updatePagination();
  }

  closeSuccessAlert() {
    this.showSuccessAlert = false;
  }

  closeErrorAlert() {
    this.showErrorAlert = false;
  }

  getCurrentMonthMax() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    return `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  }

  scrollToSuccessAlert() {
    if (this.successAlertRef && this.successAlertRef.nativeElement) {
      this.successAlertRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.successAlertRef.nativeElement.focus();
    }
  }

  getCurrentMonthRomanian(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthName = new Intl.DateTimeFormat('ro-RO', { month: 'long' }).format(currentDate);
    return `${year}-${month.toString().padStart(2, '0')} (${monthName})`;
  }

  updatePagination() {
    this.currentPage = 1;

    let filteredChildrenList;

    if (this.currentGroup == -1)
      filteredChildrenList = this.allChildrenList;
    else
      filteredChildrenList = this.allChildrenList.filter(child => child.group.id ==this.currentGroup);

    if (this.sortAsc) {
      filteredChildrenList.sort((a, b) => {
        if (a.lastName > b.lastName)
          return 1;
        if (a.lastName == b.lastName)
          return a.firstName > b.firstName ? 1 : -1;
        return -1;
      })
    } else {
      filteredChildrenList.sort((a, b) => {
        if (a.lastName < b.lastName)
          return 1;
        if (a.lastName == b.lastName)
          return a.firstName < b.firstName ? 1 : -1;
        return -1;
      })
    }

    this.totalItems = filteredChildrenList.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.paginatedChildrenList = this.applyPagination(filteredChildrenList);

  }

  applyPagination(list: any[]): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return list.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginatedChildrenList = this.applyPagination(this.childrenList.getValue());
    }
  }

  checkTodayAttendance(cnp: any, day: number) {
    let newDate = new Date(this.currentDate);
    newDate.setDate(day);
    return this.currentAttendances.filter(attendance => attendance.childCnp == cnp && attendance.date == this.formatDate(newDate)).length !== 0
  }
}
