import {Component, OnInit} from '@angular/core';
import {loadStripe} from "@stripe/stripe-js";
import {PaymentService} from "../../../services/payment/payment.service";

@Component({
  selector: 'app-submitted-requests-list',
  templateUrl: './submitted-requests-list.component.html',
  styleUrls: ['./submitted-requests-list.component.scss']
})
export class SubmittedRequestsListComponent implements OnInit {
  paymentHandler: any = null;
  stripeAPIKey: any = 'pk_test_51N2F4DBquZgmE3312AAertRvkn91xBCUN6Jg2Nha5wsunOT2CET679CcW2aATgsIrn48FcNF65fC9Ya1djITVNHz00CYrgENaA';
  stripe: any;
  private cardElement: any;

  constructor(
    private _paymentService: PaymentService) {

  }

  async ngOnInit() {
    const style = {
      base: {
        // Add your base input styles here. For example:
        fontSize: '16px',
        color: '#32325d',
      },
    };
    const stripe = await loadStripe('pk_test_51N2F4DBquZgmE3312AAertRvkn91xBCUN6Jg2Nha5wsunOT2CET679CcW2aATgsIrn48FcNF65fC9Ya1djITVNHz00CYrgENaA');
    // @ts-ignore
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');
    this.stripe = stripe;
    this.cardElement = cardElement;
  }

  async handleSubmit() {

    const {token, error} = await this.stripe.createToken(this.cardElement);


    if (error) {
      // Inform the customer that there was an error.
      const errorElement = document.getElementById('card-errors');
      errorElement!.textContent = error.message;
    } else {
      // Send the token to your server.
      this.stripeTokenHandler(token);
    }
  }

  stripeTokenHandler (token: any) {
    // Insert the token ID into the form so it gets submitted to the server
    // const form = document.getElementById('payment-form');
    // const hiddenInput = document.createElement('input');
    // hiddenInput.setAttribute('type', 'hidden');
    // hiddenInput.setAttribute('name', 'stripeToken');
    // hiddenInput.setAttribute('value', token.id);
    // form!.appendChild(hiddenInput);

    // Submit the form
    // this.handleSubmit();

    console.log(token);
    this._paymentService.charge(20, token.id, 1).subscribe({
      next: data => {
        console.log(data)
      },
      error: errors => console.log(errors.error)
    });
  }

}
