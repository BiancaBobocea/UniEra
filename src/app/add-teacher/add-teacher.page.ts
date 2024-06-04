import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserDataService } from '../services/user-data/user-data.service';
import { RegisterService } from '../services/register/register-service.service';

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
    private registerService: RegisterService
  ) { }

  ngOnInit() {
    this.addTeacherForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: [''],
      department: [''],
      cnp: ['', Validators.required],
    });
  }

  addTeacher() {
    const formValue = {...this.addTeacherForm.value, role: 'teacher'};
    this.registerService.createNewUser(formValue);
  }
}
