import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TmdbService }       from '../api/tmdb.service';
import { Video }             from '../api/tmdb.models';
import { environment }       from '../../environments/environment';
import { LoaderComponent, ErrorComponent, EndpointTagComponent } from '../components/ui.component';

@Component({
  selector: 'app-tab-videos',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ErrorComponent, EndpointTagComponent],
  template: `
    <app-loader *ngIf="loading" />
    <app-error  *ngIf="error"   [msg]="error" />

    <div class="panel" *ngIf="!loading && !error">
      <div class="panel-title">🎬 Videos — Trailers & Teasers</div>
      <app-endpoint-tag [path]="'/tv/' + showId + '/videos'" />

      <p class="empty" *ngIf="!videos.length">No hay videos disponibles.</p>

      <div class="videos-layout" *ngIf="videos.length">

        <!-- PLAYER PRINCIPAL -->
        <div class="player-wrap">
          <iframe
            class="player-iframe"
            [src]="activeUrl"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
          <div class="player-title-bar">
            <span class="player-icon">▶</span>
            <span class="player-name">{{ activeVideo?.name }}</span>
            <span class="player-type">{{ activeVideo?.type }}</span>
          </div>
        </div>

        <!-- PLAYLIST -->
        <div class="playlist">
          <div class="playlist-label">— Seleccionar —</div>
          <div
            class="playlist-item"
            *ngFor="let v of videos"
            [class.active]="v.key === activeVideo?.key"
            (click)="select(v)">
            <div class="thumb-wrap">
              <img
                [src]="'https://img.youtube.com/vi/' + v.key + '/mqdefault.jpg'"
                [alt]="v.name"
                class="thumb"
              />
              <div class="thumb-play" *ngIf="v.key !== activeVideo?.key">▶</div>
              <div class="thumb-playing" *ngIf="v.key === activeVideo?.key">
                <span class="bar b1"></span>
                <span class="bar b2"></span>
                <span class="bar b3"></span>
              </div>
            </div>
            <div class="item-info">
              <div class="item-name">{{ v.name }}</div>
              <div class="item-type">{{ v.type }} · {{ v.official ? '✅ Oficial' : 'No oficial' }}</div>
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
    .empty {
      font-family: var(--font-type); font-style: italic;
      font-size: 0.82rem; color: var(--paper-dark);
    }

    /* ── LAYOUT ── */
    .videos-layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 1.2rem;
      align-items: start;
    }

    /* ── PLAYER ── */
    .player-wrap {
      border: 1px solid var(--border-gold);
      background: #000;
      position: relative;
    }
    .player-iframe {
      width: 100%;
      aspect-ratio: 16/9;
      display: block;
      border: none;
    }
    .player-title-bar {
      display: flex; align-items: center; gap: 0.6rem;
      padding: 0.6rem 0.8rem;
      background: rgba(8,6,3,0.95);
      border-top: 1px solid var(--border-gold);
    }
    .player-icon { color: var(--gold); font-size: 0.65rem; flex-shrink: 0; }
    .player-name {
      font-family: var(--font-body); font-size: 0.8rem;
      color: var(--paper); font-weight: 700; flex: 1;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .player-type {
      font-family: var(--font-type); font-size: 0.6rem;
      color: var(--paper-dark); letter-spacing: 0.08em;
      text-transform: uppercase; flex-shrink: 0;
    }

    /* ── PLAYLIST ── */
    .playlist {
      display: flex; flex-direction: column; gap: 0;
      border: 1px solid var(--border-gold);
      max-height: 420px; overflow-y: auto;
    }
    .playlist-label {
      font-family: var(--font-type); font-size: 0.6rem;
      letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--gold-dim); text-align: center;
      padding: 0.5rem; border-bottom: 1px solid var(--border-gold);
      background: rgba(8,6,3,0.9);
    }
    .playlist-item {
      display: flex; gap: 0.6rem; align-items: flex-start;
      padding: 0.6rem; cursor: pointer;
      border-bottom: 1px solid rgba(200,152,42,0.1);
      transition: background 0.15s;
    }
    .playlist-item:last-child { border-bottom: none; }
    .playlist-item:hover { background: rgba(200,152,42,0.06); }
    .playlist-item.active { background: rgba(200,152,42,0.1); }

    /* THUMBNAIL */
    .thumb-wrap { position: relative; flex-shrink: 0; width: 72px; }
    .thumb {
      width: 72px; aspect-ratio: 16/9; object-fit: cover; display: block;
      border: 1px solid var(--border-gold);
      filter: sepia(0.15);
      transition: filter 0.2s;
    }
    .playlist-item:hover .thumb,
    .playlist-item.active .thumb { filter: sepia(0); border-color: var(--gold); }

    .thumb-play {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.4);
      color: rgba(200,152,42,0.9); font-size: 0.7rem;
      opacity: 0; transition: opacity 0.15s;
    }
    .playlist-item:hover .thumb-play { opacity: 1; }

    /* Barras animadas "reproduciendo" */
    .thumb-playing {
      position: absolute; inset: 0;
      display: flex; align-items: flex-end; justify-content: center;
      gap: 2px; padding-bottom: 5px;
      background: rgba(0,0,0,0.5);
    }
    .bar {
      width: 3px; background: var(--gold);
      animation: barBounce 0.8s ease-in-out infinite;
      border-radius: 1px;
    }
    .b1 { height: 8px;  animation-delay: 0s; }
    .b2 { height: 14px; animation-delay: 0.15s; }
    .b3 { height: 8px;  animation-delay: 0.3s; }
    @keyframes barBounce {
      0%, 100% { transform: scaleY(0.4); }
      50%       { transform: scaleY(1); }
    }

    .item-info { min-width: 0; }
    .item-name {
      font-family: var(--font-body); font-size: 0.72rem;
      color: var(--paper); font-weight: 700;
      line-height: 1.3; overflow: hidden;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    }
    .playlist-item.active .item-name { color: var(--gold-pale); }
    .item-type {
      font-family: var(--font-type); font-size: 0.6rem;
      color: var(--paper-dark); margin-top: 0.2rem; letter-spacing: 0.04em;
    }

    /* SCROLLBAR PLAYLIST */
    .playlist::-webkit-scrollbar { width: 4px; }
    .playlist::-webkit-scrollbar-track { background: var(--ink); }
    .playlist::-webkit-scrollbar-thumb { background: var(--border); }
    .playlist::-webkit-scrollbar-thumb:hover { background: var(--gold-dim); }

    @media (max-width: 700px) {
      .videos-layout { grid-template-columns: 1fr; }
      .playlist { max-height: 300px; }
    }
  `]
})
export class TabVideosComponent implements OnInit {
  videos:      Video[]          = [];
  activeVideo: Video | null     = null;
  activeUrl:   SafeResourceUrl  = '';
  loading = true;
  error   = '';
  showId  = environment.showId;

  constructor(
    private tmdb:      TmdbService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.tmdb.getVideos().subscribe({
      next: (data) => {
        this.videos  = data.results.filter(v => v.site === 'YouTube').slice(0, 9);
        if (this.videos.length) this.select(this.videos[0]);
        this.loading = false;
      },
      error: (e) => { this.error = e.message; this.loading = false; }
    });
  }

  select(v: Video): void {
    this.activeVideo = v;
    this.activeUrl   = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${v.key}?autoplay=1&rel=0&modestbranding=1`
    );
  }
}