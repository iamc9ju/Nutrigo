export enum OmiseCurrency {
  THB = 'thb',
}

export enum OmiseSourceType {
  PROMPTPAY = 'promptpay',
}

export interface OmiseChargeResponse {
  id: string;
  status: 'pending' | 'successful' | 'failed' | 'reversed';
  amount: number;
  metadata: Record<string, string>;
  source?: {
    type: string;
    scannable_code?: {
      image?: {
        download_uri?: string;
      };
    };
  };
}

export interface OmiseCreateChargePayload {
  amount: number;
  currency: string;
  source?: {
    type: string;
  };
  metadata?: Record<string, string>;
}
export interface IOmiseClient {
  charges: {
    create(payload: OmiseCreateChargePayload): Promise<OmiseChargeResponse>;
    retrieve(chargeId: string): Promise<OmiseChargeResponse>;
  };
}
