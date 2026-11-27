import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

jest.mock('@nestjs/swagger', () => ({
  ApiExtraModels: () => () => undefined,
  ApiProperty: () => () => undefined,
  getSchemaPath: () => '',
}));

import { MessageDto, SendMessageDto } from './chat.dto';

describe('chat DTO validation', () => {
  it('preserves and validates message content with whitelist enabled', async () => {
    const payload = {
      modelConfig: {
        modelName: 'Google: Gemini 3.8 Flash',
        temperatureOrCreativity: 0.5,
        responseDetailLevel: 'balanced',
      },
      userData: { userIdentify: 'AzCodes', customInstruction: '' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Hello' },
            {
              type: 'file',
              data: 'data:image/png;base64,YQ==',
              mediaType: 'image/png',
            },
          ],
        },
      ],
    };

    const dto = plainToInstance(SendMessageDto, payload);
    const errors = await validate(dto, { whitelist: true });

    expect(errors).toHaveLength(0);
    expect(dto.messages[0].content).toEqual(payload.messages[0].content);
  });

  it('rejects a message with missing content', async () => {
    const dto = plainToInstance(MessageDto, { role: 'user' });

    const errors = await validate(dto, { whitelist: true });
    const contentError = errors.find((error) => error.property === 'content');

    expect(contentError?.constraints?.isArray).toBeDefined();
  });
});
