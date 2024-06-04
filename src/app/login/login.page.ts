import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { UserDataService } from '../services/user-data/user-data.service';
import firebaseErrorCodes from '../shared/error-codes';
import { FirebaseError } from 'firebase/app';
import { addIcons } from 'ionicons';
import { lockClosedOutline, lockOpenOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;
  showErrorToase = false;
  toastErrorMessage = '';
  showPassword = false;
  constructor(private router: Router, private fb: FormBuilder, private loginService: LoginService, private userDataService: UserDataService) { 
    addIcons({lockOpenOutline, lockClosedOutline})
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [],
      password: [],
    })
  }

  goToForgotPasswordPage() {
    this.router.navigate(['forgot-password']);
  }

  login() {
    const email = this.loginForm.get('email')?.value;
    const password =  this.loginForm.get('password')?.value;
    this.loginService.loginUser(email, password).catch((error: FirebaseError) => {
      this.showErrorToase = true;
      this.toastErrorMessage = firebaseErrorCodes[error.code as keyof typeof firebaseErrorCodes] || 'A aparut o eroare. Va rugam sa incercati din nou.';
    });
  }

  closeToast() {
    this.showErrorToase = false;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
