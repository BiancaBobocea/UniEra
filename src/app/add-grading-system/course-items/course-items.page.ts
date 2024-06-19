import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { IonModal } from '@ionic/angular';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { combineLatest, take } from 'rxjs';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-items',
  templateUrl: './course-items.page.html',
  styleUrls: ['./course-items.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CourseItemsPage implements ViewWillEnter {

  grupaSelectata$ = this.stateManagerService.grupaSelectata$;
  subgrupaSelectata$ = this.stateManagerService.subgrupaSelectata$;
  materiaSelectata$ = this.stateManagerService.materiaSelectata$;
  listaElementeCurs$ = this.stateManagerService.listaElementeCurs$;
  materialeCursSelectat$ = this.stateManagerService.materialeCursSelectat$;
  userDetails$ = this.stateManagerService.userDetails$;
  user$ = this.stateManagerService.user$;

  itemSelectat!: any;
  procentajSelectat!: any;
  accordionSelectat!: any;
  showAddElementsModal = false;
  showPercentageModal = false;
  itemOptions = [
    {
      label: 'Laborator',
      value: 'laborator'
    },
    {
      label: 'Seminar',
      value: 'seminar'
    },
    {
      label: 'Curs',
      value: 'curs'
    },
    {
      label: 'Proiect',
      value: 'proiect'
    },
    {
      label: 'Examen',
      value: 'examen'
    },
    {
      label: 'Colocviu',
      value: 'colocviu'
    }
  ]
  constructor(
    private readonly stateManagerService: StateManagerService,
    private readonly userDataService: UserDataService,
    private readonly router: Router
  ) { }

  ionViewWillEnter() {
    addIcons({addCircleOutline});
    combineLatest([this.grupaSelectata$, this.subgrupaSelectata$, this.materiaSelectata$]).pipe(take(1)).subscribe(([grupa, subgrupa, materia]) => {
      this.userDataService.getClassItems(materia.id, grupa as string, subgrupa as string);
    }
    );
  }

  addItem(modal: IonModal, materiaSelectata: any, grupa: any, subgrupa: any) {
    this.userDataService.updateClass(this.itemSelectat, materiaSelectata.id, grupa, subgrupa);
    modal.dismiss();
  }

  setPercentage(modal: IonModal, materiaSelectata: any, grupa: any, subgrupa: any, procentaj: any) {
    this.userDataService.updateClass(this.accordionSelectat, materiaSelectata.id, grupa, subgrupa, procentaj);
    modal.dismiss();
  }

  accordionGroupChange = (ev: any) => {
    this.accordionSelectat = ev.detail.value;
    this.stateManagerService.updateState({ elementCursSelectat: ev.detail.value });
 };

 goToGradesList() {
  this.router.navigate(['grade-item/grades-list']);
 }

 getCurrentStudentGrade(userId: any, grades: any[]) {
  return grades.find(grade => grade.studentId === userId)?.grade || null;
 }
}
