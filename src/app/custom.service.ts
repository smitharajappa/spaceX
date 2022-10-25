import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StateKey, makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CustomService {

  baseUrl = 'https://api.spacexdata.com/v3';

  constructor(
    private httpClient: HttpClient,
    private location: Location,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  get<T>(path: string, params?: HttpParams): Observable<T> {
    const transferKey: StateKey<T> = makeStateKey(`${path}?${params != null ? params.toString() : ''}`);

    if (this.transferState.hasKey(transferKey)) {
      return of(this.transferState.get<any>(transferKey, 0))
        .pipe(
          tap(() => this.transferState.remove(transferKey))
        );
    } else {
      return this.httpClient.get<T>(path, { observe: 'body', responseType: 'json', params })
        .pipe(
          tap(response => {
            if (isPlatformServer(this.platformId)) {
              this.transferState.set<T>(transferKey, response);
            }
          })
        );
    }
  }

  getlaunches() {
    this.location.go('launches?limit=100&launch_success=true');
    return this.httpClient.get(this.baseUrl +'/launches?limit=100');

  }

  getOnyearSelect(year){
    this.location.go('launches?limit=100' + '&launch_year=' + year);
    return this.httpClient.get(this.baseUrl +'/launches?limit=100' + `&launch_year=${year}`);
  }

  getOnSuccessfulLaunch(launch, year){
    if (!year){
      this.location.go(
        'launches?limit=100&launch_success=' + launch
      );
      return this.httpClient.get(this.baseUrl +'/launches?limit=100' + `&launch_success=${launch}`);
    }else { 
      this.location.go(
        'launches?limit=100&launch_success=' +
        launch +
        '&launch_year=' +
       year
      );
      return this.httpClient.get(this.baseUrl +'/launches?limit=100'
    + `&launch_success=${launch}&launch_year=${year}`); }
  }

  getOnLaunchLanding(launch, landing, year) {
    if(!year && launch) {
      this.location.go(
        'launches?limit=100&launch_success=' +
        launch +
        '&land_success=' +
        landing
      );
      return this.httpClient.get(this.baseUrl +'/launches?limit=100' +
      `&launch_success=${launch}&land_success=${landing}`)
    } else {
      this.location.go(
        'launches?limit=100&launch_success=true' +
        '&land_success=' +
        landing +
        '&launch_year=' +
        year
      );
      return this.httpClient.get(this.baseUrl +'/launches?limit=100' +
    `&launch_success=true&land_success=${landing}&launch_year=${year}`)}
  }
}
