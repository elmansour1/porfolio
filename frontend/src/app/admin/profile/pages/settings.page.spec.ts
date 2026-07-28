import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProfileApiService } from '../api/profile-api.service';
import { SettingsPage } from './settings.page';

describe('SettingsPage', () => {
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPage],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: ProfileApiService,
          useValue: {
            getSettings: () =>
              of({
                id: 'settings-id',
                publicSiteName: 'Faouzi Portfolio',
                monogram: 'FE',
                defaultLanguage: 'fr',
                activeLanguages: ['fr', 'en'],
                contactRecipientEmail: null,
                footerCopyright: null,
                showCvDownload: false,
                showContactDetails: false,
                showSocialLinks: true,
                maintenanceMode: false,
                logo: null,
                favicon: null,
                sections: [
                  { sectionKey: 'HERO', label: 'Hero', displayOrder: 10, visible: true },
                  { sectionKey: 'ABOUT', label: 'À propos', displayOrder: 20, visible: true },
                ],
              }),
            saveSettings: jasmine.createSpy('saveSettings'),
            uploadLogo: jasmine.createSpy('uploadLogo'),
            uploadFavicon: jasmine.createSpy('uploadFavicon'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    fixture.detectChanges();
  });

  it('renders typed settings and section visibility controls', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Paramètres généraux');
    expect(element.textContent).toContain('Site public');
    expect(element.textContent).toContain('Sections du portfolio');
    expect(element.textContent).toContain('Hero');
  });

  it('initializes language settings from the API', () => {
    const component = fixture.componentInstance;

    expect(component.form.controls.publicSiteName.value).toBe('Faouzi Portfolio');
    expect(component.form.controls.activeFr.value).toBeTrue();
    expect(component.form.controls.activeEn.value).toBeTrue();
  });
});
