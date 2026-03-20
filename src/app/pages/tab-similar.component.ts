import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { forkJoin }           from 'rxjs';
import { TmdbService }        from '../api/tmdb.service';
import { TvShow }             from '../api/tmdb.models';
import { environment }        from '../../environments/environment';
import { LoaderComponent, ErrorComponent, EndpointTagComponent } from '../components/ui.component';

@Component({
  selector: 'app-tab-similar',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ErrorComponent, EndpointTagComponent],
  template: `
    <app-loader *ngIf="loading" />
    <app-error  *ngIf="error"   [msg]="error" />

    <div class="panel" *ngIf="!loading && !error">
      <div class="panel-title">🔗 Series Relacionadas</div>

      <div class="section">
        <div class="section-title">Recomendaciones</div>
        <app-endpoint-tag [path]="'/tv/' + showId + '/recommendations'" />
        <div class="rec-grid">
          <div class="rec-card" *ngFor="let s of recommendations">
            <div class="rec-img-wrap">
              <img *ngIf="s.poster_path" [src]="imgUrl + 'w185' + s.poster_path" [alt]="s.name" class="rec-poster" loading="lazy" />
              <div class="rec-no-poster" *ngIf="!s.poster_path">📺</div>
              <div class="pc tl"></div>
              <div class="pc tr"></div>
              <div class="pc bl"></div>
              <div class="pc br"></div>
            </div>
            <div class="rec-name">{{ s.name }}</div>
            <div class="rec-rating">★ {{ s.vote_average | number:'1.1-1' }}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Series Similares</div>
        <app-endpoint-tag [path]="'/tv/' + showId + '/similar'" />
        <div class="rec-grid">
          <div class="rec-card" *ngFor="let s of similar">
            <div class="rec-img-wrap">
              <img *ngIf="s.poster_path" [src]="imgUrl + 'w185' + s.poster_path" [alt]="s.name" class="rec-poster" loading="lazy" />
              <div class="rec-no-poster" *ngIf="!s.poster_path">📺</div>
              <div class="pc tl"></div>
              <div class="pc tr"></div>
              <div class="pc bl"></div>
              <div class="pc br"></div>
            </div>
            <div class="rec-name">{{ s.name }}</div>
            <div class="rec-rating">★ {{ s.vote_average | number:'1.1-1' }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .panel {
      background: var(--panel); border: 1px solid var(--border-gold);
      padding: 1.5rem; animation: fadeIn 0.4s ease;
    }
    .panel-title {
      font-family: var(--font-type); font-size: 0.68rem; color: var(--gold);
      letter-spacing: 0.25em; text-transform: uppercase;
      margin-bottom: 1rem; padding-bottom: 0.7rem;
      border-bottom: 1px solid var(--border-gold);
    }
    .section { margin-bottom: 2.5rem; }
    .section-title {
      font-family: var(--font-display); font-style: italic;
      font-size: 1rem; color: var(--gold-pale); margin-bottom: 0.5rem;
    }

    /* GRID */
    .rec-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(115px, 1fr)); gap: 0.9rem; }
    .rec-card { transition: transform 0.2s; }
    .rec-card:hover { transform: translateY(-4px); }

    /* POSTER CON ESQUINAS */
    .rec-img-wrap { position: relative; }
    .rec-poster {
      width: 100%; aspect-ratio: 2/3; object-fit: cover;
      border: 1px solid var(--border-gold); display: block;
      filter: sepia(0.12) contrast(1.04);
      transition: filter 0.2s, border-color 0.2s;
    }
    .rec-card:hover .rec-poster { border-color: var(--gold); filter: sepia(0) contrast(1.08); }
    .rec-no-poster {
      aspect-ratio: 2/3; background: var(--smoke);
      border: 1px solid var(--border-gold);
      display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
    }

    /* Esquinas decorativas */
    .pc {
      position: absolute; width: 8px; height: 8px;
      border-color: var(--gold); opacity: 0; transition: opacity 0.2s;
    }
    .rec-card:hover .pc { opacity: 1; }
    .tl { top: 3px;    left: 3px;  border-style: solid none none solid; border-width: 1.5px; }
    .tr { top: 3px;    right: 3px; border-style: solid solid none none; border-width: 1.5px; }
    .bl { bottom: 3px; left: 3px;  border-style: none none solid solid; border-width: 1.5px; }
    .br { bottom: 3px; right: 3px; border-style: none solid solid none; border-width: 1.5px; }

    .rec-name {
      font-family: var(--font-body); font-size: 0.72rem;
      color: var(--paper); margin-top: 0.4rem; line-height: 1.3;
    }
    .rec-rating {
      font-family: var(--font-type); font-size: 0.65rem;
      color: var(--gold); margin-top: 0.15rem; letter-spacing: 0.05em;
    }
  `]
})
export class TabSimilarComponent implements OnInit {
  recommendations: TvShow[] = [];
  similar:         TvShow[] = [];
  loading = true;
  error   = '';
  showId  = environment.showId;
  imgUrl  = environment.tmdbImgUrl;

  constructor(private tmdb: TmdbService) {}

  ngOnInit(): void {
    forkJoin({
      rec: this.tmdb.getRecommendations(),
      sim: this.tmdb.getSimilar()
    }).subscribe({
      next: ({ rec, sim }) => {
        this.recommendations = rec.results.slice(0, 12);
        this.similar         = sim.results.slice(0, 12);
        this.loading         = false;
      },
      error: (e) => { this.error = e.message; this.loading = false; }
    });
  }
}