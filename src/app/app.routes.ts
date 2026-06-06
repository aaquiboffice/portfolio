import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '',           component: HomeComponent, title: 'Mohd Aaquib Rodde — MEAN Stack Developer' },
  { path: 'about',      component: HomeComponent, title: 'About — Aaquib Rodde' },
  { path: 'experience', component: HomeComponent, title: 'Experience — Aaquib Rodde' },
  { path: 'education',  component: HomeComponent, title: 'Education — Aaquib Rodde' },
  { path: 'projects',   component: HomeComponent, title: 'Projects — Aaquib Rodde' },
  { path: 'contact',    component: HomeComponent, title: 'Contact — Aaquib Rodde' },
  { path: '**',         redirectTo: '' }
];
