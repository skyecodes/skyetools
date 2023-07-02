import {Component, OnDestroy} from '@angular/core';
import {MatDrawerMode} from "@angular/material/sidenav";
import {BreakpointObserver} from '@angular/cdk/layout';
import {Subject, takeUntil} from "rxjs";
import packageJson from '../../package.json';
import {faGithub, faTwitter} from "@fortawesome/free-brands-svg-icons";

const breakpoint = '(max-width: 576px)'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  destroyed = new Subject<void>();
  sidenavOpened!: boolean
  sidenavMode!: MatDrawerMode
  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([breakpoint])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (query == breakpoint && result.breakpoints[query]) {
            this.sidenavOpened = false
            this.sidenavMode = 'over';
          } else {
            this.sidenavOpened = true
            this.sidenavMode = 'side';
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  protected readonly packageJson = packageJson;
  protected readonly faTwitter = faTwitter;
  protected readonly faGithub = faGithub;
}
