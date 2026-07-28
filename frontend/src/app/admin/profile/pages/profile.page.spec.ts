import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProfileApiService } from '../api/profile-api.service';
import { ProfilePage } from './profile.page';

describe('ProfilePage', () => {
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: ProfileApiService,
          useValue: {
            getProfile: () =>
              of({
                id: 'profile-id',
                publicationStatus: 'DRAFT',
                firstName: 'Faouzi',
                lastName: 'El Mansour',
                displayName: 'Faouzi El Mansour',
                location: 'Douala',
                country: 'Cameroun',
                availabilityStatus: 'HIDDEN',
                professionalEmail: null,
                phone: null,
                showEmail: false,
                showPhone: false,
                showPhoto: true,
                showCv: false,
                showLinks: true,
                showStatistics: true,
                photo: null,
                cv: null,
                translations: [],
                links: [],
                statistics: [],
              }),
            saveProfile: jasmine.createSpy('saveProfile'),
            uploadProfilePhoto: jasmine.createSpy('uploadProfilePhoto'),
            deleteProfilePhoto: jasmine.createSpy('deleteProfilePhoto'),
            uploadCv: jasmine.createSpy('uploadCv'),
            deleteCv: jasmine.createSpy('deleteCv'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();
  });

  it('renders structured profile editing sections', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Profil professionnel');
    expect(element.textContent).toContain('Présentation publique');
    expect(element.textContent).toContain('Liens professionnels');
    expect(element.textContent).toContain('Statistiques professionnelles');
  });

  it('initializes the identity form from the API', () => {
    const component = fixture.componentInstance;

    expect(component.form.controls.displayName.value).toBe('Faouzi El Mansour');
    expect(component.form.controls.country.value).toBe('Cameroun');
  });
});
