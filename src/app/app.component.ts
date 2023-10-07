import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDrawerMode, MatSidenav} from "@angular/material/sidenav";
import {Subject, takeUntil} from "rxjs";
import packageJson from '../../package.json';
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {ResponsiveService} from "./common/responsive.service";
import {links, themes} from "./common/utils";
import {ThemeService} from "./common/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  destroyed = new Subject<void>();
  sidenavOpened!: boolean
  sidenavMode!: MatDrawerMode
  @ViewChild('sidenav') sidenav!: MatSidenav;
  currentTheme!: string;
  protected readonly links = links
  protected readonly themes = themes;

  constructor(private responsiveService: ResponsiveService, private themeService: ThemeService) {
    this.responsiveService.isSmall
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
    this.currentTheme = localStorage.getItem('theme') || 'purple-green'
    this.themeService.setTheme(this.currentTheme);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  protected readonly packageJson = packageJson;
  protected readonly faGithub = faGithub;

  closeSidenavIfSmall() {
    if (this.sidenavMode == 'over') this.sidenav.close()
  }

  changeTheme(theme: string) {
    this.themeService.setTheme(theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
  }
}
