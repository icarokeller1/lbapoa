import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-instagram-feed',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `  `
})
export class InstagramFeedComponent {

  embeds: SafeHtml[] = [];

  private http = inject(HttpClient);

  ngOnInit() {
    this.http.get<any[]>('/api/noticias', { }).subscribe(lista => {
      this.embeds = lista

      this.ensureScript().then(() => (window as any).instgrm?.Embeds.process());
    });
  }

  /** Garante o carregamento único do embed.js. */
  private ensureScript(): Promise<void> {
    return new Promise(res => {
      if ((window as any).instgrm) return res();
      const s = document.createElement('script');
      s.src = 'https://www.instagram.com/embed.js';
      s.async = true;
      s.onload = () => res();
      document.body.appendChild(s);
    });
  }
}
