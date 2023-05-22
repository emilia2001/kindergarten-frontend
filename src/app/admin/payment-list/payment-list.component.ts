import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CurrencyPipe} from "@angular/common";

import {BehaviorSubject} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

import {IGroup} from "../../shared/models/IGroup";
import {GroupService} from "../../services/group/group.service";
import {PaymentService} from "../../services/payment/payment.service";
import {EPaymentStatus, IPayment} from "../../shared/models/IPayment";
import {ConfirmationModalComponent} from "../../shared/modals/confirmation-modal/confirmation-modal.component";


@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  currentMonth: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentMonthValue!: string;
  groupList: IGroup[] = [];
  paymentList: BehaviorSubject<IPayment[]> = new BehaviorSubject<IPayment[]>([]);
  searchForm = new FormGroup({
    search: new FormControl('')
  });
  searchText: string = '';
  selectedGroupId: number = 0;
  @ViewChild('myModal') myModal: TemplateRef<any> | undefined;
  modalRef: NgbModalRef | undefined;
  isPaymentLoading: boolean = false;
  status: string | undefined;
  errors: string | undefined;
  amount: string | undefined;
  paymentId: number | undefined;
  paymentForm!: FormGroup;
  currentDate: Date;



  constructor(
    private _groupService: GroupService,
    private _paymentService: PaymentService,
    public modalService: NgbModal,
    private _confirmationModal: ConfirmationModalComponent,
    private _formBuilder: FormBuilder,
    private _currencyPipe: CurrencyPipe,
  ) {
    const currentDate = new Date();
    this.currentMonth.subscribe(month => this.currentMonthValue = month)
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    this.currentMonth.next(`${year}-${(month + 1).toString().padStart(2, '0')}`);
    this.currentMonth.subscribe(data => this.getPaymentListForMonth(data));
    _groupService.getAll().subscribe(data => this.groupList = data);
    this.getPaymentListForMonth(this.currentMonth.getValue());
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.paymentForm = this._formBuilder.group({
        amountInput: ["", Validators.required]
      }
    )

    this.paymentForm.valueChanges.subscribe((form) => {
      const amountInput = form.amountInput;
      if (typeof amountInput === 'string') {
        const cleanedInput = amountInput.replace(/\D/g, '').replace(/^0+/, '');
        const formattedValue = this._currencyPipe.transform(cleanedInput, ' RON ', 'symbol', '1.0-0');

        setTimeout(() => {
          this.paymentForm.patchValue({amountInput: formattedValue}, {emitEvent: false});
        });
      }
    });
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

  openModal(myModal: TemplateRef<any>, totalAmount: number, id: number | undefined) {
    this.amount = totalAmount.toString();
    this.paymentId = id;

    if (this.myModal) {
      this.modalRef = this.modalService.open(this.myModal);

      this.modalRef.result.then(
        () => {
          console.log('Modal closed');
        },
        () => {
          console.log('Modal dismissed');
        }
      );
      // this.isLoading = true;
      // setTimeout(async () => {
      //   if (this.stripe) {
      //     // this.isLoading = false;
      //     const elements = this.stripe.elements();
      //     this.cardElement = elements.create('card');
      //     this.cardElement.mount('#card-element');
      //   }
      // }, 0);
    }
  }

  handleSubmit() {
    this.isPaymentLoading = true;
    this._paymentService.chargeByAdmin(parseInt(this.amount?.split(' ')[1]!), this.paymentId!).subscribe({
      next: data => {
        const newList = this.paymentList.value.map(request => {
          if (request.id === this.paymentId) {
            return data.payment;
          }
          return request;
        });
        console.log(newList);
        this.paymentList.next(newList);
        this.isPaymentLoading = false;
        this.status = 'success';
      },
      error: errors => this.errors = errors
    });
  }
}

