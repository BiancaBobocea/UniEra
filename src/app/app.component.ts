import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { UserDataService } from './services/user-data/user-data.service';
import { Router } from '@angular/router';
import { TabsComponent } from './shared/tabs/tabs.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, TabsComponent],
})
export class AppComponent {
  constructor(
    private readonly userDataService: UserDataService,
    private readonly router: Router
  ) {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        // User is signed in
        console.log('User is signed in');
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
