import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from 'jwt-decode';
import {loadStripe} from '@stripe/stripe-js';
import {BehaviorSubject} from 'rxjs';
import {TDocumentDefinitions} from "pdfmake/interfaces";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import {IPayment} from '../../../shared/models/IPayment';
import {PaymentService} from '../../../services/payment/payment.service';
import {AccountService} from '../../../services/account/account.service';
import {PaymentConfirmationService} from "../../../services/payment-confirmation/payment-confirmation.service";
import {IChild} from "../../../shared/models/IChild";
import {FirebaseService} from "../../../services/firebase/firebase.service";
import {FileUpload} from "../../../shared/models/FileUpload";
import {IPaymentConfirmation} from "../../../shared/models/IPaymentConfirmation";

@Component({
  selector: 'app-parent-payment-list',
  templateUrl: './parent-payment-list.component.html',
  styleUrls: ['./parent-payment-list.component.scss']
})
export class ParentPaymentListComponent implements OnInit {
  paymentList: BehaviorSubject<IPayment[]> = new BehaviorSubject<IPayment[]>([]);
  paymentConfirmationList: BehaviorSubject<IPaymentConfirmation[]> = new BehaviorSubject<IPaymentConfirmation[]>([]);
  stripe: any;
  cardElement: any;
  token: any;
  @ViewChild('myModal') myModal: TemplateRef<any> | undefined;
  modalRef: NgbModalRef | undefined;
  isLoading: boolean = false;
  amount: string | undefined;
  currentAmount: string | undefined;
  paymentForm!: FormGroup;
  paymentId: number | undefined;
  isPaymentLoading: boolean = false;
  status: string | undefined;
  errors: string | undefined;
  currentMonthValue!: string;
  currentChild: IChild | undefined;

  constructor(
    private _paymentService: PaymentService,
    private _accountService: AccountService,
    private modalService: NgbModal,
    private _currencyPipe: CurrencyPipe,
    private _formBuilder: FormBuilder,
    private _paymentConfirmationService: PaymentConfirmationService,
    private _firebaseService: FirebaseService
  ) {
    // @ts-ignore
    var id = jwt_decode(_accountService.getAuthenticatedToken())['id'];
    _paymentService.getAllForParent(id).subscribe(data => {
      this.paymentList.next(data)
    });
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    this.currentMonthValue = `${year}-${(month + 1).toString().padStart(2, '0')}`;
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  }

  async ngOnInit() {
    try {
      const stripe = await loadStripe('pk_test_51N2F4DBquZgmE3312AAertRvkn91xBCUN6Jg2Nha5wsunOT2CET679CcW2aATgsIrn48FcNF65fC9Ya1djITVNHz00CYrgENaA');
      this.stripe = stripe;
    } catch (error) {
      console.error('Failed to load Stripe:', error);
    }

    this.paymentForm = this._formBuilder.group({
        amountInput: ["", [Validators.required, this.amountValidator()]]
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

    // @ts-ignore
    var id = jwt_decode(this._accountService.getAuthenticatedToken())['id'];
    this._paymentConfirmationService.getAllForParent(id).subscribe(data => {
      this.paymentConfirmationList.next(data);
    });
  }

  amountValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      console.log("pl")
      const amountInput = parseInt(control.value?.split(' ')[1]!);
      const amount = parseInt(this.currentAmount!);
      if (amountInput && amountInput > amount) {
        return {'amountExceeded': true};
      }
      return null;
    };
  }

