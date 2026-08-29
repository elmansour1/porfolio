import { SelectOption } from '../../../../shared/models/select-option.model';

export type ContactMessageStatus = 'NEW' | 'READ' | 'TO_REPLY' | 'REPLIED' | 'ARCHIVED' | 'SPAM';

export type ContactRequestType = 'GENERAL' | 'PROJECT' | 'JOB' | 'PARTNERSHIP' | 'OTHER';

export interface ContactMessageSummary {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly company: string | null;
  readonly requestType: ContactRequestType;
  readonly subject: string;
  readonly status: ContactMessageStatus;
  readonly createdAt: string;
}

export interface ContactMessageDetail extends ContactMessageSummary {
  readonly message: string;
  readonly consent: boolean;
  readonly ipAddress: string | null;
  readonly userAgent: string | null;
  readonly updatedAt: string;
}

export interface ContactMetadata {
  readonly statuses: readonly SelectOption<ContactMessageStatus>[];
  readonly requestTypes: readonly SelectOption<ContactRequestType>[];
}
