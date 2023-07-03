import {Component} from '@angular/core';
import {ResponsiveService} from "../responsive.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  itemLines!: number;

  constructor(responsiveService: ResponsiveService) {
    responsiveService.isSmall.subscribe(isSmall => {
      this.itemLines = isSmall ? 3 : 2;
    })
  }
}
