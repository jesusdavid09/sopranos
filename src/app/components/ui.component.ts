import { Component, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="loader">
      <div class="loader-bullets">
        <div class="bullet b1"></div>
        <div class="bullet b2"></div>
        <div class="bullet b3"></div>
      </div>
      <span class="loader-text">Consultando API…</span>
    </div>
  `,
  styles: [`
    .loader {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 3.5rem; gap: 1.2rem;
    }
    .loader-bullets { display: flex; gap: 0.5rem; align-items: flex-end; }
    .bullet {
      width: 10px; height: 22px;
      background: linear-gradient(180deg, var(--gold-pale), var(--gold-dim));
      border-radius: 50% 50% 15% 15%;
      animation: bulletBounce 1s ease-in-out infinite;
    }
    .b1 { animation-delay: 0s; }
    .b2 { animation-delay: 0.15s; }
    .b3 { animation-delay: 0.3s; }
    @keyframes bulletBounce {
      0%, 100% { transform: translateY(0);    opacity: 0.45; }
      50%       { transform: translateY(-14px); opacity: 1;    }
    }
    .loader-text {
      font-family: var(--font-type);
      font-size: 0.72rem; letter-spacing: 0.28em;
      color: var(--paper-dark); text-transform: uppercase;
      animation: flicker 3s infinite;
    }
  `]
})
export class LoaderComponent {}

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-box">
      <span class="error-icon">✕</span>
      <span class="error-msg">{{ msg }}</span>
    </div>
  `,
  styles: [`
    .error-box {
      display: flex; align-items: flex-start; gap: 0.75rem;
      background: rgba(50,8,8,0.85);
      border: 1px solid var(--blood);
      border-left: 4px solid var(--blood-bright);
      padding: 1rem 1.2rem;
      font-family: var(--font-type); font-size: 0.8rem; color: #d08080;
    }
    .error-icon {
      color: var(--blood-bright); font-weight: 700;
      font-size: 0.9rem; flex-shrink: 0; margin-top: 0.05rem;
    }
    .error-msg { line-height: 1.6; }
  `]
})
export class ErrorComponent {
  @Input() msg = '';
}

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span class="badge"
      [class.badge--blood]="color === 'red'"
      [class.badge--gold]="color === 'gold'">
      <ng-content />
    </span>
  `,
  styles: [`
    .badge {
      font-family: var(--font-type);
      font-size: 0.6rem; letter-spacing: 0.12em;
      text-transform: uppercase; padding: 0.2rem 0.6rem;
      border: 1px solid var(--border-gold);
      color: var(--gold); background: rgba(20,14,6,0.8);
      white-space: nowrap;
    }
    .badge--blood { border-color: var(--blood); color: #d06060; background: rgba(30,5,5,0.8); }
    .badge--gold  { border-color: var(--gold);  color: var(--gold-pale); background: rgba(200,152,42,0.12); }
  `]
})
export class BadgeComponent {
  @Input() color: 'default' | 'red' | 'gold' = 'default';
}

@Component({
  selector: 'app-endpoint-tag',
  standalone: true,
  template: `<code class="endpoint">GET {{ path }}</code>`,
  styles: [`
    .endpoint {
      font-family: var(--font-type);
      font-size: 0.68rem; color: var(--paper-dark);
      margin-bottom: 1.2rem;
      background: rgba(8,6,3,0.9);
      padding: 0.4rem 0.8rem;
      border-left: 3px solid var(--gold-dim);
      display: block; letter-spacing: 0.05em;
    }
  `]
})
export class EndpointTagComponent {
  @Input() path = '';
}