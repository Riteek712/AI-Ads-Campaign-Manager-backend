import { Controller, Get, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedRequest extends Request {
  user?: any; // Extend the request type to include user
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Post('register')
  @ApiOperation({ description:'To register a new user with email.', summary: 'Register a User with details.' })
  create(@Body() registerData: RegisterUserDto) {
    return this.authService.register(registerData);
  }

  @Post('login')
  @ApiOperation({ description:'Login with email.', summary: 'Endpoint to login with user email and password.' })
  login(@Body() loginData: LoginDto){
    return this.authService.login(loginData)
  }

  // ✅ Initiates Google OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This will redirect to Google OAuth2 consent screen
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new Error('User not found in request');
    }

    // Retrieve Google Ads customerId
    const customerId = await this.authService.getGoogleAdsCustomerId(req.user.accessToken);

    // Generate JWT token
    const jwtToken = this.authService.generateJwtToken(req.user, customerId);

    return {
      accessToken: jwtToken,
      customerId: customerId,
    };
  }
  

  
}
