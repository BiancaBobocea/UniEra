import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircleOutline, notifications, earth } from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { StateManagerService } from '../services/state-manager.service';
import { NotificationsPage } from '../profile/notifications/notifications.page';
import { map } from 'rxjs';
import { UserDataService } from '../services/user-data/user-data.service';
import { PopoverController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-welcome-admin',
  templateUrl: './welcome-admin.page.html',
  styleUrls: ['./welcome-admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, NotificationsPage],
  changeDetection: ChangeDetectionStrategy.Default
})
export class WelcomeAdminPage implements OnInit {
  userDetails$ = this.stateManagerService.userDetails$;
  adminUnresolvedNotifications$ =
  this.stateManagerService.adminNotifications$.pipe(
    map((notifications) => notifications?.filter(notification => notification.resolved === false))
  );

  leftSideMenuItems = [
    {
      label: 'Adaugă Student',
      routerLink: '/add-student',
    },
    {
      label: 'Adaugă Profesor',
      routerLink: '/add-teacher',
    },
    {
      label: 'Adaugă Cursuri',
      routerLink: '/add-classes',
    },
  ];
  
  rightSideMenuItems = [
    {
      label: 'Adaugă/Modifică Orar',
      routerLink: '/add-timetable',
    },
    {
      label: 'Modifică Date Utilizatori',
      routerLink: '/change-user-data',
    },
  ];

  constructor(private readonly stateManagerService: StateManagerService, private userDataService: UserDataService, private readonly popOverController: PopoverController) { }

  ngOnInit() {
    addIcons({ addCircleOutline, notifications, earth });
    this.userDataService.getAdminNotifications();
  }
}
