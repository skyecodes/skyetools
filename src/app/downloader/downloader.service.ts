import {Injectable, NgZone} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {observeEventSource, ProgressMessage} from "../common/utils";

@Injectable({
  providedIn: 'root'
})
export class DownloaderService {
  source: EventSource | undefined

  constructor(private http: HttpClient, private zone: NgZone) {
  }

  process(formData: any): Observable<string> {
    let data = {
      url: formData.url,
      type: formData.type,
      quality: formData.quality,
      size: formData.size,
      preferFreeFormats: formData.preferFreeFormats
    };
    return this.http.post<string>(environment.apiUrl + '/downloader/process', data);
  }

  getProgress(processId: string): Observable<ProgressMessage> {
    this.source = new EventSource(environment.apiUrl + '/downloader/' + processId + '/progress');
    return observeEventSource(this.source, this.zone);
  }

  closeEventSource(): void {
    if (!this.source) return;
    this.source.close();
    this.source = undefined;
  }
}
