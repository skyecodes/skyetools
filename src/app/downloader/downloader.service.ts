import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DownloaderService {
  constructor(private http: HttpClient) {
  }

  download(data: any) {
    let body = {
      url: data.url,
      type: data.type,
      quality: data.quality,
      size: data.size,
      preferFreeFormats: data.preferFreeFormats
    }
    return this.http.post(environment.apiUrl + '/downloader/download', body, {responseType: 'blob', observe: 'response'});
  }
}
