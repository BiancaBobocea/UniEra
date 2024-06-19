import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { StateManagerService } from '../services/state-manager.service';
import { UserDataService } from '../services/user-data/user-data.service';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular/standalone';

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
    className: ['', Validators.required],
    professorList: ['', Validators.required],
    year: ['', Validators.required],
    semester: ['', Validators.required],
  });
  constructor(
    private readonly stateManagerService: StateManagerService,
    private userDataService: UserDataService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private toastController: ToastController
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
      header: 'Elimină',
      message: 'Ești sigur că vrei să ștergi acest curs?',
      buttons: [
        {
          text: 'Anuleză',
          role: 'cancel',
        },
        {
          text: 'Șterge',
          handler: async () => {
            await this.userDataService.deleteClass(classId);
          },
        },
      ],
    }).then((alert) => {
      alert.present();
    });
  }

  async addClass() {
    if (this.classForm.invalid) {
      const toast = await this.toastController.create({
        message: 'Completeaza toate campurile obligatorii!',
        position: 'bottom',
        duration: 3000
      });

      await toast.present();
      return;
    }

    this.userDataService.addClass(this.classForm.value);
    this.showModal = false;
  }

  getProfessorName(id: string, professorList: any[]) {
    return professorList.find((professor) => professor.id === id)?.firstName + ' ' + professorList.find((professor) => professor.id === id)?.lastName;
  }
}
