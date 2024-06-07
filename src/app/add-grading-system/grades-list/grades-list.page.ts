import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-grades-list',
  templateUrl: './grades-list.page.html',
  styleUrls: ['./grades-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GradesListPage implements OnInit {
  elementCursSelectat$ = this.stateManagerService.elementCursSelectat$;
  grupaSelectata$ = this.stateManagerService.grupaSelectata$;
  subgrupaSelectata$ = this.stateManagerService.subgrupaSelectata$;
  materiaSelectata$ = this.stateManagerService.materiaSelectata$;
  listaStudenti$ = this.stateManagerService.listaStudenti$;
  constructor(
    private stateManagerService: StateManagerService,
    private userDataService: UserDataService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.userDataService.getStudentList();
  }

  getUserGrade(
    student: any,
    materia: any,
    grupa: any,
    subgrupa: any,
    elementCurs: string
  ): string | null {
    const grades = materia[`grupa${grupa}`][`subgrupa${subgrupa}`].find(
      (item: any) => item.type === elementCurs
    )?.grades;
    const listaNote = grades?.find((item: any) => item.studentId === student.id);

    if (listaNote) {
      return listaNote.grade;
    }
    return null;
  }

  addGrade(
    student: any,
    materia: any,
    grupa: any,
    subgrupa: any,
    elementCurs: string
  ): void {
    this.alertController.create({
      header: 'Adauga nota',
      inputs: [
        {
          name: 'grade',
          type: 'number',
          placeholder: 'Nota',
        },
      ],
      buttons: [
        {
          text: 'Anulează',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: (data) => {
            this.userDataService.addGrade(
              student,
              materia,
              grupa,
              subgrupa,
              elementCurs,
              data.grade
            );
          },
        },
      ],
    }).then((alert) => {
      alert.present();
    });
  }
}
