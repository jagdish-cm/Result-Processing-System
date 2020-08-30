import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { StudentComponent } from './student/student.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { ToolbarComponent } from './dashboard/toolbar/toolbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatListModule} from '@angular/material/list';
import {MatSortModule} from '@angular/material/sort';
import { SidenavComponent } from './dashboard/sidenav/sidenav.component';
import {MatIconModule} from '@angular/material/icon';

import { CourseComponent } from './course/course.component';
import { MarksComponent } from './marks/marks.component';
import { ResultComponent } from './result/result.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import 'firebase/firestore';
import { AngularFireAuthModule} from '@angular/fire/auth'

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    ToolbarComponent,
    SidenavComponent,
    CourseComponent,
    MarksComponent,
    ResultComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,

  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
