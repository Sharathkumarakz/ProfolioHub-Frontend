import { isPlatformBrowser } from '@angular/common';
import { inject, Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../localStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  isDarkMode: boolean = false;
  private isBrowser: boolean = false;

  public themeUpdatedObservable = new Subject<{ isDarkMode: boolean }>();

  private localStorageService = inject(LocalStorageService);
  private rendererFactory = inject(RendererFactory2);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initTheme();
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * The function `initTheme` initializes the theme based on the user's preference stored in local
   * storage.
   */
  initTheme() {
    const userTheme =  this.localStorageService.getItem('user-theme');
    const isDarkMode = userTheme === 'dark-mode';
    this.update(isDarkMode);
  }

  /**
   * The function `toggleTheme` in TypeScript toggles between dark and light mode based on the current
   * mode or a specified mode.
   * @param {boolean} [isDarkMode] - The `isDarkMode` parameter is a boolean value that indicates
   * whether the dark mode should be toggled on or off. If `isDarkMode` is provided and is `true`, it
   * will set the theme to dark mode. If `isDarkMode` is `false` or not provided
   */
  toggleTheme(isDarkMode?: boolean) {
    const isDark: boolean =
      isDarkMode !== undefined ? isDarkMode : !this.isDarkMode;
    this.update(isDark);
  }

  /**
   * The getCurrentTheme function returns either 'dark-mode' or 'light-mode' based on the value of
   * isDarkMode.
   * @returns 'dark-mode' or 'light-mode' based on the value of the isDarkMode property
   */
  getCurrentTheme(): 'dark-mode' | 'light-mode' {
    return this.isDarkMode ? 'dark-mode' : 'light-mode';
  }

  /**
   * The function updates the theme of the application based on whether dark mode is enabled or not.
   * @param {boolean} isDarkMode - The `isDarkMode` parameter is a boolean value that determines
   * whether the dark mode theme should be applied (`true`) or the light mode theme should be applied
   * (`false`).
   */
  private update(isDarkMode: boolean) {
    if (this.isBrowser) {
      const theme = isDarkMode ? 'dark-mode' : 'light-mode';
      this.renderer.removeClass(
        document.body,
        this.isDarkMode ? 'dark-mode' : 'light-mode'
      );
      this.renderer.addClass(document.body, theme);
      this.localStorageService.setItem('user-theme', theme);
      this.isDarkMode = isDarkMode;
      this.themeUpdatedObservable.next({ isDarkMode });
    }
  }
}
