import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'email-verification',
    loadComponent: () => import('./email-verification/email-verification.page').then( m => m.EmailVerificationPage)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.page').then( m => m.ResetPasswordPage)
  },
  {
    path: 'welcome-student',
    loadComponent: () => import('./welcome-student/welcome-student.page').then( m => m.WelcomeStudentPage),
    canActivate: [AdminGuard]
  },
  {
    path: 'add-student',
    loadComponent: () => import('./add-student/add-student.page').then( m => m.AddStudentPage),
  },
  {
    path: 'add-teacher',
    loadComponent: () => import('./add-teacher/add-teacher.page').then( m => m.AddTeacherPage),
  },
  {
    path: 'add-timetable',
    loadComponent: () => import('./add-timetable/add-timetable.page').then( m => m.AddTimetablePage),
  },
  {
    path: 'add-classes',
    loadComponent: () => import('./add-classes/add-classes.page').then( m => m.AddClassesPage)
  },
  {
    path: 'timetable-select',
    loadComponent: () => import('./add-timetable/timetable-select/timetable-select.page').then( m => m.TimetableSelectPage)
  },
  {
    path: 'change-user-data',
    loadComponent: () => import('./change-user-data/change-user-data.page').then( m => m.ChangeUserDataPage)
  },
  {
    path: 'welcome-admin',
    loadComponent: () => import('./welcome-admin/welcome-admin.page').then( m => m.WelcomeAdminPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage),
    children: [
      {
        path: '',
        redirectTo: 'select-item',
        pathMatch: 'full',
      },
      {
        path: 'select-item',
        loadComponent: () => import('./profile/select-item/select-item.page').then( m => m.SelectItemPage)
      },
      {
        path: 'general',
        loadComponent: () => import('./profile/general/general.page').then( m => m.GeneralPage)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./profile/notifications/notifications.page').then( m => m.NotificationsPage)
      },
      {
        path: 'payment',
        loadComponent: () => import('./profile/payment/payment.page').then( m => m.PaymentPage)
      },
    ]
  },
  {
    path: 'add-grading-system',
    loadComponent: () => import('./add-grading-system/add-grading-system.page').then( m => m.AddGradingSystemPage),
  },
  {
    path: 'grade-item',
    loadComponent: () => import('./add-grading-system/grade-item/grade-item.page').then( m => m.GradeItemPage),
    children: [
      {
        path: '',
        redirectTo: 'select-group',
        pathMatch: 'full',
      },
      {
        path: 'select-group',
        loadComponent: () => import('./add-grading-system/select-group/select-group.page').then( m => m.SelectGroupPage)
      },
      {
        path: 'course-items',
        loadComponent: () => import('./add-grading-system/course-items/course-items.page').then( m => m.CourseItemsPage)
      },
      {
        path: 'grades-list',
        loadComponent: () => import('./add-grading-system/grades-list/grades-list.page').then( m => m.GradesListPage)
      },
    ]
  },
];
