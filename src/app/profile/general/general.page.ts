import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { AlertController } from '@ionic/angular';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { User } from 'firebase/auth';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-general',
  templateUrl: './general.page.html',
  styleUrls: ['./general.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
})
export class GeneralPage implements OnInit {
  user$ = this.stateManagerService.user$;
  userDetails$ = this.stateManagerService.userDetails$;
  constructor(
    private readonly stateManagerService: StateManagerService,
    private readonly alertController: AlertController,
    private readonly userDataService: UserDataService,
  ) {}

  ngOnInit() {}

  askForUpdate(user: User | null) {
    this.alertController
      .create({
        inputs: [
          {
            name: 'title',
            type: 'text',
            placeholder: 'Titlu',
          },
          {
            name: 'details',
            type: 'textarea',
            placeholder: 'Descrieti aici ce doriti sa schimbati la datele dvs.',
          },
        ],
        buttons: [
          {
            text: 'Trimite',
            handler: async (data) => {
              console.log(data);

              this.userDataService.publishNotificationForAdmin(data, user?.uid);
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }
}
