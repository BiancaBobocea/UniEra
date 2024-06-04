import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Orar, StateManagerService } from '../services/state-manager.service';
import { Observable, take } from 'rxjs';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { Course } from '../add-timetable/timetable-select/timetable-select.page';
import { UserDataService } from '../services/user-data/user-data.service';

@Component({
  selector: 'app-welcome-student',
  templateUrl: './welcome-student.page.html',
  styleUrls: ['./welcome-student.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class WelcomeStudentPage implements OnInit {

  userDetails$: Observable<any> = this.stateManagerService.userDetails$;
  saptamanaImpara$: Observable<Orar | undefined> = this.stateManagerService.saptamanaImpara$;
  saptamanaPara$: Observable<any> = this.stateManagerService.saptamanaPara$;

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

  currentWeek = [
    {name: "Lun", schedule: this.schedule, mappedName: 'Monday', active: false}, 
    {name: "Mar", schedule: this.schedule, mappedName: 'Tuesday', active: false}, 
    {name: "Mie", schedule: this.schedule, mappedName: 'Wednesday', active: false}, 
    {name: "Joi", schedule: this.schedule, mappedName: 'Thursday', active: false}, 
    {name: "Vin", schedule: this.schedule, mappedName: 'Friday', active: false}
  ];

  constructor(private stateManagerService: StateManagerService, private userDataService: UserDataService) { }

  async ngOnInit() {
    addIcons({checkmarkCircleOutline})

    this.currentWeek.forEach((day, index) => {
      if (day.mappedName === this.dayOfTheWeek) {
        this.selectDay(index);
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
