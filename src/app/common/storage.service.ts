import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  download(fileId: string) {
    let link = document.createElement('a');
    link.href = environment.apiUrl + '/storage/' + fileId;
    link.click();
  }
}
