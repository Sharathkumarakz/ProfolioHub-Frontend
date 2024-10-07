import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TabSwitchComponent } from '../tab-switch/tab-switch.component';

@Component({
  standalone: true,
  selector: 'app-common-content-layout',
  templateUrl: './common-content-layout.component.html',
  styleUrls: ['./common-content-layout.component.scss'],
  imports:[RouterOutlet,HeaderComponent,SidebarComponent,TabSwitchComponent]
})
export class CommonContentLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
