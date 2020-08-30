import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  stu: {Enrol_no: string, Name: string, Enrol_year: number, Department: string} = {Enrol_no:"", Name:"", Enrol_year:0, Department:""}
  student: []
  constructor(public db: AngularFirestore) { }

  ngOnInit(): void {
  }

  addStudent(){
    this.db.collection("Student").add(this.stu);
    this.stu = {Enrol_no:"", Name:"", Enrol_year:0, Department:""}
  }

}
