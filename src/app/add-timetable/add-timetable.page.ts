import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StateManagerService } from '../services/state-manager.service';
import { ViewWillEnter } from '@ionic/angular';
@Component({
  selector: 'app-add-timetable',
  templateUrl: './add-timetable.page.html',
  styleUrls: ['./add-timetable.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddTimetablePage implements OnInit {

  timetableSem1DetailsForm = this.fb.group({
    year: ['', Validators.required],
    specialization: ['', Validators.required],
    group: ['', Validators.required],
    subGroup: ['', Validators.required],
  });
  timetableSem2DetailsForm = this.fb.group({
    year: ['', Validators.required],
    specialization: ['', Validators.required],
    group: ['', Validators.required],
    subGroup: ['', Validators.required],
  });
  selectedForm!: FormGroup;
  showSemester1: boolean = true;
  showSemester2: boolean = false;
  showErrorToast = false;

  constructor(
    private router: Router,
    private stateManagerService: StateManagerService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.stateManagerService.updateState({adminSelectionSaptamanaPara : undefined});
    this.stateManagerService.updateState({adminSelectionSaptamanaImpara : undefined});

    this.selectedForm = this.timetableSem1DetailsForm;
  }
  selectSemester1() {
    this.showSemester1 = true;
    this.showSemester2 = false;
    this.stateManagerService.updateState({semestrulSelectat: 'semestrul1'});
    this.selectedForm = this.timetableSem1DetailsForm;
  }

  selectSemester2() {
    this.showSemester2 = true;
    this.showSemester1 = false;
    this.stateManagerService.updateState({semestrulSelectat: 'semestrul2'});
    this.selectedForm = this.timetableSem2DetailsForm;
  }

  goToSelectTimetable() {
    if (this.selectedForm.invalid) {
      this.showErrorToast = true;
      return;
    }
    this.stateManagerService.updateState({filtreAdaugareOrar: this.selectedForm.value});
    this.router.navigate(['timetable-select']);
  }

  closeToast() {
    this.showErrorToast = false;
  }
}
