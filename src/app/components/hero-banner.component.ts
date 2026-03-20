import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { TmdbService }       from '../api/tmdb.service';
import { ShowDetails }       from '../api/tmdb.models';
import { environment }       from '../../environments/environment';
import { BadgeComponent }    from './ui.component';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="hero" *ngIf="show">

      <!-- Poster con marco de esquinas doradas -->
      <div class="poster-frame">
        <img
          *ngIf="show.poster_path"
          [src]="imgUrl + 'w300' + show.poster_path"
          [alt]="show.name"
          class="poster"
        />
        <div class="poster-corner tl"></div>
        <div class="poster-corner tr"></div>
        <div class="poster-corner bl"></div>
        <div class="poster-corner br"></div>
      </div>

      <!-- Info -->
      <div class="info">
        <div class="info-eyebrow">— Dossier Confidencial —</div>
        <h2 class="title">{{ show.name }}</h2>
        <p class="tagline">{{ show.tagline || 'Non si può tenere un uomo buono giù' }}</p>

        <div class="divider">
          <span class="d-line"></span>
          <span class="d-dot">◆</span>
          <span class="d-line"></span>
        </div>

        <div class="meta">
          <app-badge color="gold">⭐ {{ show.vote_average | number:'1.1-1' }}</app-badge>
          <app-badge>📺 {{ show.number_of_seasons }} temporadas</app-badge>
          <app-badge>🎬 {{ show.number_of_episodes }} eps</app-badge>
          <app-badge>📅 {{ show.first_air_date | slice:0:4 }}</app-badge>
          <app-badge *ngFor="let g of show.genres">{{ g.name }}</app-badge>
          <app-badge color="red">
            {{ show.status === 'Ended' ? 'Finalizada' : 'En curso' }}
          </app-badge>
        </div>

        <p class="overview">{{ show.overview }}</p>
      </div>
    </div>
  `,
  styles: [`
    .hero {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2rem;
      align-items: start;
      padding: 1.8rem;
      background: var(--panel);
      border: 1px solid var(--border-gold);
      margin-bottom: 1.5rem;
      position: relative;
      animation: fadeIn 0.5s ease;
    }
    /* Marco interior sutil */
    .hero::before {
      content: '';
      position: absolute; inset: 5px;
      border: 1px solid rgba(200,152,42,0.12);
      pointer-events: none;
    }

    /* POSTER */
    .poster-frame { position: relative; flex-shrink: 0; }
    .poster {
      width: 155px; display: block;
      border: 1px solid var(--border-gold);
      filter: contrast(1.05) saturate(0.9) sepia(0.15);
    }
    /* Esquinas decorativas */
    .poster-corner {
      position: absolute; width: 14px; height: 14px;
      border-color: var(--gold);
    }
    .tl { top: -4px;    left: -4px;  border-style: solid none none solid; border-width: 2px; }
    .tr { top: -4px;    right: -4px; border-style: solid solid none none; border-width: 2px; }
    .bl { bottom: -4px; left: -4px;  border-style: none none solid solid; border-width: 2px; }
    .br { bottom: -4px; right: -4px; border-style: none solid solid none; border-width: 2px; }

    /* INFO */
    .info { min-width: 0; }
    .info-eyebrow {
      font-family: var(--font-type);
      font-size: 0.65rem; letter-spacing: 0.4em;
      color: var(--gold-dim); margin-bottom: 0.5rem;
    }
    .title {
      font-family: var(--font-display);
      font-weight: 900; font-size: clamp(1.4rem, 3vw, 2.2rem);
      color: var(--paper); line-height: 1.1; margin-bottom: 0.4rem;
      text-shadow: 0 2px 8px rgba(0,0,0,0.8);
    }
    .tagline {
      font-family: var(--font-display);
      font-style: italic; font-size: 0.88rem;
      color: var(--gold); margin-bottom: 0.8rem; opacity: 0.85;
    }
    .divider {
      display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.9rem;
    }
    .d-line { flex: 1; max-width: 80px; height: 1px; background: var(--border-gold); }
    .d-dot  { color: var(--gold-dim); font-size: 0.45rem; }
    .meta { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
    .overview {
      font-family: var(--font-body);
      font-size: 0.83rem; line-height: 1.8; color: var(--paper-dim);
    }

    @media (max-width: 600px) {
      .hero { grid-template-columns: 1fr; }
      .poster { width: 120px; }
    }
  `]
})
export class HeroBannerComponent implements OnInit {
  show:   ShowDetails | null = null;
  imgUrl = environment.tmdbImgUrl;

  constructor(private tmdb: TmdbService) {}

  ngOnInit(): void {
    this.tmdb.getShowDetails().subscribe(data => this.show = data);
  }
}