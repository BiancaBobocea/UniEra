import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { Router } from '@angular/router';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, closeOutline } from 'ionicons/icons';
import { AlertController } from '@ionic/angular/standalone';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
@Component({
  selector: 'app-select-group',
  templateUrl: './select-group.page.html',
  styleUrls: ['./select-group.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class SelectGroupPage implements OnInit {
  userDetails$ = this.stateManagerService.userDetails$;
  materiaSelectata$ = this.stateManagerService.materiaSelectata$;
  materialeCursSelectat$ = this.stateManagerService.materialeCursSelectat$;
  constructor(
    private readonly stateManagerService: StateManagerService,
    private router: Router,
    private readonly alertController: AlertController,
    private readonly userDataService: UserDataService
  ) {}

  ngOnInit() {
    addIcons({ cloudUploadOutline, closeOutline });
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

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
  }

  pickFiles = async (materiaSelectata: any) => {
    const result = await FilePicker.pickFiles({
      types: ['pdf'],
      limit: 1,
      readData: true,
    });

    const fileBlob = this.dataURItoBlob(result.files[0].data);
    const rawFile = new File([fileBlob as BlobPart], result.files[0].name, {
        type: result.files[0].mimeType,
    });

    if (result.files.length === 0) {
      return;
    }

    if (result.files[0] && rawFile) {
      const pickedFile: Blob = rawFile;
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
    }).then((alert) => {
      alert.present();
    });
  };
}
