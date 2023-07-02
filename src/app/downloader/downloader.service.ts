import {Injectable, NgZone} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

export interface DownloadProgress {
  isCompleted: boolean
  progress: number
  fileId: string
}

export interface DownloadProgress {
  isCompleted: boolean
  progress: number
  fileId: string
}

@Injectable({
  providedIn: 'root'
})
export class DownloaderService {
  source: EventSource | undefined

  constructor(private http: HttpClient, private zone: NgZone) {
  }

  process(data: any): Observable<DownloadProgress> {
    let query = new URLSearchParams({
      data: JSON.stringify({
        url: data.url,
        type: data.type,
        quality: data.quality,
        size: data.size,
        preferFreeFormats: data.preferFreeFormats
      })
    }).toString();
    this.source = new EventSource(environment.apiUrl + '/downloader/process?' + query)
    return new Observable<DownloadProgress>(subscriber => {
      this.source!.onerror = error => {
        this.zone.run(() => subscriber.error(error));
      }
      this.source!.addEventListener("progress", data => {
        this.zone.run(() => subscriber.next(JSON.parse(data.data)));
      })
      this.source!.addEventListener("err", data => {
        this.zone.run(() => subscriber.error(data.data));
      })
    })
  }

  download(fileId: string) {
    return this.http.get(environment.apiUrl + '/downloader/download?fileId=' + fileId, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  closeEventSource(): void {
    if (!this.source) return;
    this.source.close();
    this.source = undefined;
  }
}
