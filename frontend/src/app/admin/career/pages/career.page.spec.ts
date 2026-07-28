import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { SkillsApiService } from '../../skills/api/skills-api.service';
import { CareerApiService } from '../api/career-api.service';
import { CareerPage } from './career.page';

describe('CareerPage', () => {
  let fixture: ComponentFixture<CareerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerPage, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: CareerApiService,
          useValue: {
            experiences: () => of([]),
            education: () => of([]),
            certifications: () => of([]),
            metadata: () =>
              of({
                publicationStatuses: [
                  { label: 'Brouillon', value: 'DRAFT' },
                  { label: 'Publié', value: 'PUBLISHED' },
                  { label: 'Archivé', value: 'ARCHIVED' },
                ],
                experienceTypes: [{ label: 'Emploi', value: 'EMPLOYMENT' }],
                contractTypes: [{ label: 'CDI', value: 'PERMANENT' }],
                workModes: [{ label: 'Hybride', value: 'HYBRID' }],
                educationLevels: [{ label: 'Master', value: 'MASTER' }],
              }),
            createExperience: jasmine.createSpy('createExperience'),
            updateExperience: jasmine.createSpy('updateExperience'),
            deleteExperience: jasmine.createSpy('deleteExperience'),
            createEducation: jasmine.createSpy('createEducation'),
            updateEducation: jasmine.createSpy('updateEducation'),
            deleteEducation: jasmine.createSpy('deleteEducation'),
            createCertification: jasmine.createSpy('createCertification'),
            updateCertification: jasmine.createSpy('updateCertification'),
            deleteCertification: jasmine.createSpy('deleteCertification'),
          },
        },
        {
          provide: SkillsApiService,
          useValue: { getSkills: () => of([]) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CareerPage);
    fixture.detectChanges();
  });

  it('renders career lists with PrimeNG filters and no native select', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Expériences, formations et certifications');
    expect(element.textContent).toContain('Aucune expérience');
    expect(element.querySelector('p-select')).not.toBeNull();
    expect(element.querySelector('select')).toBeNull();
  });

  it('uses PrimeNG selection and date components in the experience form', () => {
    fixture.componentInstance.openExperienceDialog();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('p-select')).not.toBeNull();
    expect(element.querySelector('p-multiselect')).not.toBeNull();
    expect(element.querySelector('p-datepicker')).not.toBeNull();
    expect(element.querySelector('input[type="date"]')).toBeNull();
    expect(element.querySelector('select')).toBeNull();
  });
});
