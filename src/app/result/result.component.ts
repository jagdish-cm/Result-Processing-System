import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {MatTableDataSource} from '@angular/material/table';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent implements OnInit {
  displayedColumns = ['courseno', 'title', 'thMarks', 'pracMarks', 'midMarks', 'grdpt', 'crdpt'];
  displayedColumnsB = ['courseno', 'title', 'thMarks', 'pracMarks', 'midMarks', 'grdpt', 'crdpt'];
  dataSource = new MatTableDataSource(COURSE_DATA);
  dataSourceB = new MatTableDataSource(BACK_DATA)
  clicked = false;
  stu;
  showBack = 0
  result: {Enrol_no: string, Year: number, Semester: number, Obtained_credits: number, Total_credits: number, Year_back_status: string, SGPA: number, OGPA: number, Current_back: Array<string> , Total_back: Array<string> } = {Enrol_no: "", Year: 0, Semester: 0, Obtained_credits: 0, Total_credits: 0, Year_back_status: "", SGPA: 0, OGPA: 0, Current_back: [], Total_back: []}
  semCourses = []
  semMarks;
  stuRes = []
  allSem = []
  ogpa = 0
  constructor(public db: AngularFirestore) { }

  ngOnInit(): void {
  }
  
  showResult(){
    this.semCourses = []
    this.semMarks = {}

    //Get student details
    this.db.collection('Student', ref=>ref.where('Enrol_no', '==', this.result.Enrol_no))
    .snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
    .subscribe(res=>{
      this.stu = res
    })

    let enrol = Number(this.result.Enrol_no.substring(0,4))
    
    //Get courses
    this.db.collection('Course', ref=>ref
    .where('Semester', '==', this.result.Semester)
    .where('Enrol_year', '==', enrol))
    .snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
    .subscribe(res=>{
      this.semCourses = res
    })

    //Get marks details
    this.db.collection('Marks', ref=>ref
    .where('Semester', '==', this.result.Semester)
    .where('Enrol_no', '==', this.result.Enrol_no))
    .snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
    .subscribe(res=>{
      this.semMarks = res
      this.getMarks();
    }) 
  }

  

  getMarks(){
    this.clicked = true
    COURSE_DATA = [];
    BACK_DATA = [];
    let courseMarks = this.semMarks[0].Courses
    console.log(this.semMarks[0].Backlog_prac)
    console.log(this.semMarks[0].Backlog_theory)
    for (const crs of courseMarks) {
      let course = this.semCourses.filter(elem=>elem.Course_id == crs.Course_id)
      let grd = (crs.Midterm + crs.Practical + crs.Theory)/10 
      let crdp = Math.round((grd*course[0].Total_credits)*100)/100
      let obj = {
        courseno: crs.Course_id,
        title: crs.Course_name,
        thMarks: crs.Theory,
        pracMarks: crs.Practical,
        midMarks: crs.Midterm,
        grdpt: grd,
        crdpt: crdp,
      }
      
      if(this.semMarks[0].Backlog_prac.indexOf(crs.Course_id)>-1){
        BACK_DATA.push(obj)
      }

      else if(this.semMarks[0].Backlog_theory.indexOf(crs.Course_id)>-1){
        BACK_DATA.push(obj)
      }

      else{
        COURSE_DATA.push(obj)
      }
    }
    this.dataSource = new MatTableDataSource(COURSE_DATA)
    this.dataSourceB = new MatTableDataSource(BACK_DATA)
    this.showBack = BACK_DATA.length
    for(let i=1; i<=this.result.Semester; i++){
      this.db.collection('Marks', ref=>ref
      .where('Semester', '==', i)
      .where('Enrol_no', '==', this.result.Enrol_no))
      .snapshotChanges()
      .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
      )
      .subscribe(res=>{
        this.allSem.push(res)
        this.calcOgpa()
      })
    }
  }

  calcOgpa(){
    this.ogpa = 0
    for (const sem of this.allSem) {
      this.ogpa +=sem[0].SGPA
    }
    this.ogpa = Math.round((this.ogpa/this.result.Semester)*100)/100
    
  }

  
}

export interface Result{
  courseno: string,
  title: string,
  thMarks: number,
  pracMarks: number,
  midMarks: number,
  grdpt: number,
  crdpt: number
}

let COURSE_DATA: Result[] = [];
let BACK_DATA: Result[] = [];
