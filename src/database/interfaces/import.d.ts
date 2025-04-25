import { Request } from 'express';
import { DebtRoyalty, OkupaRoyalty, Royalty } from '.';
import { TFund, TRealtyType } from './enums';

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
    fund: TFund;
    royaltyType: TRealtyType;
    resetRealties: boolean;
    setRealtiesAsNew: boolean;
  };
}
