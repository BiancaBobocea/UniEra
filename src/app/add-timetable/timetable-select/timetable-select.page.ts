import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { Observable, combineLatest, take } from 'rxjs';
import { IonModal } from '@ionic/angular/common';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

export interface Course {
  startHour: string;
  endHour: string;
  room?: string;
  className?: string;
  classType?: string;
  classId?: string;
}

@Component({
  selector: 'app-timetable-select',
  templateUrl: './timetable-select.page.html',
  styleUrls: ['./timetable-select.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class TimetableSelectPage implements OnInit {
  currentDayForm!: FormGroup;
  saptamanaSelectata: 'saptamanaPara' | 'saptamanaImpara' = 'saptamanaImpara';
  listaProfesori$: Observable<any> = this.stateManagerService.listaProfesori$;
  listaMaterii$: Observable<any> = this.stateManagerService.listaMaterii$;
  semestrulSelectat$: Observable<any> =
    this.stateManagerService.semestrulSelectat$;
  filtreAdaugareOrar$: Observable<any> =
    this.stateManagerService.filtreAdaugareOrar$;
  activeDayIndex = 0;
  schedule: Course[] = [
    {
      startHour: '8:00',
      endHour: '10:00',
      classType: 'FREE',
      className: 'Free',
    },
    {
      startHour: '10:00',
      endHour: '12:00',
      classType: 'FREE',
      className: 'Free',
    },
    {
      startHour: '12:00',
      endHour: '14:00',
      classType: 'FREE',
      className: 'Free',
    },
    {
      startHour: '14:00',
      endHour: '16:00',
      classType: 'FREE',
      className: 'Free',
    },
    {
      startHour: '16:00',
      endHour: '18:00',
      classType: 'FREE',
      className: 'Free',
    },
    {
      startHour: '18:00',
      endHour: '20:00',
      classType: 'FREE',
      className: 'Free',
    },
    {
      startHour: '20:00',
      endHour: '22:00',
      classType: 'FREE',
      className: 'Free',
    },
  ];

  saptamanaImpara = [
    {
      name: 'Lun',
      schedule: this.schedule,
      mappedName: 'Monday',
      active: false,
    },
    {
      name: 'Mar',
      schedule: this.schedule,
      mappedName: 'Tuesday',
      active: false,
    },
    {
      name: 'Mie',
      schedule: this.schedule,
      mappedName: 'Wednesday',
      active: false,
    },
    {
      name: 'Joi',
      schedule: this.schedule,
      mappedName: 'Thursday',
      active: false,
    },
    {
      name: 'Vin',
      schedule: this.schedule,
      mappedName: 'Friday',
      active: false,
    },
  ];

  saptamanaPara = [
    {
      name: 'Lun',
      schedule: this.schedule,
      mappedName: 'Monday',
      active: false,
    },
    {
      name: 'Mar',
      schedule: this.schedule,
      mappedName: 'Tuesday',
      active: false,
    },
    {
      name: 'Mie',
      schedule: this.schedule,
      mappedName: 'Wednesday',
      active: false,
    },
    {
      name: 'Joi',
      schedule: this.schedule,
      mappedName: 'Thursday',
      active: false,
    },
    {
      name: 'Vin',
      schedule: this.schedule,
      mappedName: 'Friday',
      active: false,
    },
  ];

  selectedWeek = this.saptamanaImpara;

  toastErrorMessage = 'Please fill in all the fields first!';
  showErrorToast = false;

  constructor(
    private stateManagerService: StateManagerService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userDataService: UserDataService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    this.filtreAdaugareOrar$.subscribe((filtre) => {
      if (
        !filtre.year ||
        !filtre.specialization ||
        !filtre.group ||
        !filtre.subGroup
      ) {
        this.router.navigate(['add-timetable']);
      }
    });
    await this.userDataService.getProfessorList();
    await this.userDataService.getClassesList();
    this.saptamanaImpara.forEach((day) => {
      day.schedule = this.schedule.map((s) => ({ ...s }));
    });

    this.saptamanaPara.forEach((day) => {
      day.schedule = this.schedule.map((s) => ({ ...s }));
    });

    addIcons({ checkmarkCircleOutline });
    this.selectDay(0);
  }

  selectDay(dayIndex: any) {
    this.selectedWeek.forEach((d) => {
      d.active = false;
    });
    this.selectedWeek[dayIndex].active = true;
    this.activeDayIndex = dayIndex;
    this.cdr.detectChanges();
  }

  selectWeek(week: 'saptamanaPara' | 'saptamanaImpara') {
    this.saptamanaSelectata = week;
    this.selectedWeek =
      week === 'saptamanaPara' ? this.saptamanaPara : this.saptamanaImpara;
    this.selectDay(0);
  }

  initializeForm() {
    this.currentDayForm = this.fb.group({
      class: ['', Validators.required],
      room: [''],
      professor: ['', Validators.required],
      classType: ['', Validators.required],
    });
  }

  getProfessorsInClass(idMaterieSelectata: number, listaMaterii: any[], listaProfesori: any[]): any[] {
    const materieSelectata = listaMaterii.find((materie) => materie.id === idMaterieSelectata);
    const profesoriMaterie = listaProfesori.filter((profesor) => materieSelectata.professorList.includes(profesor.id));
    return profesoriMaterie;
  }

  addClass(selectedIndex: number, modal: IonModal) {
    if (this.currentDayForm.invalid) {
      this.showErrorToast = true;
      return;
    }
    this.selectedWeek[this.activeDayIndex].schedule[selectedIndex].className =
      this.currentDayForm.get('class')?.value.className;
    this.selectedWeek[this.activeDayIndex].schedule[selectedIndex].room =
      this.currentDayForm.get('room')?.value;
    this.selectedWeek[this.activeDayIndex].schedule[selectedIndex].classType =
      this.currentDayForm.get('classType')?.value;
    this.selectedWeek[this.activeDayIndex].schedule[selectedIndex].classId = 
      this.currentDayForm.get('class')?.value.id;
    this.currentDayForm.reset();
    modal.dismiss();
  }

  addTimetableToDatabase() {
    const timetable = {
      saptamanaImpara: this.saptamanaImpara,
      saptamanaPara: this.saptamanaPara,
    };
    this.userDataService
      .addTimetable(timetable, this.saptamanaSelectata)
      .then(() => {
        this.alertCtrl.create({
          header: 'Success',
          message: 'Timetable added successfully!',
          buttons: ['OK'],
        });
      });
  }

  closeToast() {
    this.showErrorToast = false;
  }
}
