import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterService } from '../services/register/register-service.service';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.page.html',
  styleUrls: ['./add-student.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddStudentPage implements OnInit {

  addStudentForm!: FormGroup;
  constructor(private fb: FormBuilder, private registerService: RegisterService, private toastController: ToastController ) { }

  ngOnInit() {
    this.addStudentForm = this.fb.group({
      firstName: ['', Validators.required], 
      lastName: ['', Validators.required], 
      cnp: ['', Validators.required],
      phoneNumber: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]],
      matricolNumber: ['', Validators.required], 
      specialization: ['', Validators.required], 
      year: ['', Validators.required], 
      group: ['', Validators.required], 
      subgroup: ['', Validators.required], 
    })
  }

  async createStudent() {
    if (this.addStudentForm.invalid) {
      const toast = await this.toastController.create({
        message: 'Completeaza toate campurile obligatorii!',
        position: 'bottom',
        duration: 3000
      });

      await toast.present();
      return;
    }
    const formValue = {...this.addStudentForm.value, role: 'student'};
    this.registerService.createNewUser(formValue);
  }
}
