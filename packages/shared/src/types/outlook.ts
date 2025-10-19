export interface OutlookEmail {
  id: string;
  subject: string;
  bodyPreview: string;
  receivedDateTime: string;
  from: {
    emailAddress: {
      address: string;
      name: string;
    };
  };
  toRecipients: Array<{
    emailAddress: {
      address: string;
      name: string;
    };
  }>;
  importance: 'low' | 'normal' | 'high';
  isRead: boolean;
  hasAttachments: boolean;
  flag?: {
    flagStatus: 'notFlagged' | 'flagged' | 'complete';
  };
  webLink: string;
  body?: {
    content: string;
    contentType: 'text' | 'html';
  };
}

export interface OutlookCalendarEvent {
  id: string;
  subject: string;
  bodyPreview?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName: string;
  };
  organizer?: {
    emailAddress: {
      address: string;
      name: string;
    };
  };
  attendees?: Array<{
    emailAddress: {
      address: string;
      name: string;
    };
    status: {
      response: 'none' | 'organizer' | 'tentativelyAccepted' | 'accepted' | 'declined' | 'notResponded';
    };
  }>;
  isAllDay: boolean;
  showAs: 'free' | 'tentative' | 'busy' | 'oof' | 'workingElsewhere' | 'unknown';
  webLink: string;
}
