import {Injectable} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {Observable} from "rxjs";

const breakpoint = '(max-width: 768px)'

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private observer: Observable<any>;
  public isSmall: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.observer = this.breakpointObserver.observe([breakpoint])
    this.isSmall = new Observable<boolean>(subscriber => {
      this.observer.subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (query == breakpoint) {
            subscriber.next(result.breakpoints[query]);
          }
        }
      });
    });

  }
}
