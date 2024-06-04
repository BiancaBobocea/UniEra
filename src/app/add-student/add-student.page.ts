import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterService } from '../services/register/register-service.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.page.html',
  styleUrls: ['./add-student.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddStudentPage implements OnInit {

  addStudentForm!: FormGroup;
  constructor(private fb: FormBuilder, private registerService: RegisterService ) { }

  ngOnInit() {
    this.addStudentForm = this.fb.group({
      firstName: [''], 
      lastName: [''], 
      cnp: [''],
      phoneNumber: [''], 
      email: ['', Validators.email],
      matricolNumber: [''], 
      specialization: [''], 
      year: [''], 
      group: [''], 
      subgroup: [''], 
    })
  }

  createStudent() {
    const formValue = {...this.addStudentForm.value, role: 'student'};
    this.registerService.createNewUser(formValue);
  }
}
