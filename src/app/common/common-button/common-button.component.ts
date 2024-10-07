import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TCommonButtonAnimationValues } from './models/common-button.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleNotch, faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-common-button',
  templateUrl: './common-button.component.html',
  styleUrls: ['./common-button.component.css'],
  standalone: true,
  imports: [CommonModule,FontAwesomeModule]
})
export class CommonButtonComponent {
  private router = inject(Router);

  isSubmitButton = input<boolean>(false);
  /**
   * @deprecated Use {@link #buttonClass} instead
   */
  buttonType = input<'filled' | 'outline'>('filled');
  buttonClass = input<string>('');
  text = input<string | undefined>();
  prefix = input<boolean>(false); // Boolean value to determine whether to display icon on beginning of the button if false it show at end and if true it show at beginning
  icon = input<'fa' | undefined>(undefined);
  iconClass = input<string>('text-white');
  isLoading = input<boolean | undefined>(false);
  loaderColor = input<string>('white');
  animation = input<TCommonButtonAnimationValues>(false); // Boolean value to determine whether to display animation to a button
  disabled = input<boolean>(false);
  loaderSize = input<string>('base');
  tooltip = input<string>('');
  navigateTo = input<string | undefined>(undefined);
  downloadLink = input<string>();

  faCircleNotch = faCircleNotch;
  faSpinner = faSpinner;

  @Output() clickEmit = new EventEmitter();

  buttonClick() {
    const pathArray = this.navigateTo()
      ?.split('/')
      .filter((p) => !!p);
    if (this.navigateTo() && pathArray) {
      this.router.navigate(pathArray);
    }
    this.clickEmit.emit();
    if (this.downloadLink()) {
      this.downloadFile(this.downloadLink() as string);
    }
  }

  downloadFile(fileUrl: string, fileName: string = 'download'): void {
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.target = '_blank';
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}
