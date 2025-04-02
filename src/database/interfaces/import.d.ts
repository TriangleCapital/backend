import { Request } from 'express';
import { DebtRoyalty, OkupaRoyalty, Royalty } from '.';
import { TRoyaltieType } from './enums';

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

interface UploadRoyaltiesPayload extends Request {
  body: {
    royalties: Royalty[];
    royaltyType: TRoyaltieType;
  };
}
