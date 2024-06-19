import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterService } from '../services/register/register-service.service';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.page.html',
  styleUrls: ['./add-teacher.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddTeacherPage implements OnInit {

  addTeacherForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.addTeacherForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      department: ['', Validators.required],
      cnp: ['', Validators.required],
    });
  }

  async addTeacher() {
    if (this.addTeacherForm.invalid) {
      const toast = await this.toastController.create({
        message: 'Completeaza toate campurile obligatorii!',
        position: 'bottom',
        duration: 3000
      });

      await toast.present();
      return;
    }
    const formValue = {...this.addTeacherForm.value, role: 'teacher'};
    this.registerService.createNewUser(formValue);
  }
}
