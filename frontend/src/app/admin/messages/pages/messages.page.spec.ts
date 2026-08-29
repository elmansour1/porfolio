import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { MessagesApiService } from '../api/messages-api.service';
import { ContactMessageDetail, ContactMessageSummary } from '../models/dto/message.dto';
import { MessagesPage } from './messages.page';

describe('MessagesPage', () => {
  let fixture: ComponentFixture<MessagesPage>;
  let api: jasmine.SpyObj<MessagesApiService>;

  const summary: ContactMessageSummary = {
    id: 'message-1',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    company: null,
    requestType: 'GENERAL',
    subject: 'Demande de devis',
    status: 'NEW',
    createdAt: '2026-08-01T10:00:00Z',
  };

  const detail: ContactMessageDetail = {
    ...summary,
    message: 'Bonjour, je souhaite en savoir plus sur vos services.',
    consent: true,
    ipAddress: '203.0.113.10',
    userAgent: 'Mozilla/5.0',
    updatedAt: '2026-08-01T10:00:00Z',
  };

  beforeEach(async () => {
    api = jasmine.createSpyObj<MessagesApiService>('MessagesApiService', [
      'metadata',
      'list',
      'detail',
      'updateStatus',
    ]);
    api.metadata.and.returnValue(
      of({
        statuses: [
          { label: 'Nouveau', value: 'NEW' },
          { label: 'Lu', value: 'READ' },
          { label: 'À répondre', value: 'TO_REPLY' },
          { label: 'Répondu', value: 'REPLIED' },
          { label: 'Archivé', value: 'ARCHIVED' },
          { label: 'Spam', value: 'SPAM' },
        ],
        requestTypes: [{ label: 'Question générale', value: 'GENERAL' }],
      }),
    );
    api.list.and.returnValue(of({ items: [summary], page: 0, size: 50, totalItems: 1, totalPages: 1 }));
    api.detail.and.returnValue(of(detail));
    api.updateStatus.and.returnValue(of({ ...detail, status: 'READ' }));

    await TestBed.configureTestingModule({
      imports: [MessagesPage, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MessagesApiService, useValue: api },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesPage);
    fixture.detectChanges();
  });

  it('loads and displays the message list on init', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(api.metadata).toHaveBeenCalled();
    expect(api.list).toHaveBeenCalled();
    expect(element.textContent).toContain('Jean Dupont');
    expect(element.textContent).toContain('Demande de devis');
  });

  it('opens the detail dialog with full message content', () => {
    fixture.componentInstance.openDetail(summary);
    fixture.detectChanges();

    expect(api.detail).toHaveBeenCalledWith('message-1');
    expect(fixture.componentInstance.detailDialogVisible()).toBeTrue();
    expect(fixture.componentInstance.detail()?.message).toContain('vos services');
  });

  it('saves a status change and refreshes the list', () => {
    fixture.componentInstance.openDetail(summary);
    fixture.detectChanges();

    fixture.componentInstance.statusControl.setValue('READ');
    fixture.componentInstance.saveStatus(detail);

    expect(api.updateStatus).toHaveBeenCalledWith('message-1', 'READ');
    expect(fixture.componentInstance.detailDialogVisible()).toBeFalse();
  });

  it('never exposes a reply or permanent delete action', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).not.toContain('Répondre');
    expect(element.textContent).not.toContain('Supprimer');
  });
});
