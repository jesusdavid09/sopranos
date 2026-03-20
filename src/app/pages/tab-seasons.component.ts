import { Component, OnInit }   from '@angular/core';
import { CommonModule }         from '@angular/common';
import { TmdbService }          from '../api/tmdb.service';
import { Season, SeasonDetails } from '../api/tmdb.models';
import { environment }          from '../../environments/environment';
import { LoaderComponent, ErrorComponent, EndpointTagComponent } from '../components/ui.component';

@Component({
  selector: 'app-tab-seasons',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ErrorComponent, EndpointTagComponent],
  template: `
    <app-loader *ngIf="loading" />
    <app-error  *ngIf="error"   [msg]="error" />

    <div class="panel" *ngIf="!loading && !error && !selectedSeason">
      <div class="panel-title">📺 Temporadas</div>
      <app-endpoint-tag [path]="'/tv/' + showId + '  (seasons array)'" />
      <p class="hint">Haz click en una temporada para ver sus episodios y sinopsis.</p>

      <div class="seasons-grid">
        <div class="season-card" *ngFor="let s of seasons" (click)="loadEpisodes(s)">
          <div class="season-poster-wrap">
            <img *ngIf="s.poster_path" [src]="imgUrl + 'w342' + s.poster_path" [alt]="s.name" class="season-poster" />
            <div class="no-poster" *ngIf="!s.poster_path">📺</div>
            <div class="rating-badge" *ngIf="getVote(s) > 0">
              <span class="rating-star">★</span>
              <span class="rating-val">{{ getVote(s) | number:'1.1-1' }}</span>
            </div>
            <!-- Esquinas decorativas sobre el poster -->
            <div class="pc tl"></div>
            <div class="pc tr"></div>
            <div class="pc bl"></div>
            <div class="pc br"></div>
          </div>
          <div class="season-info">
            <div class="season-name">{{ s.name }}</div>
            <div class="season-meta">{{ s.episode_count }} eps · {{ s.air_date | slice:0:4 }}</div>
            <div class="season-overview" *ngIf="s.overview">{{ s.overview }}</div>
            <div class="season-overview season-overview--empty" *ngIf="!s.overview">Sin sinopsis disponible.</div>
            <div class="rating-bar-wrap" *ngIf="getVote(s) > 0">
              <div class="rating-bar-bg">
                <div class="rating-bar-fill"
                     [style.width.%]="(getVote(s) / 10) * 100"
                     [class.rating-high]="getVote(s) >= 8"
                     [class.rating-mid]="getVote(s) >= 6 && getVote(s) < 8"
                     [class.rating-low]="getVote(s) < 6">
                </div>
              </div>
              <span class="rating-label">{{ getVote(s) | number:'1.1-1' }} / 10</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-section" *ngIf="hasRatings">
        <div class="chart-label-title">⭐ Rating promedio por temporada</div>
        <div class="chart-row" *ngFor="let s of seasons">
          <div class="chart-label">T.{{ s.season_number }}</div>
          <div class="chart-bg">
            <div class="chart-bar"
                 [style.width.%]="getVote(s) ? (getVote(s) / 10) * 100 : 0"
                 [class.rating-high]="getVote(s) >= 8"
                 [class.rating-mid]="getVote(s) >= 6 && getVote(s) < 8"
                 [class.rating-low]="getVote(s) < 6">
            </div>
          </div>
          <div class="chart-count">
            <span *ngIf="getVote(s) > 0">{{ getVote(s) | number:'1.1-1' }} ★</span>
            <span *ngIf="getVote(s) === 0" class="no-rating">—</span>
          </div>
        </div>
      </div>

      <div class="chart-section">
        <div class="chart-label-title">📊 Episodios por temporada</div>
        <div class="chart-row" *ngFor="let s of seasons">
          <div class="chart-label">T.{{ s.season_number }}</div>
          <div class="chart-bg">
            <div class="chart-bar eps-bar" [style.width.%]="(s.episode_count / maxEps) * 100"></div>
          </div>
          <div class="chart-count">{{ s.episode_count }}</div>
        </div>
      </div>
    </div>

    <div *ngIf="!loading && !error && selectedSeason">
      <button class="back-btn" (click)="goBack()">← Volver a temporadas</button>

      <app-loader *ngIf="loadingEps" />
      <app-error  *ngIf="epsError"   [msg]="epsError" />

      <div class="panel" *ngIf="!loadingEps && !epsError && seasonDetail">
        <div class="panel-title">📺 {{ seasonDetail.name }}</div>
        <app-endpoint-tag [path]="'/tv/' + showId + '/season/' + selectedSeason.season_number" />

        <div class="season-detail-overview" *ngIf="selectedSeason.overview">
          <span class="overview-label">Sinopsis de la temporada</span>
          {{ selectedSeason.overview }}
        </div>

        <div class="season-rating-summary" *ngIf="getVote(selectedSeason) > 0">
          <span class="rating-stars">★</span>
          <strong>{{ getVote(selectedSeason) | number:'1.1-1' }}</strong>
          <span class="rating-sub">/ 10 · Rating TMDB</span>
        </div>

        <div class="ep-item" *ngFor="let ep of seasonDetail.episodes">
          <div class="ep-num">{{ ep.episode_number }}</div>
          <div class="ep-media">
            <img *ngIf="ep.still_path" [src]="imgUrl + 'w185' + ep.still_path" class="ep-thumb" alt="" loading="lazy" />
            <div class="ep-no-thumb" *ngIf="!ep.still_path"></div>
            <div class="ep-rating" *ngIf="ep.vote_average > 0">★ {{ ep.vote_average | number:'1.1-1' }}</div>
          </div>
          <div class="ep-body">
            <div class="ep-title">{{ ep.name }}</div>
            <div class="ep-air">📅 {{ ep.air_date || '—' }}</div>
            <div class="ep-synopsis">
              <span class="synopsis-label">Sinopsis</span>
              <span *ngIf="ep.overview">{{ ep.overview }}</span>
              <span *ngIf="!ep.overview" class="no-synopsis">Sin sinopsis disponible.</span>
            </div>
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
    .hint {
      font-family: var(--font-type); font-size: 0.72rem;
      color: var(--paper-dark); margin-bottom: 1.2rem; font-style: italic;
    }

    /* GRID */
    .seasons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.2rem; }
    .season-card {
      border: 1px solid var(--border-gold); overflow: hidden;
      cursor: pointer; background: rgba(10,7,3,0.9);
      transition: border-color 0.2s, transform 0.2s;
    }
    .season-card:hover { border-color: var(--gold); transform: translateY(-3px); }

    /* POSTER */
    .season-poster-wrap { position: relative; }
    .season-poster {
      width: 100%; aspect-ratio: 2/3; object-fit: cover; display: block;
      filter: sepia(0.15) contrast(1.05);
      transition: filter 0.2s;
    }
    .season-card:hover .season-poster { filter: sepia(0) contrast(1.08); }
    .no-poster {
      aspect-ratio: 2/3; background: var(--smoke);
      display: flex; align-items: center; justify-content: center; font-size: 2.5rem;
    }

    /* Esquinas decorativas sobre el poster */
    .pc {
      position: absolute; width: 10px; height: 10px;
      border-color: var(--gold); opacity: 0; transition: opacity 0.2s;
    }
    .season-card:hover .pc { opacity: 1; }
    .tl { top: 5px;    left: 5px;  border-style: solid none none solid; border-width: 1.5px; }
    .tr { top: 5px;    right: 5px; border-style: solid solid none none; border-width: 1.5px; }
    .bl { bottom: 5px; left: 5px;  border-style: none none solid solid; border-width: 1.5px; }
    .br { bottom: 5px; right: 5px; border-style: none solid solid none; border-width: 1.5px; }

    /* RATING BADGE */
    .rating-badge {
      position: absolute; top: 8px; right: 8px;
      background: rgba(5,3,1,0.9); border: 1px solid var(--gold);
      padding: 2px 7px; display: flex; align-items: center; gap: 3px;
    }
    .rating-star { color: var(--gold); font-size: 0.72rem; }
    .rating-val  {
      font-family: var(--font-type); color: var(--paper);
      font-size: 0.75rem; font-weight: 700;
    }

    /* INFO */
    .season-info { padding: 0.75rem; }
    .season-name {
      font-family: var(--font-display); font-style: italic;
      font-size: 0.85rem; color: var(--gold-pale); font-weight: 700;
    }
    .season-meta {
      font-family: var(--font-type); font-size: 0.62rem;
      color: var(--paper-dark); margin-top: 0.2rem; letter-spacing: 0.05em;
    }
    .season-overview {
      font-family: var(--font-body); font-size: 0.72rem;
      color: var(--paper-dim, var(--paper-dark)); line-height: 1.55; margin-top: 0.5rem;
      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    }
    .season-overview--empty { font-style: italic; opacity: 0.45; }

    /* BARRA RATING */
    .rating-bar-wrap { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.6rem; }
    .rating-bar-bg { flex: 1; background: rgba(8,6,3,0.9); height: 4px; overflow: hidden; }
    .rating-bar-fill { height: 100%; transition: width 0.7s ease; }
    .rating-label { font-family: var(--font-type); font-size: 0.6rem; color: var(--paper-dark); white-space: nowrap; flex-shrink: 0; }
    .rating-high { background: linear-gradient(90deg, #9a7210, var(--gold-pale)) !important; }
    .rating-mid  { background: linear-gradient(90deg, var(--blood), #c05020) !important; }
    .rating-low  { background: #3a3020 !important; }

    /* GRÁFICAS */
    .chart-section { margin-top: 2rem; }
    .chart-label-title {
      font-family: var(--font-type); font-size: 0.65rem;
      letter-spacing: 0.15em; text-transform: uppercase;
      color: var(--paper-dark); margin-bottom: 0.8rem;
    }
    .chart-row { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; }
    .chart-label {
      width: 30px; text-align: right;
      font-family: var(--font-type); color: var(--paper-dark); font-size: 0.68rem; flex-shrink: 0;
    }
    .chart-bg { flex: 1; background: rgba(8,6,3,0.9); height: 14px; overflow: hidden; }
    .chart-bar { height: 100%; transition: width 0.8s ease; }
    .eps-bar { background: linear-gradient(90deg, var(--blood), var(--gold-dim)); }
    .chart-count { width: 65px; font-family: var(--font-type); color: var(--gold); font-size: 0.68rem; }
    .no-rating { color: var(--paper-dark); }

    /* BACK */
    .back-btn {
      background: transparent; border: 1px solid var(--border-gold);
      color: var(--paper-dark); padding: 0.5rem 1.2rem;
      font-family: var(--font-type); font-size: 0.68rem;
      letter-spacing: 0.15em; text-transform: uppercase;
      cursor: pointer; transition: all 0.2s; margin-bottom: 1rem;
    }
    .back-btn:hover { border-color: var(--gold); color: var(--gold); }

    /* DETALLE */
    .season-detail-overview {
      background: rgba(200,152,42,0.06); border-left: 3px solid var(--gold-dim);
      padding: 0.9rem 1rem; margin-bottom: 1rem;
      font-family: var(--font-body); font-size: 0.82rem;
      color: var(--paper-dark); line-height: 1.65;
    }
    .overview-label {
      display: block; font-family: var(--font-type);
      font-size: 0.62rem; letter-spacing: 0.15em;
      text-transform: uppercase; color: var(--gold); margin-bottom: 0.4rem;
    }
    .season-rating-summary {
      display: flex; align-items: center; gap: 0.5rem;
      margin-bottom: 1.2rem; padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-gold);
    }
    .rating-stars { color: var(--gold); font-size: 1.1rem; }
    .season-rating-summary strong {
      font-family: var(--font-display); color: var(--paper); font-size: 1.15rem;
    }
    .rating-sub { font-family: var(--font-type); font-size: 0.68rem; color: var(--paper-dark); }

    /* EPISODIOS */
    .ep-item {
      display: grid; grid-template-columns: 28px 100px 1fr;
      gap: 0.8rem; align-items: start; padding: 1rem 0;
      border-bottom: 1px solid rgba(200,152,42,0.1);
    }
    .ep-item:hover { background: rgba(200,152,42,0.025); }
    .ep-num {
      font-family: var(--font-type); color: var(--gold-dim);
      font-size: 0.75rem; text-align: right; padding-top: 2px;
    }
    .ep-media { display: flex; flex-direction: column; gap: 0.3rem; }
    .ep-thumb {
      width: 100px; display: block;
      border: 1px solid var(--border-gold);
      filter: sepia(0.1);
    }
    .ep-no-thumb { width: 100px; aspect-ratio: 16/9; background: var(--smoke); }
    .ep-rating {
      font-family: var(--font-type); font-size: 0.62rem;
      color: var(--gold); text-align: center;
      background: rgba(5,3,1,0.8); padding: 2px 4px;
    }
    .ep-title {
      font-family: var(--font-display); font-weight: 700;
      color: var(--paper); margin-bottom: 0.15rem; font-size: 0.92rem;
    }
    .ep-air {
      font-family: var(--font-type); font-size: 0.65rem;
      color: var(--paper-dark); margin-bottom: 0.4rem; letter-spacing: 0.04em;
    }
    .ep-synopsis { font-family: var(--font-body); font-size: 0.78rem; color: var(--paper-dark); line-height: 1.6; }
    .synopsis-label {
      display: block; font-family: var(--font-type);
      font-size: 0.6rem; letter-spacing: 0.12em;
      text-transform: uppercase; color: var(--gold-dim); margin-bottom: 0.25rem;
    }
    .no-synopsis { font-style: italic; opacity: 0.45; }
  `]
})
export class TabSeasonsComponent implements OnInit {
  seasons:        Season[]             = [];
  seasonDetail:   SeasonDetails | null = null;
  selectedSeason: Season | null        = null;
  loading    = true;
  loadingEps = false;
  error      = '';
  epsError   = '';
  maxEps     = 0;
  hasRatings = false;
  showId = environment.showId;
  imgUrl = environment.tmdbImgUrl;

  constructor(private tmdb: TmdbService) {}

  ngOnInit(): void {
    this.tmdb.getShowDetails().subscribe({
      next: (data) => {
        this.seasons    = data.seasons.filter(s => s.season_number > 0);
        this.maxEps     = Math.max(...this.seasons.map(s => s.episode_count ?? 0));
        this.hasRatings = this.seasons.some(s => this.getVote(s) > 0);
        this.loading    = false;
      },
      error: (e) => { this.error = e.message; this.loading = false; }
    });
  }

  getVote(s: Season): number { return (s as any).vote_average ?? 0; }

  loadEpisodes(season: Season): void {
    this.selectedSeason = season;
    this.loadingEps     = true;
    this.epsError       = '';
    this.seasonDetail   = null;
    this.tmdb.getSeasonEpisodes(season.season_number).subscribe({
      next: (data) => { this.seasonDetail = data; this.loadingEps = false; },
      error: (e)   => { this.epsError = e.message; this.loadingEps = false; }
    });
  }

  goBack(): void { this.selectedSeason = null; this.seasonDetail = null; }
}