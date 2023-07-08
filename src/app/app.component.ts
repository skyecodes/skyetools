import {Component, OnDestroy, ViewChild} from '@angular/core';
import {MatDrawerMode, MatSidenav} from "@angular/material/sidenav";
import {Subject, takeUntil} from "rxjs";
import packageJson from '../../package.json';
import {faGithub, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {ResponsiveService} from "./common/responsive.service";
import {links} from "./common/utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  destroyed = new Subject<void>();
  sidenavOpened!: boolean
  sidenavMode!: MatDrawerMode
  @ViewChild('sidenav') sidenav!: MatSidenav;
  protected readonly links = links

  constructor(responsiveService: ResponsiveService) {
    responsiveService.isSmall
      .pipe(takeUntil(this.destroyed))
      .subscribe(isSmall => {
        if (isSmall) {
          this.sidenavOpened = false
          this.sidenavMode = 'over';
        } else {
          this.sidenavOpened = true
          this.sidenavMode = 'side';
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

  closeSidenavIfSmall() {
    if (this.sidenavMode == 'over') this.sidenav.close()
  }
}
