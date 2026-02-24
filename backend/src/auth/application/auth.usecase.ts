import { Injectable, UnauthorizedException, ConflictException, Inject } from "@nestjs/common";
import type { UserRepository } from "../domain/user.repository";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { User } from "../domain/user.entity";

@Injectable()
export class AuthUsecase {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ){}

    async register(dto: RegisterDto) {
        const existing = await this.userRepository.findByUsername(dto.username);
        if (existing) throw new ConflictException('Username sudah terdaftar');

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newUser = User.createParent(dto.username, hashedPassword);

        return this.userRepository.create(newUser);
    }

    async login(dto: LoginDto) {
        const user = await this.userRepository.findByUsername(dto.username);
        if (!user) throw new UnauthorizedException('Invalid credential');

        const isMatch = await bcrypt.compare(dto.password, user.getPassword);
        if (!isMatch) throw new UnauthorizedException('Invalid credential');

        const payload = { 
            sub: user.getId, 
            username: user.getUsername, 
            role: user.getRole 
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: { 
                id: user.getId, 
                username: user.getUsername, 
                role: user.getRole }
        };
    }
}