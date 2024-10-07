import { Component, OnInit } from '@angular/core';
import { CommonInputComponent } from '../../common/common-input/common-input.component';

@Component({
  standalone:true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonInputComponent]
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
