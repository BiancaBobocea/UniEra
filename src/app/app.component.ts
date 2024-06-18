import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { UserDataService } from './services/user-data/user-data.service';
import { Router, RouterOutlet } from '@angular/router';
import { TabsComponent } from './shared/tabs/tabs.component';
import { StateManagerService } from './services/state-manager.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, TabsComponent, RouterOutlet, CommonModule],
})
export class AppComponent {
  loading$ = this.stateManagerService.loading$;
  constructor(
    private readonly userDataService: UserDataService,
    private readonly router: Router,
    private stateManagerService: StateManagerService
  ) {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        // User is signed in
        console.log('User is signed in');
        this.stateManagerService.updateState({ user });
        this.userDataService.getUserData(user);
        this.userDataService.getCurrentSemester();
      } else {
        // No user is signed in
        console.log('No user is signed in');
        this.router.navigate(['/login']);
      }
    });
  }
}
