import { Component, OnInit } from '@angular/core';
import { CustomService } from './custom.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'SpaceX';

 STABLE_FEATURE: boolean;
//  EXPERIMENTAL_FEATURE: boolean;
  data: any = [];
  years = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
  ];
  booleans = [true, false];

  launchSuccess: any;
  landingSuccess: any;
  year: any;

  constructor(private http: CustomService, private location: Location) { }

  ngOnInit(): void {
    this.loadData();
    
  }

  loadData() {
    this.http.getlaunches().subscribe((data) => {
      this.data = data;
      this.location.go('launches?limit=100&launch_success=true');
    });
  }

  onYearSelect(e) {
    this.data = [];
    this.year = e;
    this.http
      .getOnyearSelect(this.year)
      .subscribe((data) => {
        this.data = data;
      });
  }

  onSuccessfulLaunch(e) {
    this.data = [];
    this.launchSuccess = e;

    this.http
      .getOnSuccessfulLaunch(e, this.year)
      .subscribe((data) => {
        this.data = data;
      });
  }

  onSuccessfulLanding(e) {
    this.landingSuccess = e;
    this.data = [];
      this.http.getOnLaunchLanding(this.launchSuccess, this.landingSuccess, this.year)
        .subscribe(data => {
          this.data = data
        });
  }

  reset() {
    this.ngOnInit();
    this.year = null;
  }
}
