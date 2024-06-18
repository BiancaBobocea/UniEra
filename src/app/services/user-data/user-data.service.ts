import { Injectable } from '@angular/core';
import { StateManagerService } from '../state-manager.service';
import { User } from 'firebase/auth';
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { app } from '../../../environments/environment';
import { combineLatest, take } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { deleteObject, getDownloadURL, getStorage, listAll, ref, updateMetadata, uploadBytes } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private db = getFirestore(app);
  constructor(
    private stateManagerService: StateManagerService,
    private alertController: AlertController,
    private readonly router: Router
  ) {}

  async saveUserData(userDetails: any, user: User) {
    // Add a new student in collection "students"
    this.stateManagerService.updateState({ loading: true });
    await setDoc(doc(this.db, 'users', `${user?.uid}`), userDetails).then(
      async () => {
        const alert = await this.alertController.create({
          header: 'Gata',
          message: 'Utilizator creat cu succes!',
          buttons: ['OK'],
        });

        await alert.present();
        this.stateManagerService.updateState({ loading: false });
      }
    );
  }

  async getUserData(user: User) {
    // Get the student details from the collection "students"
    this.stateManagerService.updateState({ user, loading: true });
    const docRef = doc(this.db, 'users', `${user?.uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.getTimeTable(docSnap.data());
      this.stateManagerService.updateState({
        userDetails: docSnap.data(),
        user: user,
      });
      this.router.navigate([
        `welcome-${docSnap.data()['role'] === 'admin' ? 'admin' : 'student'}`,
      ]);
    } else {
      console.log('No user Details!');
    }
    this.stateManagerService.updateState({ loading: false });
  }

  async updateUserDetails(userDetails: any) {
    // Update the student details in the collection "students"
    this.stateManagerService.updateState({ loading: true });
    const docRef = doc(this.db, 'users', `${userDetails.id}`);
    await updateDoc(docRef, userDetails).then(async () => {
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'User updated successfully',
        buttons: ['OK'],
      });

      await alert.present();
      await this.getStudentList();
      this.stateManagerService.updateState({ loading: false });
    });
  }

  async getTimeTable(userDetails: DocumentData) {
    const year = userDetails['year'];
    const specialization = userDetails['specialization'];
    const group = userDetails['group'];
    const subGroup = userDetails['subgroup'];

    this.stateManagerService.updateState({ loading: true });
    this.stateManagerService.semestrulCurent$
      .pipe(take(1))
      .subscribe(async (semestrulCurent) => {
        const querySaptImpara = await getDocs(
          collection(
            this.db,
            'orar',
            `${specialization}/anul${year}/grupa${group}/subgrupa${subGroup}/${semestrulCurent}/saptamanaImpara`
          )
        );
        let saptamanaImpara: any = {};
        querySaptImpara.forEach((zi) => {
          saptamanaImpara[zi.id] = { ...zi.data() };
        });
        console.log('Orar Saptamana Impara:', saptamanaImpara);
        this.stateManagerService.updateState({ saptamanaImpara });

        const querySaptPara = await getDocs(
          collection(
            this.db,
            'orar',
            `${specialization}/anul${year}/grupa${group}/subgrupa${subGroup}/${semestrulCurent}/saptamanaPara`
          )
        );
        let saptamanaPara: any = {};
        querySaptPara.forEach((zi) => {
          console.log('Zi:', zi.data());
          saptamanaPara[zi.id] = { ...zi.data() };
        });
        console.log('Orar Saptamana Para:', saptamanaPara);
        this.stateManagerService.updateState({ saptamanaPara });
        this.stateManagerService.updateState({ loading: false });
      });
  }

  async getTimeTableForAdminSelection(adminSelection: any) {
    const year = adminSelection['year'];
    const specialization = adminSelection['specialization'];
    const group = adminSelection['group'];
    const subGroup = adminSelection['subGroup'];
    const semestrulSelectat = adminSelection['semestrulSelectat'];

    console.log('Admin Selection:', adminSelection);

    this.stateManagerService.updateState({ loading: true });
    const querySaptImpara = await getDocs(
      collection(
        this.db,
        'orar',
        `${specialization}/anul${year}/grupa${group}/subgrupa${subGroup}/${semestrulSelectat}/saptamanaImpara`
      )
    );
    let saptamanaImpara: any = {};
    querySaptImpara.forEach((zi) => {
      saptamanaImpara[zi.id] = { ...zi.data() };
    });
    console.log('Orar Saptamana Impara ADMIN:', saptamanaImpara);
    this.stateManagerService.updateState({
      adminSelectionSaptamanaImpara: saptamanaImpara,
    });

    const querySaptPara = await getDocs(
      collection(
        this.db,
        'orar',
        `${specialization}/anul${year}/grupa${group}/subgrupa${subGroup}/${semestrulSelectat}/saptamanaPara`
      )
    );
    let saptamanaPara: any = {};
    querySaptPara.forEach((zi) => {
      saptamanaPara[zi.id] = { ...zi.data() };
    });
    console.log('Orar Saptamana Para ADMIN:', saptamanaPara);
    this.stateManagerService.updateState({
      adminSelectionSaptamanaPara: saptamanaPara,
      loading: false,
    });
  }

  async getProfessorList() {
    // Get the professor list from the collection "profesori"
    this.stateManagerService.updateState({ loading: true });
    const querySnapshot = await getDocs(collection(this.db, 'users'));
    let profesori: any = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()['role'] === 'teacher') {
        profesori.push({ ...doc.data(), id: doc.id });
      }
    });
    this.stateManagerService.updateState({
      listaProfesori: profesori,
      loading: false,
    });
    console.log('Profesori:', profesori);
  }

  async getStudentList() {
    // Get the professor list from the collection "profesori"
    this.stateManagerService.updateState({ loading: true });
    const querySnapshot = await getDocs(collection(this.db, 'users'));
    let studenti: any = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()['role'] === 'student') {
        studenti.push({ ...doc.data(), id: doc.id });
      }
    });
    this.stateManagerService.updateState({
      listaStudenti: studenti,
      loading: false,
    });
    console.log('Studenti:', studenti);
  }

  async addTimetable(timetable: any, saptamanaSelectata: string) {
    this.stateManagerService.updateState({ loading: true });
    console.log('Timetable:', timetable);
    combineLatest([
      this.stateManagerService.filtreAdaugareOrar$,
      this.stateManagerService.semestrulSelectat$,
      this.stateManagerService.userDetails$,
    ])
      .pipe(take(1))
      .subscribe(
        async ([filtreAdaugareOrar, semestrulSelectat, userDetails]) => {
          let query = await getDocs(
            collection(
              this.db,
              'orar',
              `${filtreAdaugareOrar.specialization}/anul${filtreAdaugareOrar.year}/grupa${filtreAdaugareOrar.group}/subgrupa${filtreAdaugareOrar.subGroup}/${semestrulSelectat}/${saptamanaSelectata}`
            )
          );

          console.log(
            'Query:',
            `${filtreAdaugareOrar.specialization}/anul${filtreAdaugareOrar.year}/grupa${filtreAdaugareOrar.group}/subgrupa${filtreAdaugareOrar.subGroup}/${semestrulSelectat}/${saptamanaSelectata}`
          );

          query.forEach(async (zi) => {
            console.log('Zi:', zi.id);
            const noulOrar = timetable[saptamanaSelectata].filter(
              (item: any) => item.mappedName.toLowerCase() === zi.id
            )[0];
            console.log('noulOrar:', noulOrar);
            console.log('saptamanaSelectata:', saptamanaSelectata);
            await updateDoc(zi.ref, noulOrar);
          });

          const alert = await this.alertController.create({
            header: 'Succes',
            message: 'Orar adaugat cu succes',
            buttons: ['OK'],
          });

          await alert.present();
          await this.getTimeTable(userDetails);
          this.stateManagerService.updateState({ loading: false });
        }
      );
  }

  async getCurrentSemester() {
    // Get the current semester from the collection "semestruCurent"
    this.stateManagerService.updateState({ loading: true });
    const sem1DocRef = doc(this.db, 'semestre', 'semestrul1');
    const sem1DocSnap = await getDoc(sem1DocRef);

    const sem2DocRef = doc(this.db, 'semestre', 'semestrul2');
    const sem2DocSnap = await getDoc(sem2DocRef);

    if (sem1DocSnap.exists() && sem2DocSnap.exists()) {
      const sem1StartDate = Date.parse(sem1DocSnap.data()['startDate']);
      const sem1EndDate = Date.parse(sem1DocSnap.data()['endDate']);
      const sem2StartDate = Date.parse(sem2DocSnap.data()['startDate']);
      const currentDate = Date.now();

      if (sem1StartDate < currentDate && currentDate < sem1EndDate) {
        this.stateManagerService.updateState({
          semestrulCurent: 'semestrul1',
          loading: false,
        });
        console.log('Semestrul 1');
      } else if (currentDate > sem2StartDate) {
        this.stateManagerService.updateState({
          semestrulCurent: 'semestrul2',
          loading: false,
        });
        console.log('Semestrul 2');
      } else {
        console.log('Vacanta');
      }
    }
  }

  async addClass(classDetails: any) {
    // Add a new class in collection "classes"
    this.stateManagerService.updateState({ loading: true });
    await addDoc(collection(this.db, 'materii'), { ...classDetails }).then(
      async () => {
        const alert = await this.alertController.create({
          header: 'Succes',
          message: 'Curs adaugat cu succes',
          buttons: ['OK'],
        });

        await alert.present();
        await this.getClassesList();
        this.stateManagerService.updateState({ loading: false });
      }
    );
  }

  async deleteClass(classId: string) {
    // Delete a class from the collection "materii"
    this.stateManagerService.updateState({ loading: true });
    await deleteDoc(doc(this.db, 'materii', classId)).then(async () => {
      const alert = await this.alertController.create({
        header: 'Succes',
        message: 'Curs sters cu succes',
        buttons: ['OK'],
      });
      await alert.present();
      await this.getClassesList();
      this.stateManagerService.updateState({ loading: false });
    });
  }

  async getClassesList(materiaSelectata: any | null = null) {
    // Get the class list from the collection "classes"
    this.stateManagerService.updateState({ loading: true });
    const querySnapshot = await getDocs(collection(this.db, 'materii'));
    let materii: any = [];
    querySnapshot.forEach((doc) => {
      materii.push({ ...doc.data(), id: doc.id });
      if (materiaSelectata && doc.id === materiaSelectata?.id) {
        this.stateManagerService.updateState({ materiaSelectata: doc.data() });
      }
    });
    this.stateManagerService.updateState({
      listaMaterii: materii,
      loading: false,
    });
    if (materiaSelectata) {
    }
    console.log('Materii:', materii);
  }

  async updateClass(
    itemSelectat: string,
    materia: string,
    grupa: string,
    subgrupa: string,
    procentaj = 0
  ) {
    this.stateManagerService.updateState({ loading: true });
    console.log('addItem', itemSelectat, materia);
    const docRef = doc(this.db, 'materii', materia);
    const docSnap = await getDoc(docRef);

    const currentData = docSnap.data();
    const currentGrupa = currentData ? currentData[`grupa${grupa}`] : {};
    const currentSubgrupa =
      currentGrupa && currentGrupa[`subgrupa${subgrupa}`]
        ? currentGrupa[`subgrupa${subgrupa}`]
        : [];

    const item = currentSubgrupa
      ? currentSubgrupa.find((item: any) => item.type === itemSelectat)
      : null;
    if (item) {
      item.percentage = procentaj;
    } else {
      currentSubgrupa.push({
        type: itemSelectat,
        percentage: procentaj,
        grades: [],
      });
    }
    updateDoc(docRef, {
      ...currentData,
      [`grupa${grupa}`]: {
        ...currentGrupa,
        [`subgrupa${subgrupa}`]: currentSubgrupa,
      },
    }).then(() => this.getClassItems(materia, grupa, subgrupa));
    this.stateManagerService.updateState({ loading: false });
  }

  async getClassItems(materia: string, grupa: string, subgrupa: string) {
    console.log('getClassItems', materia, grupa, subgrupa);
    this.stateManagerService.updateState({ loading: true });
    const docRef = doc(this.db, 'materii', materia);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log('No such document!');
      return;
    }
    const currentData = docSnap.data();
    const currentGrupa = currentData ? currentData[`grupa${grupa}`] : {};
    const currentSubgrupa = currentGrupa
      ? currentGrupa[`subgrupa${subgrupa}`]
      : [];
    this.stateManagerService.updateState({
      listaElementeCurs: currentSubgrupa,
      loading: false,
    });
  }

  async addGrade(
    student: any,
    materia: any,
    grupa: any,
    subgrupa: any,
    elementCurs: string,
    grade: number
  ) {
    console.log(
      'addGrade',
      student,
      materia,
      grupa,
      subgrupa,
      elementCurs,
      grade
    );
    this.stateManagerService.updateState({ loading: true });
    const docRef = doc(this.db, 'materii', materia.id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log('No such document!');
      return;
    }
    const currentData = docSnap.data();
    const currentGrupa = currentData ? currentData[`grupa${grupa}`] : {};
    const currentSubgrupa = currentGrupa
      ? currentGrupa[`subgrupa${subgrupa}`]
      : [];
    const item = currentSubgrupa.find((item: any) => item.type === elementCurs);
    if (item) {
      item.grades.push({
        studentId: student.id,
        grade: grade,
      });
    }
    updateDoc(docRef, {
      ...currentData,
      [`grupa${grupa}`]: {
        ...currentGrupa,
        [`subgrupa${subgrupa}`]: currentSubgrupa,
      },
    }).then(() => this.getClassesList(materia));
    this.stateManagerService.updateState({ loading: false });
  }

  async publishNotificationForAdmin(
    notification: any,
    userId: string | undefined
  ) {
    this.stateManagerService.updateState({ loading: true });
    await addDoc(collection(this.db, 'admin-notifications'), {
      author: userId,
      message: notification.details,
      title: notification.title,
      resolved: false,
    }).then(async () => {
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Notification sent successfully',
        buttons: ['OK'],
      });

      await alert.present();
      this.stateManagerService.updateState({ loading: false });
    });
  }

  async markNotificationAsResolved(notification: any) {
    this.stateManagerService.updateState({ loading: true });
    await updateDoc(doc(this.db, 'admin-notifications', notification.id), {
      resolved: true,
    }).then(async () => {
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Notification marked as resolved',
        buttons: ['OK'],
      });

      await alert.present();
      await this.getAdminNotifications();
      await this.publishNotificationForUser(notification.author);
      this.stateManagerService.updateState({ loading: false });
    });
  }

  async removeNotification(notification: any, role: string) {
    this.stateManagerService.updateState({ loading: true });
    const collectionName =
      role === 'admin' ? 'admin-notifications' : 'user-notifications';
    await deleteDoc(doc(this.db, collectionName, notification.id)).then(async () => {
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Notification removed successfully',
        buttons: ['OK'],
      });

      await alert.present();
      await this.getAdminNotifications();
      await this.getUsersNotifications(notification.recipient);
      this.stateManagerService.updateState({ loading: false });
    });
  }

  async getAdminNotifications() {
    this.stateManagerService.updateState({ loading: true });
    const querySnapshot = await getDocs(collection(this.db, 'admin-notifications'));
    let notifications: any = [];
    querySnapshot.forEach((doc) => {
      notifications.push({ ...doc.data(), id: doc.id });
    });
    this.stateManagerService.updateState({ adminNotifications: notifications });
    console.log('Admin Notifications:', notifications);
    this.stateManagerService.updateState({ loading: false });
  }

  async getUsersNotifications(userId: string | undefined) {
    this.stateManagerService.updateState({ loading: true });
    const querySnapshot = await getDocs(collection(this.db, 'user-notifications'));
    let notifications: any = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()['recipient'] === userId) {
        notifications.push({ ...doc.data(), id: doc.id });
      }
    });
    this.stateManagerService.updateState({ userNotifications: notifications });
    console.log('User Notifications:', notifications);
    this.stateManagerService.updateState({ loading: false });
  }

  async publishNotificationForUser(userId: string) {
    // Add a new notification in collection "user-notifications"
    this.stateManagerService.updateState({ loading: true });
    const notification = {
      title: 'Date actualizate',
      message: 'Cererea ta de modificare a datelor personale a fost rezolvata',
      recipient: userId,
    };
    await addDoc(collection(this.db, 'user-notifications'), {
      ...notification,
    }).then(async () => {
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Notification sent successfully',
        buttons: ['OK'],
      });
      await alert.present();
    });
    this.stateManagerService.updateState({ loading: false });
  }

  async uploadCourseFile(
    materiaSelectata: any,
    pickedFile: any,
    filename: string
  ) {
    this.stateManagerService.updateState({ loading: true });
    const idMaterie = materiaSelectata.id;
    const storage = getStorage();

    // Create a storage reference from our storage service
    const storageRef = ref(storage, `courses/${idMaterie}/${filename}`);

    const metadata = {
      contentType: 'image/jpeg',
      contentDisposition: 'attachment'
    };

    uploadBytes(storageRef, pickedFile).then(() => {
      this.alertController
        .create({
          header: 'Succes!',
          message: 'Fișierul a fost încărcat cu succes!',
          buttons: ['OK'],
        })
        .then(async (alert) => {
          alert.present();
          await updateMetadata(storageRef, metadata);
          await this.getCourseFiles(materiaSelectata);
          this.stateManagerService.updateState({ loading: false });
        });
    });
  }

  async getCourseFiles(materiaSelectata: any) {
    this.stateManagerService.updateState({ loading: true });
    // Create a reference to the file we want to download
    const storage = getStorage();
    const starsRef = ref(storage, `courses/${materiaSelectata.id}`);
    let materialeCurs: any[] = [];
    listAll(starsRef).then((res) => {
      res.items.forEach((itemRef) => {
        // All the items under listRef.
        const downloadURL = getDownloadURL(itemRef).then((url) => {
          console.log('URL:', url);
          materialeCurs.push({ url, name: itemRef.name });
        });
      });
    });

    this.stateManagerService.updateState({ materialeCursSelectat: materialeCurs, loading: false});
  }

  async deleteCourseFile(materiaSelectata: any, file: any) {
    this.stateManagerService.updateState({ loading: true });
    const storage = getStorage();
    const starsRef = ref(storage, `courses/${materiaSelectata.id}/${file.name}`);
    deleteObject(starsRef).then(async () => {
      const alert = await this.alertController.create({
        header: 'Succes!',
        message: 'Fișierul a fost șters cu succes!',
        buttons: ['OK'],
      });
      await alert.present();
      await this.getCourseFiles(materiaSelectata);
      this.stateManagerService.updateState({ loading: false });
    });
  }

  clearUserState() {
    this.stateManagerService.clearState();
  }
}
