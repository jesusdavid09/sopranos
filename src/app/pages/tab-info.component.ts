import { Component, OnInit }  from '@angular/core';
import { CommonModule }        from '@angular/common';
import { TmdbService }         from '../api/tmdb.service';
import { ShowDetails }         from '../api/tmdb.models';
import { environment }         from '../../environments/environment';
import { LoaderComponent, ErrorComponent, EndpointTagComponent } from '../components/ui.component';

@Component({
  selector: 'app-tab-info',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ErrorComponent, EndpointTagComponent],
  template: `
    <app-loader *ngIf="loading" />
    <app-error  *ngIf="error"   [msg]="error" />

    <div class="panel" *ngIf="show && !loading">
      <div class="panel-title">📋 Información General</div>
      <app-endpoint-tag [path]="'/tv/' + showId" />

      <div class="stats-grid">
        <div class="stat-box" *ngFor="let stat of stats">
          <div class="stat-val">{{ stat.val }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <table class="detail-table">
        <tbody>
          <tr *ngFor="let row of rows">
            <td class="td-label">{{ row.label }}</td>
            <td class="td-val">{{ row.value || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .panel {
      background: var(--panel);
      border: 1px solid var(--border-gold);
      padding: 1.5rem;
      animation: fadeIn 0.4s ease;
    }
    .panel-title {
      font-family: var(--font-type); font-size: 0.68rem;
      color: var(--gold); letter-spacing: 0.25em;
      text-transform: uppercase; margin-bottom: 1rem;
      padding-bottom: 0.7rem; border-bottom: 1px solid var(--border-gold);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
      gap: 0.6rem; margin-bottom: 1.5rem;
    }
    .stat-box {
      border: 1px solid var(--border-gold);
      padding: 1rem; text-align: center;
      background: rgba(8,6,3,0.8);
      position: relative;
    }
    /* Rombo decorativo entre cajas */
    .stat-box::after {
      content: '◆';
      position: absolute; bottom: -7px; left: 50%;
      transform: translateX(-50%);
      color: var(--gold-dim); font-size: 0.4rem;
      background: var(--ink2); padding: 0 3px;
    }
    .stat-val {
      font-family: var(--font-display);
      font-size: 1.7rem; color: var(--gold-pale);
      font-weight: 700; line-height: 1;
    }
    .stat-label {
      font-family: var(--font-type);
      font-size: 0.58rem; letter-spacing: 0.2em;
      text-transform: uppercase; color: var(--paper-dark);
      margin-top: 0.4rem;
    }
    .detail-table {
      width: 100%; border-collapse: collapse;
      font-size: 0.83rem; margin-top: 0.5rem;
    }
    .td-label {
      padding: 0.65rem 0.5rem; color: var(--paper-dark);
      font-family: var(--font-type); font-size: 0.65rem;
      letter-spacing: 0.1em; text-transform: uppercase;
      width: 38%; border-bottom: 1px solid rgba(200,152,42,0.12);
    }
    .td-val {
      padding: 0.65rem 0.5rem; color: var(--paper);
      font-family: var(--font-body);
      border-bottom: 1px solid rgba(200,152,42,0.12);
    }
    tr:hover .td-label,
    tr:hover .td-val { background: rgba(200,152,42,0.04); }
  `]
})
export class TabInfoComponent implements OnInit {
  // — lógica TypeScript sin cambios —
  show:    ShowDetails | null = null;
  loading = true;
  error   = '';
  showId  = environment.showId;
  stats:  { val: string; label: string }[] = [];
  rows:   { label: string; value: string }[] = [];

  constructor(private tmdb: TmdbService) {}

  ngOnInit(): void {
    this.tmdb.getShowDetails().subscribe({
      next: (data) => {
        this.show = data;
        this.buildStats(data);
        this.buildRows(data);
        this.loading = false;
      },
      error: (e) => { this.error = e.message; this.loading = false; }
    });
  }

  private buildStats(d: ShowDetails): void {
    this.stats = [
      { val: '⭐ ' + d.vote_average.toFixed(1),    label: 'Puntuación' },
      { val: d.vote_count.toLocaleString(),          label: 'Votos' },
      { val: String(d.number_of_seasons),            label: 'Temporadas' },
      { val: String(d.number_of_episodes),           label: 'Episodios' },
      { val: (d.episode_run_time[0] ?? 55) + 'min', label: 'Duración ep.' },
      { val: d.popularity.toFixed(0),                label: 'Popularidad' },
    ];
  }

  private buildRows(d: ShowDetails): void {
    this.rows = [
      { label: 'Título original',  value: d.original_name },
      { label: 'Idioma original',  value: d.original_language?.toUpperCase() },
      { label: 'Idiomas hablados', value: d.spoken_languages.map(l => l.name).join(', ') },
      { label: 'Primer episodio',  value: d.first_air_date },
      { label: 'Último episodio',  value: d.last_air_date },
      { label: 'Estado',           value: d.status },
      { label: 'Tipo',             value: d.type },
      { label: 'Productoras',      value: d.production_companies.map(c => c.name).join(', ') },
      { label: 'Géneros',          value: d.genres.map(g => g.name).join(', ') },
    ];
  }
}