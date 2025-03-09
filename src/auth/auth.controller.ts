import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

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
    return this.authService.login(loginData);
  }

  // ✅ Initiates Google OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This will redirect to Google OAuth2 consent screen
  }

  @Get('google/callback')
@UseGuards(AuthGuard('google'))
async googleAuthCallback(@Req() req: AuthenticatedRequest, @Res() res: Response) {
  console.log('Google OAuth Callback - req.user:', req.user); // Debugging
  
  if (!req.user || !req.user.accessToken) {
    console.error('Error: No user or access token found in request');
    return res.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Authentication failed: No access token received',
    });
  }
  
  try {
    // Initialize customerId to null
    let customerId: string | null = null;
    
    // Retrieve Google Ads customerId (handle if it fails)
    try {
      customerId = await this.authService.getGoogleAdsCustomerId(req.user.accessToken);
    } catch (error) {
      console.warn('Warning: Could not retrieve Google Ads Customer ID:', error.message);
      // customerId remains null
    }
    
    // Generate JWT token regardless of Google Ads access
    const jwtToken = this.authService.generateJwtToken(req.user, customerId);
    
    // Return the result as JSON
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      accessToken: jwtToken,
      customerId: customerId,
      userInfo: {
        email: req.user.email,
        name: req.user.name,
        hasGoogleAdsAccess: !!customerId
      }
    });
  } catch (error) {
    console.error('Error in Google callback processing:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Authentication processing failed',
      error: error.message
    });
  }
}
}