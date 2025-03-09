import { BadGatewayException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly dataservice: DatabaseService,
    private readonly jwtservice: JwtService
  ){}

  async login(loginData: LoginDto) {
    const { email, password } = loginData;
  
    console.log(email);
    console.log(password);
  
    const user = await this.dataservice.user.findFirst({
      where: { email }
    });
  
    if (!user) {
      throw new NotFoundException("No user exists with the entered email");
    }
  
    // Check if user was created via Google OAuth (no password stored)
    if (!user.password) {
      throw new UnauthorizedException("This account is linked to Google. Please sign in with Google.");
    }
  
    console.log(user);
  
    // Compare hashed password
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      throw new NotFoundException("Wrong Password");
    }
  
    console.log(this.jwtservice.sign({ email }));
  
    return {
      token: this.jwtservice.sign({ email })
    };
  }
  

  async register(registerData: RegisterUserDto) {
    const user = await this.dataservice.user.findFirst({
      where:{
        email: registerData.email
      }
    })
    if(user){
      throw new BadGatewayException('User with this email already exists')
    }
    registerData.password = await bcrypt.hash(registerData.password, 10)
    const res = await this.dataservice.user.create({data: registerData})
    return res;
  }
  async validateGoogleUser(profile: any, accessToken: string, refreshToken: string) {
    let user = await this.dataservice.user.findFirst({ 
      where: { googleId: profile.id } 
    });
  
    if (!user) {
      // Check if a user with the same email exists
      user = await this.dataservice.user.findFirst({ where: { email: profile.emails[0].value } });
  
      if (user) {
        // If user exists, update it with Google ID and tokens
        user = await this.dataservice.user.update({
          where: { email: profile.emails[0].value },
          data: { googleId: profile.id, accessToken, refreshToken }
        });
      } else {
        // Create a new user
        user = await this.dataservice.user.create({
          data: {
            email: profile.emails[0].value,
            name: profile.displayName,
            googleId: profile.id,
            accessToken,
            refreshToken,
          }
        });
      }
    }
  
    return user;
  }

  async refreshGoogleToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });
  
      const data = await response.json();
      if (data.access_token) return data.access_token;
      console.error('Failed to refresh token:', data);
      return null;
    } catch (error) {
      console.error('Error refreshing Google token:', error);
      return null;
    }
  }
  

  async getGoogleAdsCustomerId(accessToken: string): Promise<string | null> {
    let token = accessToken; // Use provided access token
    const url = 'https://googleads.googleapis.com/v19/customers:listAccessibleCustomers';
  
    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'developer-token': process.env.GOOGLE_DEVELOPER_TOKEN as string, // ✅ Include developer token
        },
      });
  
      // Handle expired token
      if (response.status === 401 && process.env.GOOGLE_REFRESH_TOKEN) {
        console.warn('Access token expired, attempting to refresh...');
  
        const token2 = await this.refreshGoogleToken(process.env.GOOGLE_REFRESH_TOKEN);
  
        if (!token2) {
          console.error('Failed to refresh access token');
          return null;
        }
  
        // Retry with refreshed token
        response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token2}`,
            Accept: 'application/json',
            'developer-token': process.env.GOOGLE_DEVELOPER_TOKEN as string, // ✅ Ensure token is sent again
          },
        });
      }
  
      const text = await response.text();
      console.log('Google Ads API Response:', text);
  
      if (!response.ok) {
        console.error('Google API Error:', text);
        return null;
      }
  
      const data = JSON.parse(text);
      return data.resourceNames?.[0]?.split('/')[1] || null;
    } catch (error) {
      console.error('Error fetching Google Ads Customer ID:', error);
      return null;
    }
  }
  
  

  generateJwtToken(user: any, customerId: string | null): string {
    return this.jwtservice.sign({ 
      email: user.email, 
      customerId: customerId || 'none' // Provide a default value if null
    });
  }

  
}
