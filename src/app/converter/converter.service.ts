import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {observeEventSource, ProgressMessage} from "../common/utils";

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  source: EventSource | undefined

  constructor(private http: HttpClient, private zone: NgZone) {
  }

  convert(inputFile: File, format: string): Observable<string> {
    let data = new FormData();
    data.append('file', inputFile);
    data.append('ext', format);
    return this.http.post<string>(environment.apiUrl + '/converter/process', data);
  }

  getProgress(processId: string): Observable<ProgressMessage> {
    this.source = new EventSource(environment.apiUrl + '/converter/' + processId + '/progress');
    return observeEventSource(this.source, this.zone);
  }

  closeEventSource(): void {
    if (!this.source) return;
    this.source.close();
    this.source = undefined;
  }
}
