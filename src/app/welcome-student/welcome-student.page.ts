import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Orar, StateManagerService } from '../services/state-manager.service';
import { Observable, take } from 'rxjs';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, notifications, earth } from 'ionicons/icons';
import { Course } from '../add-timetable/timetable-select/timetable-select.page';
import { UserDataService } from '../services/user-data/user-data.service';
import { NotificationsPage } from '../profile/notifications/notifications.page';

@Component({
  selector: 'app-welcome-student',
  templateUrl: './welcome-student.page.html',
  styleUrls: ['./welcome-student.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NotificationsPage],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeStudentPage implements OnInit, ViewWillEnter {

  userDetails$: Observable<any> = this.stateManagerService.userDetails$;
  user$: Observable<any> = this.stateManagerService.user$;
  saptamanaImpara$: Observable<Orar | undefined> = this.stateManagerService.saptamanaImpara$;
  saptamanaPara$: Observable<any> = this.stateManagerService.saptamanaPara$;

  userNotifications$: Observable<any> = this.stateManagerService.userNotifications$;


  datepipe: DatePipe = new DatePipe('en-US');
  currentDate = this.datepipe.transform(Date.now(), 'longDate');
  dayOfTheWeek = this.datepipe.transform(Date.now(), 'fullDate')?.split(',')[0];
  activeDayIndex = 0;
  activeDay: any;

  schedule: Course[] = [
    {
      startHour: '8:00',
      endHour: '10:00',
      classType: 'FREE',
      className: 'Pauza',
    },
    {
      startHour: '10:00',
      endHour: '12:00',
      classType: 'FREE',
      className: 'Pauza',
    },
    {
      startHour: '12:00',
      endHour: '14:00',
      classType: 'FREE',
      className: 'Pauza',
    },
    {
      startHour: '14:00',
      endHour: '16:00',
      classType: 'FREE',
      className: 'Pauza',
    },
    {
      startHour: '16:00',
      endHour: '18:00',
      classType: 'FREE',
      className: 'Pauza',
    },
    {
      startHour: '18:00',
      endHour: '20:00',
      classType: 'FREE',
      className: 'Pauza',
    },
    {
      startHour: '20:00',
      endHour: '22:00',
      classType: 'FREE',
      className: 'Pauza',
    },
  ];

  currentWeek = [
    {name: "Lun", schedule: this.schedule, mappedName: 'Monday', active: false}, 
    {name: "Mar", schedule: this.schedule, mappedName: 'Tuesday', active: false}, 
    {name: "Mie", schedule: this.schedule, mappedName: 'Wednesday', active: false}, 
    {name: "Joi", schedule: this.schedule, mappedName: 'Thursday', active: false}, 
    {name: "Vin", schedule: this.schedule, mappedName: 'Friday', active: false}
  ];

  constructor(private stateManagerService: StateManagerService, private userDataService: UserDataService, private cdr: ChangeDetectorRef) { }

  async ngOnInit() {

    addIcons({checkmarkCircleOutline, notifications, earth});

    this.user$.pipe(take(2)).subscribe((user: any) => {
      if(user?.uid) {
        console.log(user?.uid)
        this.userDataService.getUsersNotifications(user?.uid);
      }
    });
    
    this.stateManagerService.userDetails$.pipe(take(1)).subscribe((userDetails) => {
      if (userDetails) {
        this.userDataService.getTimeTable(userDetails);
      }
    });
    
    this.saptamanaImpara$.subscribe((saptamanaImpara) => {
      if (saptamanaImpara){
        Object.entries(saptamanaImpara).forEach(([day, orar]) => {
          let index: number = this.currentWeek.findIndex(item => item.mappedName.toLowerCase() === day);
          this.currentWeek[index].schedule = orar.schedule?.map((s) => ({...s}));
        });
        this.cdr.detectChanges();
      } else {
        this.currentWeek = [
          {name: "Lun", schedule: this.schedule, mappedName: 'Monday', active: false}, 
          {name: "Mar", schedule: this.schedule, mappedName: 'Tuesday', active: false}, 
          {name: "Mie", schedule: this.schedule, mappedName: 'Wednesday', active: false}, 
          {name: "Joi", schedule: this.schedule, mappedName: 'Thursday', active: false}, 
          {name: "Vin", schedule: this.schedule, mappedName: 'Friday', active: false}
        ];

        this.currentWeek.forEach((day, index) => {
          if (day.mappedName === this.dayOfTheWeek) {
            this.selectDay(index);
          }
        });
      }
    });
    
    this.currentWeek.forEach((day, index) => {
      if (day.mappedName === this.dayOfTheWeek) {
        this.selectDay(index);
      }
    });
  }

  ionViewWillEnter() {
    this.currentWeek.forEach((day, index) => {
      if (day.mappedName === this.dayOfTheWeek) {
        this.selectDay(index);
      }
    });

    this.saptamanaImpara$.subscribe((saptamanaImpara) => {
      if (saptamanaImpara){
        Object.entries(saptamanaImpara).forEach(([day, orar]) => {
          let index: number = this.currentWeek.findIndex(item => item.mappedName.toLowerCase() === day);
          this.currentWeek[index].schedule = orar.schedule?.map((s) => ({...s}));
        });
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
  }
}
