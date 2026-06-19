import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../auth/auth';
import { Theme } from '../core/theme';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private authService = inject(Auth)
  private themeService = inject(Theme)

  // exposed to the template; the footer button reads theme() and calls toggleTheme()
  theme = this.themeService.mode

  // sidebar collapse state
  collapsed = signal(false)

  toggleCollapse() {
    this.collapsed.update(c => !c)
  }

  toggleTheme() {
    this.themeService.toggle()
  }

  onLogout() {
    this.authService.logout()
  }

}
