import { Request } from 'express';

interface HandleManychatInteractionPayload extends Request {
  body: {
    phoneNumber: string;
    contactData: MContactData;
  };
}

interface CompletedChatbotPayload extends Request {
  body: {
    leadPhoneNumber: string;
    contactData: MContactData;
    receiverEmail: string;
  };
}
