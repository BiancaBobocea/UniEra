import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreditCardMaskPipe } from 'src/app/pipes/credit-card.pipe';
import { ExpiryDatePipe } from 'src/app/pipes/expiry-date.pipe';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, CreditCardMaskPipe],
  providers: [ExpiryDatePipe]
})
export class PaymentPage implements OnInit {
  
  displayedValue = '';

  paymentForm = this.fb.group({
    amount: ['', Validators.required],
    name: ['', Validators.required],
    number: ['', Validators.required],
    expiryDate: ['', Validators.required],
    cvv: ['', Validators.required],
  })
  constructor(private readonly fb: FormBuilder, private readonly expiryDatePipe: ExpiryDatePipe) { }

  ngOnInit() {
    this.paymentForm.get('expiryDate')?.valueChanges.subscribe(value => {
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

}
