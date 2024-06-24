import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { LoginService } from '../services/login/login.service';
import { StateManagerService } from '../services/state-manager.service';
import { addIcons } from 'ionicons';
import { camera, arrowForward } from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { UserDataService } from '../services/user-data/user-data.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, IonRouterOutlet, TranslateModule
  ],
})
export class ProfilePage implements OnInit {
  user$ = this.stateManagerService.user$;
  userDetails$ = this.stateManagerService.userDetails$;
  pozaProfil$ = this.stateManagerService.pozaProfil$;

  showPictureModal = false;
  constructor(
    private readonly loginService: LoginService,
    private readonly stateManagerService: StateManagerService,
    private readonly alertController: AlertController,
    private readonly userDataService: UserDataService
  ) {}

  ngOnInit() {
    addIcons({camera, arrowForward});
  }

  logout() {
    this.loginService.signOutUser();
  }

  openProfilePictureModal() {
    this.showPictureModal = true;
  }

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

  async selectProfilePicture(userId: string) {
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
      this.userDataService.uploadProfilePicture(
        userId,
        pickedFile,
      );
    }
  }
}
