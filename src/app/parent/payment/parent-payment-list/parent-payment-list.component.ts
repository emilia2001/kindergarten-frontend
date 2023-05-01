import {Component, OnInit} from '@angular/core';
import {IPayment} from "../../../shared/models/IPayment";
import {async, BehaviorSubject} from "rxjs";
import {PaymentService} from "../../../services/payment/payment.service";
import { Stripe } from 'stripe';
import jwt_decode from "jwt-decode";
import {AccountService} from "../../../services/account/account.service";
import {payment} from "../../../shared/utils/endpoints";
import {loadStripe} from "@stripe/stripe-js";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-parent-payment-list',
  templateUrl: './parent-payment-list.component.html',
  styleUrls: ['./parent-payment-list.component.scss']
})
export class ParentPaymentListComponent {
  paymentList: BehaviorSubject<IPayment[]> = new BehaviorSubject<IPayment[]>([]);
  stripe: any;
  cardElement: any;

  showModal = false;
  modalData: any;
  paymentHandler: any;

  token: any;

  constructor(
    private _paymentService: PaymentService,
    private _accountService: AccountService,
    private modalService: NgbModal
  ) {
    // @ts-ignore
    var id = jwt_decode(_accountService.getAuthenticatedToken())['id'];
    console.log(id)
    _paymentService.getAllForParent(id).subscribe(data => {
      this.paymentList.next(data)
      console.log(data);
    });
    this.invokeStripe();
  }

  // makePayment(amount: number) {
  //   const paymentHandler = (<any>window).StripeCheckout.configure({
  //     key: 'pk_test_51N2F4DBquZgmE3312AAertRvkn91xBCUN6Jg2Nha5wsunOT2CET679CcW2aATgsIrn48FcNF65fC9Ya1djITVNHz00CYrgENaA',
  //     locale: 'auto',
  //     token: function (stripeToken: any) {
  //       console.log(stripeToken);
  //       alert('Stripe token generated!');
  //     },
  //   });
  //   paymentHandler.open({
  //     name: '',
  //     description: '',
  //     amount: amount * 100,
  //   });
  // }

  // async ngOnInit() {
  //   const stripe = await loadStripe('pk_test_51N2F4DBquZgmE3312AAertRvkn91xBCUN6Jg2Nha5wsunOT2CET679CcW2aATgsIrn48FcNF65fC9Ya1djITVNHz00CYrgENaA');
  //   // @ts-ignore
  //   const elements = stripe.elements();
  //   const cardElement = elements.create('card');
  //   cardElement.mount('#card-element');
  //   this.stripe = stripe;
  //   this.cardElement = cardElement;
  // }

  makePayment(amount: number) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51N2F4DBquZgmE3312AAertRvkn91xBCUN6Jg2Nha5wsunOT2CET679CcW2aATgsIrn48FcNF65fC9Ya1djITVNHz00CYrgENaA',
      locale: 'auto',
      token: this.setToken(() => function (stripeToken: any) {
        return stripeToken;
        console.log(stripeToken);
      })
    });
    paymentHandler.open({
      name: '',
      description: '',
      amount: amount * 100,
    });
  }

  setToken(token: any) {
    console.log(token);
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51N2F4DBquZgmE3312AAertRvkn91xBCUN6Jg2Nha5wsunOT2CET679CcW2aATgsIrn48FcNF65fC9Ya1djITVNHz00CYrgENaA',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            // alert('Payment has been successfull!');
          }
        });
      };

      window.document.body.appendChild(script);
    }
  }

  charge(amount: number, token: string) {
    this._paymentService.charge(amount, token, 1);
  }

  // async handleSubmit() {
  //   const { token, error } = await this.stripe.createToken(this.cardElement);
  //   if (error) {
  //     console.error(error);
  //     return;
  //   }
  //   console.log(token);
  //   // Use token.id to submit the payment to your server
  // }
  //
  // openModal(content: any) {
  //   this.modalService.open(content);
  // }

}
