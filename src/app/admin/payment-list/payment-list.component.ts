import {Component, ViewChild} from '@angular/core';

import {BehaviorSubject} from "rxjs";

import {IGroup} from "../../shared/models/IGroup";
import {GroupService} from "../../services/group/group.service";
import {PaymentService} from "../../services/payment/payment.service";
import {EPaymentStatus, IPayment} from "../../shared/models/IPayment";
import {FormControl, FormGroup} from "@angular/forms";
import {ConfirmationModalComponent} from "../../shared/modals/confirmation-modal/confirmation-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalService} from "../../services/modal/modal.service";


@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent {
  currentMonth: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentMonthValue!: string;
  groupList: IGroup[] = [];
  paymentList: BehaviorSubject<IPayment[]> = new BehaviorSubject<IPayment[]>([]);
  searchForm = new FormGroup({
    search: new FormControl('')
  });
  searchText: string = '';
  selectedGroupId: number = 0;
  modalId = 'confirmationModal';
  bodyText = 'This text can be updated in modal 1';


  @ViewChild(ConfirmationModalComponent) confirmationModal!: ConfirmationModalComponent;



  constructor(
    private _groupService: GroupService,
    private _paymentService: PaymentService,
    public modalService: ModalService,
    private _confirmationModal: ConfirmationModalComponent
  ) {
    const currentDate = new Date();
    this.currentMonth.subscribe(month => this.currentMonthValue = month)
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    this.currentMonth.next(`${year}-${(month + 1).toString().padStart(2, '0')}`);
    this.currentMonth.subscribe(data => this.getPaymentListForMonth(data));
    _groupService.getAll().subscribe(data => this.groupList = data);
    this.getPaymentListForMonth(this.currentMonth.getValue());
  }

  handleMonthChange($event: any) {
    this.currentMonth.next($event.target.value)
  }

  handleGroupChange($event: any) {
    this.selectedGroupId = $event.target.value;
    // this.paymentList.next(this.allChildrenList.filter(child => child.group.id == $event.target.value));
  }

  getPaymentListForMonth(month: string) {
    this._paymentService.getAllForMonth(month).subscribe(data => this.paymentList.next(data));
  }

  handleStatusChange(payment: IPayment) {
    // if (payment.status === EPaymentStatus.PAID) {
    //   return;
    // }
    // payment.status = EPaymentStatus.PAID;
    // const modalRef = this._modalService.open(ConfirmationModalComponent);
    // modalRef.componentInstance.modalId = 'paymentStatusConfirm';
    // modalRef.componentInstance.text = 'Are you sure you want to mark this payment as paid?';
    // modalRef.result.then(result => {
    //   if (result === 'yes') {
    //     // Change payment status to 'PAID'
    //     // this._paymentService.update(payment.id, PaymentStatus.PAID).subscribe(() => {
    //       // Reload payment list
    //       // this.loadPayments();
    //     // });
    //   }
    // }).catch(() => {
    //   // Modal dismissed
    // });
    // console.log(payment)

    //
    // const confirmation = await this.confirmationModal.open();
    // if (confirmation) {
    //   payment.status = payment.status === PaymentStatus.PAID ? PaymentStatus.UNPAID : PaymentStatus.PAID;
    //   this.paymentService.updatePayment(payment)
    //     .subscribe(
    //       () => console.log('Payment updated successfully'),
    //       (error) => console.log('Error updating payment', error)
    //     );
    // }

    payment.status = EPaymentStatus.PAID;
    console.log(payment)

    // const modalRef = this._modalService.open(ConfirmationModalComponent, { backdrop: 'static', keyboard: false });;
    // modalRef.result.then((result) => {
    //   if (result === 'yes') {
    //     console.log("yes");
    //     // payment.status = payment.status === 'paid' ? 'unpaid' : 'paid';
    //   }
    // }).catch((error) => {
    //   console.log('Modal dismissed with error: ', error);
    // });

    this.modalService.open('paymentConfirmationModal');
    // this._confirmationModal.open();

    // this._paymentService.update(payment.id, payment).subscribe(data => console.log(data));
    // console.log(this.paymentList);
  }
}

