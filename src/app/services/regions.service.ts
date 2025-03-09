import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Region } from '../models/region';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegionsService {
  constructor(private http: HttpClient) {}

  getRegions = (): Observable<Region[]> => {
    return this.http
      .get<{
        data: Region[];
      }>(`${environment.apiUrl}/6f1504b8-a375-48cc-9ce2-27366b264581`)
      .pipe(map((response) => response.data));
  };
}
