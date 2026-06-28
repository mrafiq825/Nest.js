import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { ArcjetGuard, ARCJET } from '@arcjet/nest';
import type { ArcjetNest } from '@arcjet/nest';
import type { Request } from 'express';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(ARCJET) private readonly arcjet: ArcjetNest,
  ) {}

  @Get('profile')
  getProfile(@Session() session: UserSession) {
    return {
      message: 'Successfully retrieved profile!',
      user: session.user,
      session: session.session,
    };
  }

  // 1. Declarative protection using NestJS Guard
  @Get('protected-by-guard')
  @UseGuards(ArcjetGuard)
  byGuard() {
    return { message: 'Passed ArcjetGuard inspection successfully!' };
  }

  // 2. Programmatic protection using Arcjet Client directly
  @Get('protected-by-code')
  async byCode(@Req() req: Request) {
    const decision = await this.arcjet.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new HttpException('Too many requests, try again later.', HttpStatus.TOO_MANY_REQUESTS);
      }
      if (decision.reason.isBot()) {
        throw new HttpException('Bots are not allowed.', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return { message: 'Passed programmatic Arcjet check successfully!' };
  }

  @Get()
  @Roles('ADMIN')
  @ResponseMessage('Fetch all users')
  findAll() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }
}
