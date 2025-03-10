import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { google } from 'googleapis';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify Google OAuth token
      const client = new google.auth.OAuth2();
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
      });

      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Invalid Google token');

      // Attach user info to request
      request.user = {
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
