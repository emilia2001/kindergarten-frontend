import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from 'jwt-decode';
import {loadStripe} from '@stripe/stripe-js';
import {BehaviorSubject} from 'rxjs';

import {IPayment} from '../../../shared/models/IPayment';
import {PaymentService} from '../../../services/payment/payment.service';
import {AccountService} from '../../../services/account/account.service';

@Component({
  selector: 'app-parent-payment-list',
  templateUrl: './parent-payment-list.component.html',
  styleUrls: ['./parent-payment-list.component.scss']
})
export class ParentPaymentListComponent implements OnInit {
  paymentList: BehaviorSubject<IPayment[]> = new BehaviorSubject<IPayment[]>([]);
  stripe: any;
  cardElement: any;
  token: any;
  @ViewChild('myModal') myModal: TemplateRef<any> | undefined;
  modalRef: NgbModalRef | undefined;
  isLoading: boolean = false;
  amount: string | undefined;
  paymentForm!: FormGroup;
  paymentId: number | undefined;
  isPaymentLoading: boolean = false;
  status: string | undefined;
  errors: string | undefined;
  currentMonthValue!: string;

  constructor(
    private _paymentService: PaymentService,
    private _accountService: AccountService,
    private modalService: NgbModal,
    private _currencyPipe: CurrencyPipe,
    private _formBuilder: FormBuilder
  ) {
    // @ts-ignore
    var id = jwt_decode(_accountService.getAuthenticatedToken())['id'];
    _paymentService.getAllForParent(id).subscribe(data => {
      this.paymentList.next(data)
      console.log(data);
    });
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    this.currentMonthValue = `${year}-${(month + 1).toString().padStart(2, '0')}`;
  }

  async ngOnInit() {
    try {
      const stripe = await loadStripe('pk_test_51N2F4DBquZgmE3312AAertRvkn91xBCUN6Jg2Nha5wsunOT2CET679CcW2aATgsIrn48FcNF65fC9Ya1djITVNHz00CYrgENaA');
      this.stripe = stripe;
      console.log(this.stripe);
    } catch (error) {
      console.error('Failed to load Stripe:', error);
    }

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

  charge(amount: number, token: string) {
    this._paymentService.charge(amount, token, 1);
  }

  openModal(template: TemplateRef<any>, totalAmount: number, id: number | undefined) {
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
      setTimeout(async () => {
        if (this.stripe) {
          // this.isLoading = false;
          const elements = this.stripe.elements();
          this.cardElement = elements.create('card');
          this.cardElement.mount('#card-element');
        }
      }, 0);
    }
  }

  async handleSubmit() {
    this.isPaymentLoading = true;
    const {token, error} = await this.stripe.createToken(this.cardElement);
    if (error) {
      // Inform the customer that there was an error.
      const errorElement = document.getElementById('card-errors');
      errorElement!.textContent = error.message;
    } else {
      // Send the token to your server.
      console.log(this.amount?.split(' ')[1])
      console.log(token)
      this._paymentService.charge(parseInt(this.amount?.split(' ')[1]!), token.id, this.paymentId!).subscribe({
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

}
