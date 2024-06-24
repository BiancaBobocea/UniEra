import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Orar, StateManagerService } from '../services/state-manager.service';
import { Observable, take } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  notifications,
  earth,
  arrowForward,
  arrowBack
} from 'ionicons/icons';
import { Course } from '../add-timetable/timetable-select/timetable-select.page';
import { UserDataService } from '../services/user-data/user-data.service';
import { NotificationsPage } from '../profile/notifications/notifications.page';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome-student',
  templateUrl: './welcome-student.page.html',
  styleUrls: ['./welcome-student.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NotificationsPage,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeStudentPage implements OnInit, ViewWillEnter {
  userDetails$: Observable<any> = this.stateManagerService.userDetails$;
  user$: Observable<any> = this.stateManagerService.user$;
  saptamanaImpara$: Observable<Orar | undefined> =
    this.stateManagerService.saptamanaImpara$;
  saptamanaPara$: Observable<Orar | undefined> = 
    this.stateManagerService.saptamanaPara$;

  userNotifications$: Observable<any> =
    this.stateManagerService.userNotifications$;
  saptamanaSelectata: 'saptamanaImpara' | 'saptamanaPara' = 'saptamanaImpara';
  datepipe: DatePipe = new DatePipe('en-US');
  currentDate = this.datepipe.transform(Date.now(), 'longDate');
  dayOfTheWeek = this.datepipe.transform(Date.now(), 'fullDate')?.split(',')[0];
  activeDayIndex = 0;
  activeDay: any;
  indexOfSelectedWeek = 0;

  traducerePauza = this.translateService.instant('welcome-student.pauza');

  schedule: Course[] = [
    {
      startHour: '8:00',
      endHour: '10:00',
      classType: 'FREE',
      className: this.traducerePauza,
    },
    {
      startHour: '10:00',
      endHour: '12:00',
      classType: 'FREE',
      className: this.traducerePauza,
    },
    {
      startHour: '12:00',
      endHour: '14:00',
      classType: 'FREE',
      className: this.traducerePauza,
    },
    {
      startHour: '14:00',
      endHour: '16:00',
      classType: 'FREE',
      className: this.traducerePauza,
    },
    {
      startHour: '16:00',
      endHour: '18:00',
      classType: 'FREE',
      className: this.traducerePauza,
    },
    {
      startHour: '18:00',
      endHour: '20:00',
      classType: 'FREE',
      className: this.traducerePauza,
    },
    {
      startHour: '20:00',
      endHour: '22:00',
      classType: 'FREE',
      className: this.traducerePauza,
    },
  ];

  saptamanaImpara = [
    {
      name: 'Lun',
      schedule: [...this.schedule],
      mappedName: 'Monday',
      active: false,
      current: false
    },
    {
      name: 'Mar',
      schedule: [...this.schedule],
      mappedName: 'Tuesday',
      active: false,
    },
    {
      name: 'Mie',
      schedule: [...this.schedule],
      mappedName: 'Wednesday',
      active: false,
    },
    {
      name: 'Joi',
      schedule: [...this.schedule],
      mappedName: 'Thursday',
      active: false,
    },
    {
      name: 'Vin',
      schedule: [...this.schedule],
      mappedName: 'Friday',
      active: false,
    },
  ];

  saptamanaPara = [
    {
      name: 'Lun',
      schedule: [...this.schedule],
      mappedName: 'Monday',
      active: false,
      current: false,
    },
    {
      name: 'Mar',
      schedule: [...this.schedule],
      mappedName: 'Tuesday',
      active: false,
    },
    {
      name: 'Mie',
      schedule: [...this.schedule],
      mappedName: 'Wednesday',
      active: false,
    },
    {
      name: 'Joi',
      schedule: [...this.schedule],
      mappedName: 'Thursday',
      active: false,
    },
    {
      name: 'Vin',
      schedule: [...this.schedule],
      mappedName: 'Friday',
      active: false,
    },
  ];

  currentWeek = [...this.saptamanaImpara];

  constructor(
    private stateManagerService: StateManagerService,
    private userDataService: UserDataService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService
  ) {}

  async ngOnInit() {
    addIcons({ checkmarkCircleOutline, notifications, earth, arrowForward, arrowBack });

    this.user$.pipe(take(2)).subscribe((user: any) => {
      if (user?.uid) {
        console.log(user?.uid);
        this.userDataService.getUsersNotifications(user?.uid);
      }
    });

    this.stateManagerService.userDetails$
      .pipe(take(1))
      .subscribe((userDetails) => {
        if (userDetails) {
          this.userDataService.getTimeTable(userDetails);
        }
      });

    this.saptamanaImpara$.pipe().subscribe((saptamanaImpara) => {
      if (saptamanaImpara){
        console.log('### saptamana impara: ', saptamanaImpara);
        Object.entries(saptamanaImpara).forEach(([day, orar]) => {
          let index: number = this.saptamanaImpara.findIndex(item => item.mappedName.toLowerCase() === day);
          this.saptamanaImpara[index].schedule = orar.schedule?.map((s) => ({...s}));
        });
      }
    });

    this.saptamanaPara$.pipe().subscribe((saptamanaPara) => {
      if (saptamanaPara){
        console.log('### saptamana para: ', saptamanaPara);
        Object.entries(saptamanaPara).forEach(([day, orar]) => {
          let index: number = this.saptamanaPara.findIndex(item => item.mappedName.toLowerCase() === day);
          this.saptamanaPara[index].schedule = orar.schedule?.map((s) => ({...s}));
        });
      }
    });

    this.currentWeek.forEach((day, index) => {
      if (day.mappedName === this.dayOfTheWeek) {
        this.selectDay(index);
        this.setCurrentDay(index);
      }
    });
  }

  ionViewWillEnter() {
    this.currentWeek.forEach((day, index) => {
      if (day.mappedName === this.dayOfTheWeek) {
        this.selectDay(index);
      }
    });
  }

  selectDay(dayIndex: any) {
    this.currentWeek.forEach((d) => {
      d.active = false;
    });
    this.currentWeek[dayIndex].active = true;
    this.activeDayIndex = dayIndex;
    this.activeDay = this.currentWeek[dayIndex];
    const daysDistance = dayIndex + (this.indexOfSelectedWeek * 5) + (2 * this.indexOfSelectedWeek);
    this.currentDate = this.addDays(new Date(), daysDistance);
  }

  setCurrentDay(dayIndex: any) {
    this.currentWeek[dayIndex].current = true;
  }

  showOtherWeekTimetable(direction: 'next' | 'previous') {
    if (direction === 'next') {
      this.indexOfSelectedWeek += 1;
    } else {
      this.indexOfSelectedWeek -= 1;
    }
    if (this.saptamanaSelectata === 'saptamanaImpara') {
      this.saptamanaSelectata = 'saptamanaPara';
    } else {
      this.saptamanaSelectata = 'saptamanaImpara';
    }
    this.currentWeek = 
      this.saptamanaSelectata === 'saptamanaPara' ? [...this.saptamanaPara] : [...this.saptamanaImpara];
    this.selectDay(0);
  }


  addDays(date: Date, days: number): string | null {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return this.datepipe.transform(result, 'longDate');
  }

  selectLanguage(language: string) {
    this.translateService.use(language);
  }
}
