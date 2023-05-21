import {Component, ElementRef, Input, TemplateRef, ViewEncapsulation} from '@angular/core';
import {ModalService} from "../../../services/modal/modal.service";
import {PaymentService} from "../../../services/payment/payment.service";
import {loadStripe} from "@stripe/stripe-js";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PaymentModalComponent {
  modalRef!: BsModalRef;

  constructor(private modalService: BsModalService) { }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

}
