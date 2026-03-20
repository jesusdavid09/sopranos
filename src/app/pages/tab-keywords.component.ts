import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { TmdbService }       from '../api/tmdb.service';
import { Keyword }           from '../api/tmdb.models';
import { environment }       from '../../environments/environment';
import { LoaderComponent, ErrorComponent, EndpointTagComponent } from '../components/ui.component';

@Component({
  selector: 'app-tab-keywords',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ErrorComponent, EndpointTagComponent],
  template: `
    <app-loader *ngIf="loading" />
    <app-error  *ngIf="error"   [msg]="error" />

    <div class="panel" *ngIf="!loading && !error">
      <div class="panel-title">🏷️ Keywords / Etiquetas</div>
      <app-endpoint-tag [path]="'/tv/' + showId + '/keywords'" />

      <p class="empty" *ngIf="!keywords.length">Sin keywords disponibles.</p>

      <div class="kw-list" *ngIf="keywords.length">
        <span class="kw" *ngFor="let kw of keywords">{{ kw.name }}</span>
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
    .empty {
      font-family: var(--font-type); font-style: italic;
      font-size: 0.82rem; color: var(--paper-dark);
    }
    .kw-list { display: flex; flex-wrap: wrap; gap: 0.45rem; }
    .kw {
      padding: 0.28rem 0.75rem;
      border: 1px solid var(--border-gold);
      font-family: var(--font-type); font-size: 0.65rem;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--paper-dark); cursor: default;
      background: rgba(8,6,3,0.7);
      transition: all 0.2s;
    }
    .kw:hover {
      border-color: var(--gold); color: var(--gold);
      background: rgba(200,152,42,0.07);
    }
  `]
})
export class TabKeywordsComponent implements OnInit {
  keywords: Keyword[] = [];
  loading = true;
  error   = '';
  showId  = environment.showId;

  constructor(private tmdb: TmdbService) {}

  ngOnInit(): void {
    this.tmdb.getKeywords().subscribe({
      next: (data) => {
        this.keywords = data.results ?? data.keywords ?? [];
        this.loading  = false;
      },
      error: (e) => { this.error = e.message; this.loading = false; }
    });
  }
}