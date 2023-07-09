import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http: HttpClient) {
  }

  download(fileId: string) {
    return this.http.get(environment.apiUrl + '/storage/' + fileId, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(tap(response => {
      let downloadUrl = window.URL.createObjectURL(response.body!);
      let filename = response.headers.get('Content-Disposition')!.substring(22);
      filename = filename.substring(0, filename.length - 1);
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.click();
    }));
  }
}
