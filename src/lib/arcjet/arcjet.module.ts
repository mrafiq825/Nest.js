import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  ArcjetGuard,
  ArcjetModule,
  detectBot,
  shield,
  slidingWindow,
} from '@arcjet/nest';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ArcjetModule.forRootAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        key: configService.get<string>('ARCJET_KEY')!,
        rules: [
          // 1. Bot Protection
          detectBot({
            mode: 'LIVE',
            allow: [
              'CATEGORY:SEARCH_ENGINE',
              'CATEGORY:PREVIEW', // Link previews e.g. Slack, Discord
            ],
          }),
          // 2. Shield WAF protects against SQL Injection, XSS, and directory traversal
          shield({ mode: 'LIVE' }),
          // 3. Rate Limiting (Sliding Window)
          slidingWindow({
            mode: 'LIVE',
            interval: '2s', // Refill every 2 seconds
            max: 5, // Allow 5 requests per interval
          }),
        ],
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ArcjetGuard,
    },
  ],
  exports: [ArcjetModule],
})
export class ArcjetLibModule {}
