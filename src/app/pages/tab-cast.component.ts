import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { TmdbService }       from '../api/tmdb.service';
import { CastMember, SeasonCastMember } from '../api/tmdb.models';
import { environment }       from '../../environments/environment';
import { LoaderComponent, ErrorComponent, EndpointTagComponent } from '../components/ui.component';
import { forkJoin }          from 'rxjs';

const AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='74' height='74'%3E%3Ccircle cx='37' cy='37' r='37' fill='%23151310'/%3E%3Ctext x='37' y='45' text-anchor='middle' fill='%23b8963a' font-size='24'%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E`;

interface SeasonTab {
  label: string;
  number: number | null;
}

@Component({
  selector: 'app-tab-cast',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ErrorComponent, EndpointTagComponent],
  template: `
    <app-loader *ngIf="loading" />
    <app-error  *ngIf="error"   [msg]="error" />

    <div class="panel" *ngIf="!loading && !error">

      <div class="panel-title">🎭 Reparto por Temporada</div>
      <app-endpoint-tag [path]="activeSeason === null
        ? '/tv/' + showId + '/aggregate_credits'
        : '/tv/' + showId + '/season/' + activeSeason + '/credits'" />

      <div class="season-tabs">
        <button
          class="season-tab"
          *ngFor="let tab of seasonTabs"
          [class.active]="activeSeason === tab.number"
          (click)="selectSeason(tab.number)">
          {{ tab.label }}
        </button>
      </div>

      <app-loader *ngIf="loadingSeason" />
      <app-error  *ngIf="seasonError"   [msg]="seasonError" />

      <div class="cast-grid" *ngIf="!loadingSeason && !seasonError">
        <div class="cast-card" *ngFor="let p of displayedCast">
          <div class="cast-img-wrap">
            <img
              [src]="getPhoto(p)"
              [alt]="getName(p)"
              class="cast-img"
              loading="lazy"
            />
            <div class="cast-img-border tl"></div>
            <div class="cast-img-border tr"></div>
            <div class="cast-img-border bl"></div>
            <div class="cast-img-border br"></div>
          </div>
          <div class="cast-name">{{ getName(p) }}</div>
          <div class="cast-char">{{ getCharacter(p) }}</div>
          <div class="cast-eps" *ngIf="getEpCount(p) > 0">
            {{ getEpCount(p) }} ep{{ getEpCount(p) !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>

      <div class="empty-msg"
           *ngIf="!loadingSeason && !seasonError && displayedCast.length === 0">
        Sin datos de reparto para esta temporada.
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

    /* TABS */
    .season-tabs {
      display: flex; flex-wrap: wrap; gap: 0; margin-bottom: 1.2rem;
      border: 1px solid var(--border-gold); overflow: hidden;
    }
    .season-tab {
      flex: 1; min-width: 50px;
      background: rgba(10,7,3,0.8);
      border: none; border-right: 1px solid var(--border-gold);
      color: var(--paper-dark); padding: 0.45rem 0.4rem;
      font-family: var(--font-type); font-size: 0.65rem;
      letter-spacing: 0.1em; text-transform: uppercase;
      cursor: pointer; transition: all 0.15s;
      position: relative;
    }
    .season-tab:last-child { border-right: none; }
    .season-tab::after {
      content: '';
      position: absolute; bottom: 0; left: 50%; right: 50%;
      height: 2px; background: var(--gold);
      transition: left 0.2s, right 0.2s;
    }
    .season-tab:hover { color: var(--gold-pale); background: rgba(200,152,42,0.06); }
    .season-tab:hover::after { left: 0; right: 0; }
    .season-tab.active { color: var(--gold-pale); background: rgba(200,152,42,0.1); }
    .season-tab.active::after { left: 0; right: 0; }

    /* GRID */
    .cast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 1.2rem;
    }
    .cast-card { text-align: center; animation: slideIn 0.3s ease; }

    /* Foto con esquinas decorativas */
    .cast-img-wrap {
      position: relative; width: 74px; height: 74px;
      margin: 0 auto 0.5rem;
    }
    .cast-img {
      width: 74px; height: 74px;
      object-fit: cover;
      border: 1px solid var(--border-gold);
      display: block;
      filter: sepia(0.12) contrast(1.05);
      transition: filter 0.2s, border-color 0.2s;
    }
    .cast-card:hover .cast-img {
      filter: sepia(0) contrast(1.1);
      border-color: var(--gold);
    }
    /* Esquinas sobre la foto */
    .cast-img-border {
      position: absolute; width: 8px; height: 8px;
      border-color: var(--gold); opacity: 0;
      transition: opacity 0.2s;
    }
    .cast-card:hover .cast-img-border { opacity: 1; }
    .tl { top: -2px;    left: -2px;  border-style: solid none none solid; border-width: 1.5px; }
    .tr { top: -2px;    right: -2px; border-style: solid solid none none; border-width: 1.5px; }
    .bl { bottom: -2px; left: -2px;  border-style: none none solid solid; border-width: 1.5px; }
    .br { bottom: -2px; right: -2px; border-style: none solid solid none; border-width: 1.5px; }

    .cast-name {
      font-family: var(--font-body); font-size: 0.72rem;
      color: var(--paper); font-weight: 700; line-height: 1.3;
    }
    .cast-char {
      font-family: var(--font-display); font-style: italic;
      font-size: 0.65rem; color: var(--gold); margin-top: 0.1rem;
    }
    .cast-eps {
      font-family: var(--font-type); font-size: 0.6rem;
      color: var(--paper-dark); margin-top: 0.15rem; letter-spacing: 0.05em;
    }
    .empty-msg {
      font-family: var(--font-display); font-style: italic;
      color: var(--paper-dark); font-size: 0.88rem;
      text-align: center; padding: 2.5rem 0;
    }
  `]
})
export class TabCastComponent implements OnInit {
  // — toda la lógica TypeScript queda igual —
  allCast:    CastMember[]       = [];
  seasonCast: SeasonCastMember[] = [];
  loading       = true;
  loadingSeason = false;
  error         = '';
  seasonError   = '';
  activeSeason: number | null = null;
  seasonTabs:   SeasonTab[]   = [];
  showId = environment.showId;
  imgUrl = environment.tmdbImgUrl;
  avatar = AVATAR;
  private seasonCache = new Map<number, SeasonCastMember[]>();

  constructor(private tmdb: TmdbService) {}

  ngOnInit(): void {
    forkJoin({ credits: this.tmdb.getCredits(), show: this.tmdb.getShowDetails() }).subscribe({
      next: ({ credits, show }) => {
        this.allCast = credits.cast.slice(0, 40);
        this.seasonTabs = [
          { label: 'Todos', number: null },
          ...Array.from({ length: show.number_of_seasons }, (_, i) => ({ label: `T.${i + 1}`, number: i + 1 }))
        ];
        this.loading = false;
      },
      error: (e) => { this.error = e.message; this.loading = false; }
    });
  }

  selectSeason(n: number | null): void {
    this.activeSeason = n;
    this.seasonError  = '';
    if (n === null) return;
    if (this.seasonCache.has(n)) { this.seasonCast = this.seasonCache.get(n)!; return; }
    this.loadingSeason = true;
    this.seasonCast    = [];
    this.tmdb.getSeasonCredits(n).subscribe({
      next: (data) => { this.seasonCast = data.cast.slice(0, 40); this.seasonCache.set(n, this.seasonCast); this.loadingSeason = false; },
      error: (e)   => { this.seasonError = e.message; this.loadingSeason = false; }
    });
  }

  get displayedCast(): (CastMember | SeasonCastMember)[] {
    return this.activeSeason === null ? this.allCast : this.seasonCast;
  }
  getName(p: CastMember | SeasonCastMember): string { return p.name; }
  getPhoto(p: CastMember | SeasonCastMember): string {
    return p.profile_path ? this.imgUrl + 'w185' + p.profile_path : this.avatar;
  }
  getCharacter(p: CastMember | SeasonCastMember): string {
    if ('roles' in p) return p.roles?.map(r => r.character).join(', ') || '—';
    return (p as SeasonCastMember).character || '—';
  }
  getEpCount(p: CastMember | SeasonCastMember): number {
    return 'total_episode_count' in p ? p.total_episode_count : 0;
  }
}