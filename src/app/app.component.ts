import { ThemeService } from './services/theme/theme.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{

  private themeService = inject(ThemeService);

  ngOnInit(): void {
   this.themeService.initTheme();
  }
  title = 'profolioHub';
}
