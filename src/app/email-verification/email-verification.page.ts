import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgxOtpInputModule]
})
export class EmailVerificationPage implements OnInit {
  otpInputConfig = {
    otpLength: 4,
    autoFocus: true,
    numericInputMode: true,
    classList: {
      input: 'otp-digit-input',
      inputFilled: '',
      inputDisabled: '',
      inputSuccess: '',
      inputError: '',
    }
  }
  constructor(private router: Router) { }

  ngOnInit() {}

  resendCode(){
    console.log('Resend code');
  }

  goToResetPassword(){
    this.router.navigate(['reset-password']);
  }
}
