import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  course: {Course_id: string, Course_name: string, Enrol_year: number, Year: number, Semester: number, Theory_credits: number, Practical_credits: number, Total_credits: number, Max_mid: number, Max_prac: number, Max_theory: number, Passing_prac: number, Passing_theory: number} = {Course_id: "", Course_name: "", Enrol_year: 0, Year: 0, Semester: 0, Theory_credits: 0, Practical_credits: 0, Total_credits: 0, Max_mid: 0, Max_prac: 0, Max_theory: 0, Passing_prac: 0, Passing_theory: 0};
  
  constructor(public db: AngularFirestore) { }

  ngOnInit(): void {
  }

  addCourse(){
    this.course.Year = Number(this.course.Year)
    this.course.Enrol_year = Number(this.course.Enrol_year)
    this.course.Semester = Number(this.course.Semester)
    this.course.Total_credits = this.course.Theory_credits + this.course.Practical_credits;
    if((this.course.Theory_credits==3 || this.course.Theory_credits==2 || this.course.Theory_credits==1) && (this.course.Practical_credits==1 || this.course.Practical_credits==2)){
      this.course.Max_mid = 20;
      this.course.Max_prac = 30;
      this.course.Max_theory = 50;
      this.course.Passing_prac = 12;
      this.course.Passing_theory = 28;
    }

    else if((this.course.Theory_credits==3 || this.course.Theory_credits==2 || this.course.Theory_credits==1) && this.course.Practical_credits==0){
      this.course.Max_mid = 20;
      this.course.Max_prac = 0;
      this.course.Max_theory = 80;
      this.course.Passing_prac = 0;
      this.course.Passing_theory = 40;
    }
    else if(this.course.Theory_credits==0 && (this.course.Practical_credits==1 || this.course.Practical_credits==2)){
      this.course.Max_mid = 20;
      this.course.Max_prac = 80;
      this.course.Max_theory = 0;
      this.course.Passing_prac = 40;
      this.course.Passing_theory = 0;
    }
    this.db.collection("Course").add(this.course);
    this.course = {Course_id: "", Course_name: "", Enrol_year: 0, Year: 0, Semester: 0, Theory_credits: 0, Practical_credits: 0, Total_credits: 0, Max_mid: 0, Max_prac: 0, Max_theory: 0, Passing_prac: 0, Passing_theory: 0};
  }

}
