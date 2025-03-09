import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
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

  async login(loginData: LoginDto){
    const {email, password} = loginData;
    console.log(email)
    console.log(password)
    const user = await this.dataservice.user.findFirst({
      where:{
        email: email
      }
    })
    if(!user){
      throw new NotFoundException("No user exists with the entered email")
    }
    console.log(user)
    const validatePassword = await bcrypt.compare(password, user.password)
    if(!validatePassword){
      throw new NotFoundException("Wrong Password")
    }

    console.log(this.jwtservice.sign({email}))
    return {
      token: this.jwtservice.sign({email})
    }

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
  

  async getGoogleAdsCustomerId(accessToken: string): Promise<string> {
    const response = await fetch('https://googleads.googleapis.com/v12/customers:listAccessibleCustomers', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    return data.resourceNames?.[0]?.split('/')[1] || null;
  }

  generateJwtToken(user: any, customerId: string): string {
    return this.jwtservice.sign({ email: user.email, customerId });
  }

  
}
