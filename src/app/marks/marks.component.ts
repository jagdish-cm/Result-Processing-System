import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.scss']
})
export class MarksComponent implements OnInit {
  form: FormGroup
  isdisabled = true;
  courses: FormArray
  marks: {Enrol_no: string, Year: number, Semester: number, App_year: number} = {Enrol_no: "",  Year: 0, Semester: 0, App_year: 0}
  courseDet: any
  semCourses = []
  backCourses = []
  noOfCrs = 0
  back = []
  constructor(public db: AngularFirestore, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm()
  }

  getCourses(){
    return (this.form.get('courses') as FormArray).controls
  }

  createForm(){
    this.form = this.fb.group({
      courses: this.fb.array([])
    })
  }

  createCourse(name, id){
    return this.fb.group({
      courseId: [id],
      courseName: [name],
      midMarks: [null],
      pracMarks: [null],
      thrMarks: [null]
    })
  }

  addCourse(name, id){
    this.courses = this.form.get('courses') as FormArray;
    this.courses.push(this.createCourse(name, id))
  }

  enterMarks(){
    this.isdisabled = false 
    this.semCourses = []
    let enrol = Number(this.marks.Enrol_no.substring(0,4))

    // Get all courses of the sem
    this.db.collection('Course', ref=>ref
    .where('Enrol_year', '==', Number(this.marks.App_year-this.marks.Year+1))
    .where('Semester', '==', Number(this.marks.Semester)))
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
      this.noOfCrs = this.semCourses.length
      console.log(this.noOfCrs)
      if(this.marks.Semester==1 || this.marks.Semester==2){
        this.addCourseToForm();
      }
    })

  
    // Get back courses
    this.backCourses = []
    this.back = []
    let sems = []
    if(this.marks.Semester%2==0){
      for(let i=2; i<this.marks.Semester; i+=2){
        sems.push(i)
      }
    }
    else{
      for(let i=1; i<this.marks.Semester; i+=2){
        sems.push(i)
      }
    }

    let once = false
    for (const s of sems) {
      this.db.collection('Marks', ref=>ref
      .where('Enrol_no', '==', this.marks.Enrol_no)
      .where('Semester', '==' , s))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
      .subscribe(res=>{
        for (const p of res[0].Backlog_prac) {
          this.backCourses.push(p)
        }

        for (const p of res[0].Backlog_theory) {
          this.backCourses.push(p)
        }

        if(this.backCourses.length==0){
          if(!once){
            once = true
            this.addCourseToForm();
          }
          
        }
        else{
        for(const b of this.backCourses){
          this.db.collection('Course', ref=>ref
          .where('Course_id', '==', b)
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
            this.semCourses.push(res[0])
            this.addCourseToForm()
          })
        }
        }
      })
      
    }
  }

  addCourseToForm(){
    if(this.semCourses.length == this.noOfCrs+this.backCourses.length){
      for (const course of this.semCourses) {
          this.addCourse(course.Course_name, course.Course_id)
      }

    }
  }

  
 
  addMarks(){
    let mark = {
      Enrol_no: this.marks.Enrol_no,
      Semester: Number(this.marks.Semester),
      Year: Number(this.marks.Year),
      Courses: [],
      Backlog_prac: [],
      Backlog_theory: [],
      SGPA: 0,
    }
    let obtCreds = 0
    let totCreds = 0
    for (const crs of this.form.value.courses) {
      let obj = {
        Course_id: crs.courseId,
        Course_name: crs.courseName,
        Midterm: crs.midMarks,
        Practical: crs.pracMarks,
        Theory: crs.thrMarks,
      }
      let crsDet = this.semCourses.find(o=>o.Course_id==crs.courseId)
      let tot_prac;
      let tot_thr;
      if(crsDet.Theory_credits==0){
        tot_thr = 0
        tot_prac = crs.midMarks + crs.pracMarks
      }
      else if(crsDet.Practical_credits==0){
        tot_prac = 0
        tot_thr = crs.midMarks + crs.thrMarks
      }

      else{
        tot_thr = crs.midMarks + crs.thrMarks
        tot_prac = crs.pracMarks
      }

      obtCreds += Math.round(((tot_prac + tot_thr)*(crsDet.Total_credits)/10)*100)/100
      totCreds += crsDet.Total_credits
      mark.Courses.push(obj)

      if(tot_prac<crsDet.Passing_prac){
        mark.Backlog_prac.push(crsDet.Course_id)
      }

      if(tot_thr<crsDet.Passing_theory){
        mark.Backlog_theory.push(crsDet.Course_id)
      }

    }
    mark.SGPA = Math.round((obtCreds/totCreds)*100)/100
    this.db.collection('Marks').add(mark)    
  }
}