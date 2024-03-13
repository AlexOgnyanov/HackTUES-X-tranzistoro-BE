import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Request } from 'express';
import argon2 from 'argon2';

import { SessionEntity } from '../entities';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    readonly configService: ConfigService,
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const session = await this.sessionsRepository
      .createQueryBuilder('session')
      .select(['session.id', 'session.refreshToken'])
      .leftJoinAndSelect('session.user', 'user')
      .leftJoinAndSelect('user.role', 'role')
      .where('session.id = :sessionId', {
        sessionId: payload.sessionId,
      })
      .getOne();

    if (!session) {
      return null;
    }

    const refreshToken = req.headers.authorization.replace('Bearer', '').trim();
    const isRefreshTokensMatching = await argon2.verify(
      session.refreshToken,
      refreshToken,
    );

    if (!isRefreshTokensMatching) {
      await this.sessionsRepository.delete(payload.sessionId);
      return null;
    }

    const currentTime = new Date();
    if (payload.exp < currentTime.getTime() / 1000) {
      await this.sessionsRepository.delete(payload.sessionId);
      return null;
    }

    return { session };
  }
}
