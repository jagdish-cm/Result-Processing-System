import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { StudentComponent } from './student/student.component';
import { CourseComponent } from './course/course.component';
import { MarksComponent } from './marks/marks.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  {path: 'student', component: StudentComponent},
  {path: 'course', component: CourseComponent},
  {path: 'marks', component: MarksComponent},
  {path: 'result', component: ResultComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
