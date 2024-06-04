import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-general',
  templateUrl: './general.page.html',
  styleUrls: ['./general.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GeneralPage implements OnInit {
  userDetails$ = this.stateManagerService.userDetails$;
  constructor(
    private readonly stateManagerService: StateManagerService,
    private readonly alertController: AlertController
  ) {}

  ngOnInit() {}

  askForUpdate() {
    this.alertController
      .create({
        inputs: [
          {
            name: 'details',
            type: 'textarea',
            placeholder: 'Descrieti aici ce doriti sa schimbati la datele dvs.',
          },
        ],
        buttons: ['Trimite'],
      })
      .then((alert) => {
        alert.present();
      });
  }
}
