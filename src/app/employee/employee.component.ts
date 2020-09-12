import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  candidateList: any[] = [];
  isAscending = false;
  departmentSummaryList: any[] = [];
  seniorCandidateList: any[] = [];
  searchValue: string = '';

  constructor() {
    this.candidateList = [
      { id: 11, name: 'Ash', department: 'Finance', joining_date: '8/10/2016' },
      { id: 12, name: 'John', department: 'HR', joining_date: '18/1/2011' },
      {
        id: 13,
        name: 'Zuri',
        department: 'Operations',
        joining_date: '28/11/2019',
      },
      {
        id: 14,
        name: 'Vish',
        department: 'Development',
        joining_date: '7/7/2017',
      },
      {
        id: 15,
        name: 'Barry',
        department: 'Operations',
        joining_date: '19/8/2018',
      },
      { id: 16, name: 'Ady', department: 'Finance', joining_date: '5/10/2014' },
      {
        id: 17,
        name: 'Gare',
        department: 'Development',
        joining_date: '6/4/2014',
      },
      {
        id: 18,
        name: 'Hola',
        department: 'Development',
        joining_date: '8/12/2010',
      },
      { id: 19, name: 'Ola', department: 'HR', joining_date: '7/5/2011' },
      {
        id: 20,
        name: 'Kim',
        department: 'Finance',
        joining_date: '20/10/2010',
      },
    ];
  }

  ngOnInit(): void {}

  /**
   * sort candidate by name and joining date
   *
   * @param {string} key
   * @memberof EmployeeComponent
   */
  sortCandiates(key: string) {
    this.isAscending = !this.isAscending;
    this.candidateList = this.candidateList.sort((a, b) => {
      if (key === 'joining_date') {
        const newFirstDate = this.covertIntoDateFormat(a[key]);
        const newSecondDate = this.covertIntoDateFormat(b[key]);
        return newFirstDate.getTime() > newSecondDate.getTime()
          ? this.isAscending
            ? 1
            : -1
          : newFirstDate.getTime() < newSecondDate.getTime()
          ? this.isAscending
            ? -1
            : 1
          : 0;
      }
      return a[key] > b[key]
        ? this.isAscending
          ? 1
          : -1
        : a[key] < b[key]
        ? this.isAscending
          ? -1
          : 1
        : 0;
    });
  }

  /**
   * find the department count
   *
   * @memberof EmployeeComponent
   */
  getDepartmentCountClickHandle() {
    this.resetData();
    for (let index = 0; index < this.candidateList.length; index++) {
      const deptIndex = this.departmentSummaryList.findIndex(
        (dept) => dept.name === this.candidateList[index].department
      );
      if (deptIndex > -1) {
        this.departmentSummaryList[deptIndex].count =
          this.departmentSummaryList[deptIndex].count + 1;
      } else {
        this.departmentSummaryList.push({
          name: this.candidateList[index].department,
          count: 1,
        });
      }
    }
  }

  /**
   * find the empolyee wxperience greater than 2 years.
   *
   * @memberof EmployeeComponent
   */
  expGrterClickHandle() {
    this.resetData();
    const currentDate: any = new Date();
    this.candidateList.forEach((element: any) => {
      const ele_date: any = this.covertIntoDateFormat(element.joining_date);
      const d_Days = Math.ceil(
        Math.abs(currentDate - ele_date) / (1000 * 60 * 60 * 24)
      );
      if (d_Days > 730) {
        this.seniorCandidateList.push(element);
      }
    });
  }
  /**
   * remove development candidate function
   *
   * @memberof EmployeeComponent
   */
  removeDevCandidatesClickHandle() {
    this.candidateList = this.candidateList.filter(
      (candidate) => candidate.department.toLowerCase() != 'development'
    );
  }

  /**
   *convert string into date
   *
   * @param {string} value
   * @returns
   * @memberof EmployeeComponent
   */
  covertIntoDateFormat(value: string) {
    const dates = value.split('/');
    return new Date(dates[1] + '/' + dates[0] + '/' + dates[2]);
  }

  /**
   * reset Data
   *
   * @memberof EmployeeComponent
   */
  resetData() {
    this.seniorCandidateList = [];
    this.departmentSummaryList = [];
  }
}
