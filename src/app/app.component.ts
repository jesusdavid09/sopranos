import { Component }    from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment }  from '../environments/environment';

import { HeroBannerComponent }  from './components/hero-banner.component';
import { TabInfoComponent }     from './pages/tab-info.component';
import { TabSeasonsComponent }  from './pages/tab-seasons.component';
import { TabCastComponent }     from './pages/tab-cast.component';
import { TabVideosComponent }   from './pages/tab-videos.component';
import { TabKeywordsComponent } from './pages/tab-keywords.component';
import { TabSimilarComponent }  from './pages/tab-similar.component';

interface Tab { id: string; label: string; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeroBannerComponent,
    TabInfoComponent,
    TabSeasonsComponent,
    TabCastComponent,
    TabVideosComponent,
    TabKeywordsComponent,
    TabSimilarComponent,
  ],
  template: `
    <div class="app">
      <div class="bg-smoke"></div>
      <div class="bg-vignette"></div>

      <!-- HEADER -->
      <header class="header">
        <div class="header-ornament">✦ ✦ ✦</div>
        <div class="eyebrow">— La Famiglia —</div>
        <h1 class="h1">
          <span class="h1-the">The</span>
          <span class="h1-main">Sopranos</span>
        </h1>
        <div class="header-rule">
          <span class="rule-line"></span>
          <span class="rule-diamond">◆</span>
          <span class="rule-line"></span>
        </div>
        <p class="subtitle">Serie ID: {{ showId }} &nbsp;·&nbsp; New Jersey, 1999</p>
      </header>

      <!-- MAIN -->
      <main class="main">

        <div class="key-warning" *ngIf="keyMissing">
          <span class="warn-icon">⚠</span>
          <span>Configura tu API Key en <code>environment.ts</code> antes de continuar.</span>
        </div>

        <app-hero-banner *ngIf="!keyMissing" />

        <!-- NAV -->
        <nav class="nav">
          <button
            class="nav-btn"
            *ngFor="let tab of tabs"
            [class.active]="activeTab === tab.id"
            (click)="activeTab = tab.id">
            {{ tab.label }}
          </button>
        </nav>

        <div class="nav-divider">
          <span class="rule-line"></span>
          <span class="rule-diamond small">◆</span>
          <span class="rule-line"></span>
        </div>

        <!-- CONTENT -->
        <ng-container *ngIf="!keyMissing; else noKey">
          <app-tab-info      *ngIf="activeTab === 'info'"     />
          <app-tab-seasons   *ngIf="activeTab === 'seasons'"  />
          <app-tab-cast      *ngIf="activeTab === 'cast'"     />
          <app-tab-videos    *ngIf="activeTab === 'videos'"   />
          <app-tab-keywords  *ngIf="activeTab === 'keywords'" />
          <app-tab-similar   *ngIf="activeTab === 'similar'"  />
        </ng-container>

        <ng-template #noKey>
          <div class="panel-placeholder">
            Configura tu API Key en <code>environment.ts</code> para ver el contenido.
          </div>
        </ng-template>

      </main>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="footer-rule">
          <span class="rule-line"></span>
          <span class="rule-diamond small">◆</span>
          <span class="rule-line"></span>
        </div>
        <p>
          Datos provistos por
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener">TMDB API</a>
          &nbsp;·&nbsp; <em>"Watch what you say around here."</em>
        </p>
      </footer>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      background: var(--ink2);
      color: var(--paper);
      font-family: var(--font-body);
      position: relative;
      overflow-x: hidden;
    }

    /* FONDOS */
    .bg-smoke {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background:
        radial-gradient(ellipse 70% 60% at 15% 20%, rgba(90,50,10,0.18) 0%, transparent 65%),
        radial-gradient(ellipse 50% 70% at 85% 80%, rgba(60,15,15,0.15) 0%, transparent 65%),
        radial-gradient(ellipse 80% 40% at 50% 50%, rgba(40,28,10,0.10) 0%, transparent 70%);
    }
    .bg-vignette {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background: radial-gradient(ellipse 100% 100% at 50% 50%,
        transparent 40%, rgba(0,0,0,0.65) 100%);
    }

    /* HEADER */
    .header {
      position: relative; z-index: 5;
      text-align: center;
      padding: 3.5rem 1rem 2.5rem;
      border-bottom: 1px solid var(--border-gold);
      background: linear-gradient(to bottom, rgba(10,7,2,0.95), rgba(15,10,4,0.7));
    }
    .header::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg,
        transparent 0%, var(--gold-dim) 20%, var(--gold) 50%, var(--gold-dim) 80%, transparent 100%);
    }
    .header-ornament {
      font-size: 0.55rem; letter-spacing: 0.8em;
      color: var(--gold-dim); margin-bottom: 0.8rem;
      font-family: var(--font-type);
    }
    .eyebrow {
      font-family: var(--font-type);
      font-size: 0.78rem; letter-spacing: 0.5em;
      color: var(--gold); text-transform: uppercase;
      margin-bottom: 1.2rem;
      animation: flicker 8s infinite;
    }
    .h1 {
      line-height: 1; margin: 0 0 1rem;
      display: flex; flex-direction: column; align-items: center; gap: 0.1rem;
    }
    .h1-the {
      font-family: var(--font-display);
      font-style: italic; font-weight: 400;
      font-size: clamp(1.2rem, 3vw, 1.8rem);
      color: var(--paper-dark);
      letter-spacing: 0.35em; text-transform: uppercase;
    }
    .h1-main {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: clamp(3rem, 10vw, 6.5rem);
      color: var(--paper);
      letter-spacing: -0.02em;
      text-shadow:
        0 0 80px rgba(200,152,42,0.25),
        0 4px 8px rgba(0,0,0,0.9),
        0 1px 0 rgba(200,152,42,0.4);
      line-height: 0.9;
    }

    /* SEPARADORES */
    .header-rule, .nav-divider {
      display: flex; align-items: center; gap: 0.8rem;
      margin: 1rem auto; max-width: 300px;
    }
    .rule-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-dim), transparent); }
    .rule-diamond       { color: var(--gold); font-size: 0.65rem; flex-shrink: 0; }
    .rule-diamond.small { font-size: 0.45rem; }

    .subtitle {
      font-family: var(--font-type);
      font-size: 0.72rem; letter-spacing: 0.25em; color: var(--paper-dark);
      margin-top: 0.8rem;
    }

    /* MAIN */
    .main {
      position: relative; z-index: 5;
      max-width: 1140px; margin: 0 auto;
      padding: 2rem 1.2rem 5rem;
    }

    /* WARNING */
    .key-warning {
      display: flex; align-items: center; gap: 0.8rem;
      background: rgba(60,10,10,0.7);
      border: 1px solid var(--blood);
      border-left: 4px solid var(--blood-bright);
      padding: 1rem 1.2rem; margin-bottom: 1.5rem;
      font-family: var(--font-type); font-size: 0.82rem; color: #d08080;
    }
    .warn-icon { font-size: 1.1rem; flex-shrink: 0; }

    /* NAV */
    .nav {
      display: flex; flex-wrap: wrap; gap: 0;
      margin: 1.5rem 0 0;
      border: 1px solid var(--border-gold);
      overflow: hidden;
    }
    .nav-btn {
      flex: 1; min-width: 100px;
      padding: 0.75rem 0.5rem;
      background: rgba(15,10,5,0.9);
      border: none; border-right: 1px solid var(--border-gold);
      color: var(--paper-dark);
      font-family: var(--font-type);
      font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase;
      cursor: pointer; transition: all 0.2s; position: relative;
    }
    .nav-btn:last-child { border-right: none; }
    .nav-btn::after {
      content: '';
      position: absolute; bottom: 0; left: 50%; right: 50%;
      height: 2px; background: var(--gold);
      transition: left 0.25s, right 0.25s;
    }
    .nav-btn:hover { background: rgba(30,20,8,0.95); color: var(--gold-pale); }
    .nav-btn:hover::after { left: 0; right: 0; }
    .nav-btn.active { background: rgba(200,152,42,0.1); color: var(--gold-pale); }
    .nav-btn.active::after { left: 0; right: 0; }

    .nav-divider { margin: 0.8rem auto 1.2rem; max-width: 200px; }

    /* PLACEHOLDER */
    .panel-placeholder {
      background: var(--panel); border: 1px solid var(--border-gold);
      padding: 2rem; text-align: center;
      font-family: var(--font-type); font-size: 0.82rem; color: var(--paper-dim, var(--paper-dark));
    }

    /* FOOTER */
    .footer {
      position: relative; z-index: 5;
      text-align: center; padding: 1.5rem 1rem 2rem;
      border-top: 1px solid var(--border-gold);
      font-family: var(--font-type);
      font-size: 0.68rem; letter-spacing: 0.08em; color: var(--paper-dark);
    }
    .footer-rule { margin: 0 auto 0.8rem; max-width: 200px; }
    .footer p { font-style: italic; }
    .footer a { color: var(--gold); }
    .footer a:hover { color: var(--gold-pale); }

    @media (max-width: 640px) {
      .nav-btn  { font-size: 0.6rem; padding: 0.6rem 0.3rem; }
      .h1-main  { font-size: clamp(2.5rem, 12vw, 4rem); }
    }
  `]
})
export class AppComponent {
  activeTab  = 'info';
  showId     = environment.showId;
  keyMissing = !environment.tmdbApiKey || environment.tmdbApiKey === 'INGRESA_TU_API_KEY_AQUI';

  tabs: Tab[] = [
    { id: 'info',     label: '📋 Información' },
    { id: 'seasons',  label: '📺 Temporadas'  },
    { id: 'cast',     label: '🎭 Reparto'     },
    { id: 'videos',   label: '🎬 Videos'      },
    { id: 'keywords', label: '🏷 Keywords'    },
    { id: 'similar',  label: '🔗 Similares'   },
  ];
}