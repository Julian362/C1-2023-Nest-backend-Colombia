import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class MiddlewaresMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('access_token ')) {
      const token = authHeader.substring(7);
      req.headers['Authorization'] = `access_token ${token}`;
    }

    next();
  }
}
