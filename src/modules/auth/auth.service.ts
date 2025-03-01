import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { User } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateNonce(walletAddress: string): Promise<string> {
    // 生成随机nonce
    const nonce = ethers.randomBytes(32).toString()
    
    // 查找或创建用户
    let user = await this.userRepository.findOne({ where: { walletAddress } });
    if (!user) {
      user = this.userRepository.create({ walletAddress });
    }
    
    user.nonce = nonce;
    await this.userRepository.save(user);
    
    return nonce;
  }

  async verifySignature(walletAddress: string, signature: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { walletAddress } });
    if (!user || !user.nonce) {
      throw new UnauthorizedException('Invalid wallet address or nonce');
    }

    // 构造消息
    const message = `Welcome to Meme Genix!\n\nPlease sign this message to verify your wallet ownership.\n\nNonce: ${user.nonce}`;
    
    try {
      // 恢复签名者地址
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        throw new UnauthorizedException('Invalid signature');
      }

      // 生成JWT token
      const payload = { sub: user.id, wallet: walletAddress };
      const token = this.jwtService.sign(payload);

      // 清除nonce
      user.nonce = null;
      await this.userRepository.save(user);

      return token;
    } catch (error) {
      throw new UnauthorizedException('Invalid signature');
    }
  }

  async validateUser(walletAddress: string): Promise<User> {
    return this.userRepository.findOne({ where: { walletAddress } });
  }
}
