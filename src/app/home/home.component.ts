import {Component} from '@angular/core';
import {ResponsiveService} from "../responsive.service";
import {links} from "../constants";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  itemLines!: number;
  protected readonly links = links;

  constructor(responsiveService: ResponsiveService) {
    responsiveService.isSmall.subscribe(isSmall => {
      this.itemLines = isSmall ? 3 : 2;
    })
  }
}
