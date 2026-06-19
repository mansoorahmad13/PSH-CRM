import { effect, Service, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

@Service()
export class Theme {
    /** Current theme. Read with mode() in templates. */
    readonly mode = signal<ThemeMode>(this.readInitial());

    constructor() {
        // Whenever `mode` changes, reflect it on <html> and persist it.
        effect(() => {
            const mode = this.mode();
            document.documentElement.setAttribute('data-theme', mode);
            localStorage.setItem('theme', mode);
        });
    }

    toggle() {
        this.mode.update(m => (m === 'dark' ? 'light' : 'dark'));
    }

    set(mode: ThemeMode) {
        this.mode.set(mode);
    }

    private readInitial(): ThemeMode {
        return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
    }
}
