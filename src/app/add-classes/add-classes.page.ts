import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { StateManagerService } from '../services/state-manager.service';
import { UserDataService } from '../services/user-data/user-data.service';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.page.html',
  styleUrls: ['./add-classes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AddClassesPage implements OnInit {
  listaProfesori$: Observable<any> = this.stateManagerService.listaProfesori$;
  listaMaterii$: Observable<any> = this.stateManagerService.listaMaterii$;
  showModal = false;
  classForm = this.fb.group({
    className: [''],
    professorList: [''],
    year: [''],
    semester: [''],
    group: [''],
    subGroup: [''],
  });
  constructor(
    private readonly stateManagerService: StateManagerService,
    private userDataService: UserDataService,
    private fb: FormBuilder,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    addIcons({closeOutline});
    await this.userDataService.getProfessorList();
    await this.userDataService.getClassesList();
  }

  openModalToAddClass() {
    this.showModal = true;
  }

  openDeleteModal(classId: string) {
    this.alertController.create({
      header: 'Delete',
      message: 'Are you sure you want to delete this class?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.userDataService.deleteClass(classId);
          },
        },
      ],
    }).then((alert) => {
      alert.present();
    });
  }

  addClass() {
    const className = this.classForm.get('className')?.value;
    const professor = this.classForm.get('professorList')?.value;
    this.userDataService.addClass(this.classForm.value);
    this.showModal = false;
  }

  getProfessorName(id: string, professorList: any[]) {
    return professorList.find((professor) => professor.id === id)?.firstName + ' ' + professorList.find((professor) => professor.id === id)?.lastName;
  }
}
