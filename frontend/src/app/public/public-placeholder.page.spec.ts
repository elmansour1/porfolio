import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProfileApiService } from '../admin/profile/profile-api.service';
import { PublicPlaceholderPage } from './public-placeholder.page';

describe('PublicPlaceholderPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicPlaceholderPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: ProfileApiService,
          useValue: {
            publicPortfolio: () =>
              of({
                profilePublished: false,
                language: 'fr',
                settings: {
                  publicSiteName: 'Portfolio professionnel',
                  monogram: 'FE',
                  defaultLanguage: 'fr',
                  activeLanguages: ['fr', 'en'],
                  footerCopyright: null,
                  maintenanceMode: false,
                  logoUrl: null,
                  faviconUrl: null,
                },
                profile: null,
                sections: [],
              }),
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the public unpublished profile state', () => {
    const fixture = TestBed.createComponent(PublicPlaceholderPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Profil non publié');
  });
});