  openModal(template: TemplateRef<any>, totalAmount: number, id: number | undefined, child: IChild) {
    this.currentChild = child;
    this.amount = totalAmount.toString();
    this.currentAmount = totalAmount.toString();
    this.paymentId = id;
    if (this.myModal) {
      this.modalRef = this.modalService.open(this.myModal);

      this.modalRef.result.then(
        () => {
          this.status = ''
          console.log('Modal closed');
        },
        () => {
          this.status = ''
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
    if (this.paymentForm.touched && this.paymentForm.valid) {
      this.isPaymentLoading = true;
      const {token, error} = await this.stripe.createToken(this.cardElement);
      console.log(token, error)
      this.errors = ''
      const errorElement = document.getElementById('card-errors');
      errorElement!.textContent = "";
      setTimeout(() => {
        if (error) {
          const errorElement = document.getElementById('card-errors');
          errorElement!.textContent = error.message;
          this.isPaymentLoading = false
        } else {
          this._paymentService.charge(parseInt(this.amount?.split(' ')[1]!), token.id, this.paymentId!).subscribe({
            next: data => {
              const newList = this.paymentList.value.map(request => {
                if (request.id === this.paymentId) {
                  return data.payment;
                }
                return request;
              });
              this.paymentList.next(newList);
              this.isPaymentLoading = false;
              this.status = 'success';
              this.generatePDF();
            },
            error: errors => {
              this.isPaymentLoading = false;
              this.errors = errors.error.status
              let error = errors.error.status;
              if (error == "Your card was declined.")
                this.errors = "Cardul a fost respins";
              if (error == "Your card has insufficient funds.")
                this.errors = "Fonduri insuficiente";
              if (error == "Lost card decline")
                this.errors = "Card pierdut";
              if (error == "Stolen card decline")
                this.errors = "Card furat";
              if (error == "Expired card decline")
                this.errors = "Card expirat";
              if (error == "Incorrect CVC decline")
                this.errors = "CVC incorect";
              if (error == "Processing error decline")
                this.errors = "Eroare procesare card";
              if (error == "Incorrect number decline")
                this.errors = "Număr card incorect";
            }
          });
        }
      }, 0);
    } else {
      this.errors = "Datele sunt invalide"
    }
  }

  generatePDF() {
    let id: number;
    this._paymentConfirmationService.getNextId().subscribe(data => {
      id = data.id;
      // @ts-ignore
      var firstName = jwt_decode(this._accountService.getAuthenticatedToken())['firstName'];
      // @ts-ignore
      var lastName = jwt_decode(this._accountService.getAuthenticatedToken())['lastName'];
      console.log(firstName, lastName)

      const tableData = [
        [{text: 'Unitate', bold: true}, 'Gradinita cu Program Prelungit "Dumbrava Minunata" Falticeni'],
        [{text: 'Cod fiscal (C.I.F)', bold: true}, '18260453'],
        [{text: 'Sediul', bold: true}, 'str. Tarancutei, nr. 19, Falticeni'],
        [{text: 'Judetul', bold: true}, 'Suceava'],
      ];

      const documentDefinition: TDocumentDefinitions = {
        content: [
          {text: 'Chitanta', style: 'title'},
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*'],
              body: tableData,
            },
            layout: {
              defaultBorder: false,
            },
          },
          {
            table: {
              widths: ['auto', '*'],
              body: [
                [
                  {text: 'Data: ', bold: true, style: 'columnHeader'},
                  {text: new Date().toLocaleDateString(), style: 'columnContent'},
                ],
                [
                  {text: 'Numar chitanta: ', bold: true, style: 'columnHeader'},
                  {text: id.toString(), style: 'columnContent'},
                ],
              ],
            },
            layout: {
              defaultBorder: false,
            },
            alignment: 'left',
            marginTop: 10,
            marginBottom: 10,
          },
          {
            text:
              'Am primit de la ' +
              lastName +
              ' ' +
              firstName +
              ' suma de ' +
              parseInt(this.amount?.split(' ')[1]!) +
              ' RON reprezentand contravaloare prezenta gradinita pentru ' +
              this.currentChild?.firstName +
              ' ' +
              this.currentChild?.lastName,
          },
          {text: 'Plata efectuata cu cardul ', bold: true, marginTop: 10}
        ],
        styles: {
          title: {
            fontSize: 18,
            bold: true,
            marginBottom: 10,
          },
          columnHeader: {
            bold: true,
            fillColor: '#fff',
          },
          columnContent: {
            fillColor: '#fff',
          },
        },
      };


      const pdfDocGenerator = pdfMake.createPdf(documentDefinition)
      pdfDocGenerator.getBlob((blob: Blob) => {
        const file = new File([blob], `confirmation${id}.pdf`, {type: 'application/pdf'});
        this.upload(file, id)
      });

    });

  }

  upload(file
           :
           File, id
           :
           number
  ):
    void {
    if (file) {
      const currentFileUpload = new FileUpload(file);

      this._firebaseService.pushFileToStorage(currentFileUpload, 'payment-confirmation').subscribe(
        (downloadURL: string) => {
          console.log('File is accessible:', downloadURL);
          const paymentConfirmation: IPaymentConfirmation = {
            id: id, path: downloadURL, paymentId: this.paymentId!
          }
          this._paymentConfirmationService.add(paymentConfirmation).subscribe({
              next: data => {
                const newList = this.paymentConfirmationList.getValue();
                newList.push(paymentConfirmation);
                this.paymentConfirmationList.next(newList);
              }, error: err => {
                console.log(err);
              }
            }
          );
        },
        (error) => {
          console.error('Error occurred during file upload:', error);
        }
      );
    }
  }

  getConfirmationForPayment(id
                              :
                              number
  ) {
    return this.paymentConfirmationList.getValue().filter(confirmation => confirmation.paymentId == id);
  }
}
