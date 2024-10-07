
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ControlMessageComponent } from '../control-message/control-message.component';
import { CommonButtonComponent } from '../common-button/common-button.component';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'app-common-input',
  templateUrl: './common-input.component.html',
  styleUrls: ['./common-input.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ControlMessageComponent,
    CommonButtonComponent,
    MatTooltipModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonInputComponent),
      multi: true,
    },
  ],
})
export class CommonInputComponent implements ControlValueAccessor {
  // sharedService = inject(SharedService);

  inputType = input<'text' | 'password' | 'search' | 'number' | 'otp4digit'>(
    'text'
  );
  customClasses = input<string>('');

  placeholder = input<string>('');
  hasBoarder = input<boolean>(true);
  autofocus = input<boolean>(false);
  hideText = input<boolean>(false);
  disableCopyPaste = input<boolean>(false);


  filledBackground = input<boolean>(false);
  roundedCorners = input<boolean>(false);
  disableTooltip = input<boolean>(false);
  maxLength = input<string>('');
  control = input<FormControl>(new FormControl(''));
  @Input() set placeholdersList(placeholders:string[]){
    this.placeholdersListData = placeholders;
    this.placeholdersAnimate(this.placeholdersListData);
  } ;
  placeholdersListData:string[] = [];
  otp4digits = ['', '', '', ''];

  faEye = faEye;
  faEyeSlash =  faEyeSlash;

  @ViewChildren('otpRef') otpRefs!: QueryList<ElementRef<HTMLInputElement>>;

  @Output() valueChangeEvent: EventEmitter<number | string> =
    new EventEmitter();

  @Output() clearEvent: EventEmitter<void> = new EventEmitter();
  @Output() keyUpEvent: EventEmitter<KeyboardEvent> = new EventEmitter();

  changeDetectorRef = inject(ChangeDetectorRef);

  inputValue: number | string = '';
  passwordVisible = false;
  inputDisabled = false;
  hasErrorInControl = false;
  placeholderAnimationTimerRef?: ReturnType<typeof setInterval>;
  animationPlaceholder?:string = undefined;

  placeholdersAnimate(placeholders: string[]) {
    let currPlaceholderIndex = 0;
    let currPlaceholderLetterIndex = 0;
    let isClearing = false;
    let isReadSleep = false;
  
    if (this.placeholderAnimationTimerRef) {
      clearInterval(this.placeholderAnimationTimerRef);
      this.placeholderAnimationTimerRef = undefined;
    }
  
    this.placeholderAnimationTimerRef = setInterval(() => {
      if(isReadSleep) return;
      if (isClearing) {
        if (currPlaceholderLetterIndex > 0) {
          currPlaceholderLetterIndex -= 1;
        } else {
          isClearing = false;
          currPlaceholderIndex += 1;
  
          if (currPlaceholderIndex >= placeholders.length) {
            currPlaceholderIndex = 0;
          }
        }
      } else {
        if (currPlaceholderLetterIndex < placeholders[currPlaceholderIndex].length) {
          currPlaceholderLetterIndex += 1;
        } else {
          isClearing = true;
          isReadSleep = true;
          this.animationPlaceholder = placeholders[currPlaceholderIndex].slice(0, currPlaceholderLetterIndex);
          setTimeout(() => {
            isReadSleep = false;
          }, 1500);
          return;
        }
      }
  
      this.animationPlaceholder = placeholders[currPlaceholderIndex].slice(0, currPlaceholderLetterIndex) + (currPlaceholderLetterIndex % 3 !== 0? '|' : '|');
      if(this.inputValue){
        if (this.placeholderAnimationTimerRef) {
          clearInterval(this.placeholderAnimationTimerRef);
          this.placeholderAnimationTimerRef = undefined;
        }
      }
  
    }, 100);
  }
  

  onKeyUp(event: KeyboardEvent): void {
    this.keyUpEvent.emit(event);
  }
  

  clearInput() {
    if (this.inputDisabled) return;
    this.inputValue = '';
    this.onChange(this.inputValue);
    this.valueChangeEvent.emit(this.inputValue);
    this.clearEvent.emit();
    if(!this.inputValue && this.placeholdersListData.length){
      this.placeholdersAnimate(this.placeholdersListData);
    }
  }

  validateInput(emitEvent?: boolean): void {
    if (this.inputType() === 'number') {
      if (this.inputValue || this.inputValue === 0) {
        this.inputValue = Number(
          this.inputValue?.toString().replace(/[^\d.]/g, '') ?? ''
        );
      } else {
        this.inputValue = '';
      }
    }
    if (emitEvent) {
      this.valueChangeEvent.emit(this.inputValue);
    }
    
    if(!this.inputValue && this.placeholdersListData.length){
      this.placeholdersAnimate(this.placeholdersListData);
    }
  }

  focusOtpInput(index: number, selection: boolean) {
    const inputElement = this.otpRefs.toArray()[index];
    if (inputElement) {
      inputElement.nativeElement.focus();
      if (selection) {
        inputElement.nativeElement.select();
      }
    }
  }

  otp4OnChange(index: number, event: KeyboardEvent): void {
    this.inputValue = String(
      this.otp4digits
        .map((value, i) => {
          if (!/^\d{1}$/.test(value?.toString().trim())) {
            this.otp4digits[i] = '';
            return '';
          }
          return value?.toString().replace(/[^0-9]/g, '') ?? '';
        })
        .join('')
    );
    if ( this.otp4digits[index] ||
      event.key.toLowerCase() === 'arrowright'
    ) {
      this.focusOtpInput(index < 4 ? index + 1 : 3, false);
    } else if (
      event.key.toLowerCase() === 'backspace' ||
      event.key.toLowerCase() === 'arrowleft'
    ) {
      this.focusOtpInput(index > 0 ? index - 1 : 0, true);
    }
    this.onChange(this.inputValue);
    this.valueChangeEvent.emit(this.inputValue);
  }

  /**
   * VALUE ACCESSOR
   */
  //
  onChange: (value: string | number) => void = () => {};

  onTouch: (value: string | number) => void = () => {};

  writeValue(value: string): void {
    this.inputValue = value;
    if (this.inputType() === 'otp4digit') {
      value
        ?.toString()
        .split('')
        .forEach((v, i) => {
          if (v && /^\d{1}$/.test(v)) {
            if (i < 4) {
              this.otp4digits[i] = v;
            }
          }
        });
    }
  }

  onPaste(event: ClipboardEvent): void {
    if(this.disableCopyPaste()){
      event.preventDefault();
    }
  }
  
  onCopy(event: ClipboardEvent): void {
    if(this.disableCopyPaste()){
      event.preventDefault();
    }
  }
  

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: string | number) => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.inputDisabled = isDisabled;
  }

  ionViewDidLeave(): void {
    if (this.placeholderAnimationTimerRef) {
      clearInterval(this.placeholderAnimationTimerRef);
      this.placeholderAnimationTimerRef = undefined;
    }
  }

}
