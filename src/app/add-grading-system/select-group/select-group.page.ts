import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { Router } from '@angular/router';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, closeOutline } from 'ionicons/icons';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { AlertController, ViewWillEnter } from '@ionic/angular/standalone';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-select-group',
  templateUrl: './select-group.page.html',
  styleUrls: ['./select-group.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class SelectGroupPage implements OnInit {
  materiaSelectata$ = this.stateManagerService.materiaSelectata$;
  materialeCursSelectat$ = this.stateManagerService.materialeCursSelectat$;
  constructor(
    private readonly stateManagerService: StateManagerService,
    private router: Router,
    private readonly alertController: AlertController,
    private readonly userDataService: UserDataService
  ) {}

  ngOnInit() {
    console.log('ngOnInit');
    addIcons({ cloudUploadOutline, closeOutline });
    this.materiaSelectata$.pipe(take(1)).subscribe((materiaSelectata) => {
      if (materiaSelectata) {
        this.userDataService.getCourseFiles(materiaSelectata);
      }
    });
  }

  accordionGroupChange = (ev: any) => {
    this.stateManagerService.updateState({
      grupaSelectata: ev.detail.value,
    });
  };

  selectSubgroup = (subgroup: string) => {
    this.stateManagerService.updateState({
      subgrupaSelectata: subgroup,
    });
    this.router.navigate(['/grade-item/course-items']);
  };

  pickFiles = async (materiaSelectata: any) => {
    const result = await FilePicker.pickFiles({
      types: ['pdf'],
      limit: 1,
    });
    if (result.files.length === 0) {
      return;
    }

    if (result.files[0] && result.files[0].blob) {
      const pickedFile: Blob = result.files[0].blob;
      this.userDataService.uploadCourseFile(
        materiaSelectata,
        pickedFile,
        result.files[0].name
      );
    }
  };

  removeFile = async (materiaSelectata: any, file: any) => {
    const alert = await this.alertController.create({
      header: 'Confirmare',
      message: 'Sunteți sigur că doriți să ștergeți acest fișier?',
      buttons: [
        {
          text: 'Anulează',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Șterge',
          handler: () => {
            this.userDataService.deleteCourseFile(materiaSelectata, file);
          },
        },
      ],
    });
  };
}
