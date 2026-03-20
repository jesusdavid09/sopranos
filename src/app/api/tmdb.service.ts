import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, of } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ShowDetails, SeasonDetails, CreditsResponse,
  VideosResponse, KeywordsResponse, ShowsResponse,
  SeasonCreditsResponse                            // ← nuevo import
} from './tmdb.models';

@Injectable({ providedIn: 'root' })
export class TmdbService {

  private readonly base   = environment.tmdbBaseUrl;
  private readonly apiKey = environment.tmdbApiKey;
  private readonly lang   = environment.tmdbLang;
  private readonly showId = environment.showId;

  constructor(private http: HttpClient) {}

  private params(extra: Record<string, string> = {}): HttpParams {
    let p = new HttpParams()
      .set('api_key',  this.apiKey)
      .set('language', this.lang);
    Object.entries(extra).forEach(([k, v]) => p = p.set(k, v));
    return p;
  }

  getShowDetails(): Observable<ShowDetails> {
    return this.http.get<ShowDetails>(
      `${this.base}/tv/${this.showId}`,
      { params: this.params() }
    );
  }

  getSeasonEpisodes(seasonNumber: number): Observable<SeasonDetails> {
    return this.http.get<SeasonDetails>(
      `${this.base}/tv/${this.showId}/season/${seasonNumber}`,
      { params: this.params() }
    );
  }

  getCredits(): Observable<CreditsResponse> {
    return this.http.get<CreditsResponse>(
      `${this.base}/tv/${this.showId}/aggregate_credits`,
      { params: this.params() }
    );
  }

  getVideos(): Observable<VideosResponse> {
    return this.http.get<VideosResponse>(
      `${this.base}/tv/${this.showId}/videos`,
      { params: this.params() }
    ).pipe(
      switchMap(res =>
        res.results?.length
          ? of(res)
          : this.http.get<VideosResponse>(
              `${this.base}/tv/${this.showId}/videos`,
              { params: this.params({ language: 'en-US' }) }
            )
      )
    );
  }

  getKeywords(): Observable<KeywordsResponse> {
    return this.http.get<KeywordsResponse>(
      `${this.base}/tv/${this.showId}/keywords`,
      { params: this.params() }
    );
  }

  getRecommendations(): Observable<ShowsResponse> {
    return this.http.get<ShowsResponse>(
      `${this.base}/tv/${this.showId}/recommendations`,
      { params: this.params() }
    );
  }

  getSimilar(): Observable<ShowsResponse> {
    return this.http.get<ShowsResponse>(
      `${this.base}/tv/${this.showId}/similar`,
      { params: this.params() }
    );
  }

  getSeasonCredits(seasonNumber: number): Observable<SeasonCreditsResponse> {
    return this.http.get<SeasonCreditsResponse>(
      `${this.base}/tv/${this.showId}/season/${seasonNumber}/credits`,
      { params: this.params() }
    );
  }
}