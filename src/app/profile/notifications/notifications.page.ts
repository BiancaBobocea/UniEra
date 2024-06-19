import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { AlertController } from '@ionic/angular';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { map, take } from 'rxjs';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { User } from 'firebase/auth';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class NotificationsPage implements OnInit {
  @Input() showOnlyNotResolved = false;

  adminResolvedNotifications$ =
    this.stateManagerService.adminNotifications$.pipe(
      map((notifications) =>
        notifications?.filter((notification) => notification.resolved === true)
      )
    );

  adminUnresolvedNotifications$ =
    this.stateManagerService.adminNotifications$.pipe(
      map((notifications) =>
        notifications?.filter((notification) => notification.resolved === false)
      )
    );
  userNotifications$ = this.stateManagerService.userNotifications$;

  listaStudenti$ = this.stateManagerService.listaStudenti$;
  listaProfesori$ = this.stateManagerService.listaProfesori$;
  userDetails$ = this.stateManagerService.userDetails$;
  user$ = this.stateManagerService.user$;

  notificationTitle: string = '';
  notificationDescription: string = '';
  constructor(
    private alertController: AlertController,
    private userDataService: UserDataService,
    private stateManagerService: StateManagerService
  ) {}

  ngOnInit() {
    this.userDataService.getAdminNotifications();
    this.userDataService.getStudentList();
    this.userDataService.getProfessorList();
    this.user$.pipe(take(1)).subscribe((user: User | null) => {
      this.userDataService.getUsersNotifications(user?.uid);
    });

    addIcons({ closeOutline });
  }

  getMessageAuthorName(notification: any, data: any) {
    const listaUseri = data.listaStudenti.concat(data.listaProfesori);

    const author = listaUseri.find(
      (user: any) => user.id === notification.author
    );

    return author?.firstName + ' ' + author?.lastName + `(${author?.role})`;
  }

  openNotification(notification: any, data: any) {
    this.alertController
      .create({
        header: notification.title,
        subHeader:
          'Mesaj primit de la: ' +
          this.getMessageAuthorName(notification, data),
        message: notification.message,
        buttons: [
          {
            text: 'Marcheaza ca rezolvat',
            handler: () => {
              this.userDataService.markNotificationAsResolved(notification);
            },
          },
          {
            text: 'Inchide',
            role: 'cancel',
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  openNotificationForUser(notification: any) {
    this.alertController
      .create({
        header: notification.title,
        subHeader: 'Mesaj primit de la admin',
        message: notification.message,
        buttons: [
          {
            text: 'Inchide',
            role: 'cancel',
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  removeNotification(notification: any, role: string) {
    this.alertController
      .create({
        header: 'Confirmare',
        message: 'Esti sigur ca vrei sa stergi aceasta notificare?',
        buttons: [
          {
            text: 'Da',
            handler: () => {
              this.userDataService.removeNotification(notification, role);
            },
          },
          {
            text: 'Nu',
            role: 'cancel',
          },
        ],
      })
      .then((alert) => alert.present());
  }
}
