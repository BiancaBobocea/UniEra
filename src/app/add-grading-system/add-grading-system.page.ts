import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserDataService } from '../services/user-data/user-data.service';
import { StateManagerService } from '../services/state-manager.service';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-add-grading-system',
  templateUrl: './add-grading-system.page.html',
  styleUrls: ['./add-grading-system.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
})
export class AddGradingSystemPage implements OnInit {
  listaMaterii$ = this.stateManagerService.listaMaterii$;
  user$ = this.stateManagerService.user$;
  userDetails$ = this.stateManagerService.userDetails$;
  selectedSemester: '1' | '2' = '1';
  constructor(
    private readonly userDataService: UserDataService,
    private readonly stateManagerService: StateManagerService,
    private readonly router: Router,
  ) {}

  async ngOnInit() {
    await this.userDataService.getClassesList();
    this.stateManagerService.updateState({
      materiaSelectata: null,
    });
  }

  selectSemester1() {
    this.selectedSemester = '1';
  }

  selectSemester2() {
    this.selectedSemester = '2';
  }

  selectCourse(course: any, userDetails: any) {
    this.stateManagerService.updateState({
      materiaSelectata: course,
    });
    this.userDataService.getCourseFiles(course);

    if (userDetails.role === 'student') {
      this.stateManagerService.updateState({ grupaSelectata: userDetails.group });
      this.stateManagerService.updateState({ subgrupaSelectata: userDetails.subgroup });
      this.router.navigate(['/grade-item/course-items']);
    } else {
      this.router.navigate(['/grade-item']);
    
    }
  }
}
