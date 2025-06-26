import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelecionarLigaService } from '../services/selecionar-liga.service';

interface HallOfFameEntry {
  year: number;
  categories: string[];
  awards?: string[];
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-hall-of-fame',
  template: `
    <div class="hof-wrapper">

      <p class="intro">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo
        nisl nec tortor posuere, sed efficitur lorem imperdiet. Pellentesque habitant
        morbi tristique senectus et netus et malesuada fames ac turpis egestas.
      </p>

      <section class="hof-list">
        <article *ngFor="let entry of hallOfFame" class="hof-entry">
          <h2 class="year">{{ entry.year }}</h2>
          <p class="year-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            dignissim pretium mauris, vitae dapibus mauris gravida et.
          </p>

          <div class="gold-row" *ngIf="goldCategories(entry).length">
            <figure
              *ngFor="let category of goldCategories(entry)"
              class="category-card gold"
            >
              <img
                [src]="getImageSrc(entry.year, category)"
                [alt]="category + ' ' + entry.year"
                loading="lazy"
              />
              <figcaption>{{ category }}</figcaption>
            </figure>
          </div>

          <div class="category-grid">
            <figure
              *ngFor="let category of otherCategories(entry)"
              class="category-card"
            >
              <img
                [src]="getImageSrc(entry.year, category)"
                [alt]="category + ' ' + entry.year"
                loading="lazy"
              />
              <figcaption>{{ category }}</figcaption>
            </figure>
          </div>

          <ul *ngIf="entry.awards?.length" class="awards-list">
            <li *ngFor="let award of entry.awards">🏅 {{ award }}</li>
          </ul>
        </article>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        --accent: #f77f24;
        --ouro: #d4af37;
        --glass-bg: rgba(255, 255, 255, 0.65);
        --glass-blur: blur(8px);
        display: block;
        padding: 3rem 1rem 5rem;
        background: url('/assets/bg-basketball.svg') center/cover fixed;
      }

      .hof-wrapper {
        max-width: 1200px;
        margin-inline: auto;
        text-align: center;
      }

      h1 {
        font-size: clamp(2rem, 2vw + 1rem, 2.8rem);
        font-weight: 800;
        margin-bottom: 2.5rem;
        color: #222;
      }

      .year {
        font-size: 2rem;
        font-weight: 700;
        color: #111;
        margin: 3rem 0 1rem;
        position: relative;
        display: inline-block;
      }
      .year::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -6px;
        width: 100%;
        height: 4px;
        background: var(--accent);
        border-radius: 2px;
      }

      .intro,
      .year-description {
        max-width: 70ch;
        margin: 0.75rem auto 2rem;
        line-height: 1.6;
        color: #333;
        text-align: justify;
      }

      .gold-row {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }

      .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        justify-content: center;
      }

      .category-card {
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        padding: 1.25rem 1rem;
        border-radius: 1.5rem;
        width: 400px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }
      .category-card:hover {
        transform: translateY(-8px) scale(1.04);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
      }

      .category-card img {
        width: 100%;
        height: 500px;
        object-fit: cover;
        border-radius: 5%;
        border: 3px solid #fff;
        outline: 2px solid var(--accent);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
        margin-bottom: 0.85rem;
      }

      .gold {
        background: rgba(255, 223, 89, 0.25);
        box-shadow: 0 0 22px rgba(212, 175, 55, 0.5);
        width: 800px;
      }
      .gold img {
        outline-color: var(--ouro);
        height: 900px;
        width: 700px;
      }
      .gold figcaption {
        color: var(--ouro);
        font-weight: 700;
      }

      .category-card figcaption {
        font-weight: 600;
        font-size: 1rem;
        color: #222;
      }

      .awards-list {
        margin-top: 1.25rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        list-style: none;
        padding: 0;
        font-style: italic;
        font-size: 0.95rem;
        color: #333;
      }

      .text-muted {
        opacity: 0.75;
        font-style: italic;
      }

      @media (max-width: 450px) {
        .category-grid {
          grid-template-columns: repeat(auto-fit, minmax(140px, 140px));
          gap: 1.5rem;
        }
      }
    `,
  ],
})
export class HallOfFameComponent {
  liga = inject(SelecionarLigaService).liga$;

  readonly hallOfFame: HallOfFameEntry[] = [
    {
      year: 2024,
      categories: ['Ouro', 'Sub18', 'Master', 'Bronze', 'Prata'],
      },
    {
      year: 2023,
      categories: ['Ouro', 'Master', 'Bronze', 'Prata'],
      },
    { 
      year: 2022, 
      categories: ['Ouro', 'Bronze', 'Prata'],
      },
    { year: 2019, categories: ['Campeão'] },
  ];

  isGold(category: string): boolean {
    return category === 'Ouro' || category === 'Campeão';
  }

  goldCategories(entry: HallOfFameEntry): string[] {
    return entry.categories.filter(c => this.isGold(c));
  }

  otherCategories(entry: HallOfFameEntry): string[] {
    return entry.categories.filter(c => !this.isGold(c));
  }

  getImageSrc(year: number, category: string): string {
    const catSlug = this.slugify(category);
    const file =
      category === 'Campeão' ? `${year}.jpg` : `${year}${catSlug}.jpg`;
    return `/assets/img/hall_of_fame/${file}`;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')        // remove espaços
      .replace(/[^a-z0-9]/g, ''); // remove símbolos
  }
}
