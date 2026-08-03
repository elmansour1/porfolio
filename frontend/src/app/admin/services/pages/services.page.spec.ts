import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ServicesApiService } from '../api/services-api.service';
import { ServicesPage } from './services.page';

describe('ServicesPage', () => {
  let fixture: ComponentFixture<ServicesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesPage, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: ServicesApiService,
          useValue: {
            metadata: () =>
              of({
                publicationStatuses: [
                  { label: 'Brouillon', value: 'DRAFT' },
                  { label: 'Publié', value: 'PUBLISHED' },
                  { label: 'Archivé', value: 'ARCHIVED' },
                ],
                ctaTypes: [{ label: 'Contact', value: 'CONTACT' }],
                skillOptions: [{ id: 'skill-1', name: 'Angular', categoryName: 'Frontend' }],
              }),
            list: () =>
              of({
                items: [],
                page: 0,
                size: 24,
                totalItems: 0,
                totalPages: 0,
              }),
            steps: () => of([]),
            detail: jasmine.createSpy('detail'),
            create: jasmine.createSpy('create'),
            update: jasmine.createSpy('update'),
            publish: jasmine.createSpy('publish'),
            unpublish: jasmine.createSpy('unpublish'),
            archive: jasmine.createSpy('archive'),
            reorder: jasmine.createSpy('reorder'),
            createStep: jasmine.createSpy('createStep'),
            updateStep: jasmine.createSpy('updateStep'),
            publishStep: jasmine.createSpy('publishStep'),
            unpublishStep: jasmine.createSpy('unpublishStep'),
            archiveStep: jasmine.createSpy('archiveStep'),
            reorderSteps: jasmine.createSpy('reorderSteps'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesPage);
    fixture.detectChanges();
  });

  it('renders PrimeNG filters without native select', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('p-select')).not.toBeNull();
    expect(element.querySelector('select')).toBeNull();
  });

  it('opens the service form with tabs, multiselects, toggleswitches and no native select', () => {
    fixture.componentInstance.openServiceDialog();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('p-tabs')).not.toBeNull();
    expect(element.querySelector('p-multiselect')).not.toBeNull();
    expect(element.querySelector('p-toggleswitch')).not.toBeNull();
    expect(element.querySelector('select')).toBeNull();
  });
});
