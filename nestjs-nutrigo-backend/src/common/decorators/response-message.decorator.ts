import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { RESPONSE_MESSAGE_METADATA } from '../constants/response.constants';
export const ResponseMessage = (message: string): CustomDecorator<string> => {
  return SetMetadata(RESPONSE_MESSAGE_METADATA, message);
};
