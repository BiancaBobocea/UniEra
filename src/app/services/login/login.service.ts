import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { UserDataService } from '../user-data/user-data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(private userDataService: UserDataService, private router: Router) { }

  async loginUser(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        this.userDataService.getUserData(user);
      })
  }

  signOutUser() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.userDataService.clearUserState();
      this.router.navigate(['/login']);
      // Sign-out successful.
    }).catch((error) => {
      console.log(error);
      // An error happened.
    });
  }
}
