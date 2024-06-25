import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreditCardMaskPipe } from 'src/app/pipes/credit-card.pipe';
import { ExpiryDatePipe } from 'src/app/pipes/expiry-date.pipe';
import { style } from '@angular/animations';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CreditCardMaskPipe,
  ],
  providers: [ExpiryDatePipe],
})
export class PaymentPage implements OnInit {
  @ViewChild('paypalButtons', { static: true }) paymentRef!: ElementRef;
  userDetails$ = this.stateManagerService.userDetails$;
  displayedValue = '';

  paymentForm = this.fb.group({
    amount: ['', Validators.required],
    name: ['', Validators.required],
    number: ['', Validators.required],
    expiryDate: ['', Validators.required],
    cvv: ['', Validators.required],
  });
  constructor(
    private readonly fb: FormBuilder,
    private readonly expiryDatePipe: ExpiryDatePipe,
    private readonly stateManagerService: StateManagerService,
    private readonly alertController: AlertController
  ) {}

  ngOnInit() {
    this.userDetails$.subscribe((userDetails) => {
      window.paypal
        .Buttons({
          style: {
            layout: 'horizontal',
            color: 'white',
            shape: 'rect',
            label: 'paypal',
            tagline: false
          },
          createOrder: (data: any, actions: any) => {
            if (!this.paymentForm.get('amount')?.value) {
              return;
            }
            return actions.order.create({
              // payer: {
              //   birth_date: '2021-01-01',
              //   email_address: userDetails.email,
              //   phone: {
              //     phone_number: {
              //       national_number: '4543433243',
              //     },
              //   },
              //   name: {
              //     given_name: 'PayPal',
              //     surname: 'Customer',
              //   },
              //   address: {
              //     address_line_1: '123 ABC Street',
              //     address_line_2: 'Apt 2',
              //     admin_area_2: 'San Jose',
              //     admin_area_1: 'CA',
              //     postal_code: '95121',
              //     country_code: 'US',
              //   },
              // },
              purchase_units: [
                {
                  amount: {
                    value: (
                      parseInt(this.paymentForm.get('amount')?.value || '0') / 5
                    ).toString(),
                    currency_code: 'USD',
                  },
                },
              ],
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              if(details.status === "COMPLETED") {
                this.showSuccessModal(details.id);
              }
            });
          },
          onError: (error: any) => {
            console.log(error);
          },
        })
        .render(this.paymentRef.nativeElement);
    });
    this.paymentForm.get('expiryDate')?.valueChanges.subscribe((value) => {
      // Store the raw value in the form control
      if (value) {
        this.displayedValue = this.expiryDatePipe.transform(value);
      }
    });
  }

  onInput(event: any): void {
    const input = event.target.value;
    // Remove all non-digit characters
    const rawValue = input.replace(/\D/g, '');
    // Update the form control value directly
    this.paymentForm.get('expiryDate')?.setValue(rawValue, { emitEvent: true });
  }

  showSuccessModal(transactionId: string) {
    this.alertController
      .create({
        header: 'Tranzactie Reusita',
        message: 'Tranzactia cu numarul ' + transactionId + ' s-a efectuat cu success',
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }
}
