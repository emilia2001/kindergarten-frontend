import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CurrencyPipe} from "@angular/common";

import {BehaviorSubject, finalize, take} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as pdfMake from "pdfmake/build/pdfmake";

import {IGroup} from "../../shared/models/IGroup";
import {GroupService} from "../../services/group/group.service";
import {PaymentService} from "../../services/payment/payment.service";
import {EPaymentStatus, IPayment} from "../../shared/models/IPayment";
import {ConfirmationModalComponent} from "../../shared/modals/confirmation-modal/confirmation-modal.component";
import {IChild} from "../../shared/models/IChild";
import {IPaymentConfirmation} from "../../shared/models/IPaymentConfirmation";
import jwt_decode from "jwt-decode";
import {PaymentConfirmationService} from "../../services/payment-confirmation/payment-confirmation.service";
import {FirebaseService} from "../../services/firebase/firebase.service";
import {TDocumentDefinitions} from "pdfmake/interfaces";
import {FileUpload} from "../../shared/models/FileUpload";


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
  paymentConfirmationList: BehaviorSubject<IPaymentConfirmation[]> = new BehaviorSubject<IPaymentConfirmation[]>([]);
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
  currentChild: IChild | undefined;
  showSuccessAlert: any;
  showErrorAlert: any;
  @ViewChild('successAlert') successAlertRef!: ElementRef;
  @ViewChild('errorAlert') errorAlertRef!: ElementRef;
  isMailLoading: boolean = false;

  constructor(
    private _groupService: GroupService,
    private _paymentService: PaymentService,
    public modalService: NgbModal,
    private _confirmationModal: ConfirmationModalComponent,
    private _formBuilder: FormBuilder,
    private _currencyPipe: CurrencyPipe,
    private _paymentConfirmationService: PaymentConfirmationService,
    private _firebaseService: FirebaseService
  ) {
    const currentDate = new Date();
    this.currentMonth.subscribe(month => this.currentMonthValue = month)
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    this.currentMonth.next(`${year}-${(month + 1).toString().padStart(2, '0')}`);
    this.currentMonth.subscribe(data => this.getPaymentListForMonth(data));
    _groupService.getAll().subscribe(data => this.groupList = data);
    this.getPaymentListForMonth(this.currentMonth.getValue());    // @ts-ignore
    this._paymentConfirmationService.getAll().subscribe(data => {
      this.paymentConfirmationList.next(data);
    });
    this.currentDate = new Date();
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit(): void {
    this.paymentForm = this._formBuilder.group({
        amountInput: ["", Validators.required],
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
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
    // if ($event.target.value == -1)
    //   this.childrenList.next(this.allChildrenList);
    // else
    //   this.childrenList.next(this.allChildrenList.filter(child => child.group.id == $event.target.value));
    // this.paymentList.next(this.allChildrenList.filter(child => child.group.id == $event.target.value));
  }

  getPaymentListForMonth(month: string) {
    this._paymentService.getAllForMonth(month).subscribe(data => this.paymentList.next(data));
  }

  openModal(myModal: TemplateRef<any>, totalAmount: number, id: number | undefined, child: IChild) {
    this.currentChild = child;
    this.amount = totalAmount.toString();
    this.paymentId = id;
    console.log(this.currentChild)

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
        this.paymentList.next(newList);
        this.isPaymentLoading = false;
        this.status = 'success';
        this.generatePDF();
      },
      error: errors => {
        this.isPaymentLoading = false;
        this.errors = errors.error.status
      }
    });
  }


  generatePDF() {
    let id: number;
    this._paymentConfirmationService.getNextId().subscribe(data => {
      id = data.id;
      var firstName = this.paymentForm.value.firstName;
      var lastName = this.paymentForm.value.lastName;
      console.log(firstName, lastName)
      console.log(this.currentChild)
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
          {text: 'Plata efectuata la sediul gradinitei ', bold: true, marginTop: 10}
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

  upload(file: File, id: number): void {
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

  getConfirmationForPayment(id: number) {
    return this.paymentConfirmationList.getValue().filter(confirmation => confirmation.paymentId == id);
  }

  sendPaymentsEmail() {
    this.isMailLoading = true;
    this._paymentService.sendEmail().pipe(
      take(1),
      finalize(() => this.isMailLoading = false) // Set loading state to false regardless of success or error
    ).subscribe({
      next: (_) => {
        this.showSuccessAlert = true;
        setTimeout(() => this.scrollToSuccessAlert(), 0);
      },
      error: (_) => {
        this.showErrorAlert = true;
        setTimeout(() => this.scrollToErrorAlert(), 0);
      }
    });
  }

  closeModal() {
    if (this.myModal) {
      this.modalRef?.close();
    }
  }

  closeSuccessAlert() {
    this.showSuccessAlert = false;
  }

  closeErrorAlert() {
    this.showErrorAlert = false;
  }

  scrollToSuccessAlert() {
    console.log(this.successAlertRef)
    if (this.successAlertRef && this.successAlertRef.nativeElement) {
      this.successAlertRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.successAlertRef.nativeElement.focus();
    }
  }

  scrollToErrorAlert() {
    if (this.errorAlertRef && this.errorAlertRef.nativeElement) {
      this.errorAlertRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      // or use this.successAlertRef.nativeElement.focus();
    }
  }
}
