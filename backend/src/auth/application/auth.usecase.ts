import { Injectable, UnauthorizedException, ConflictException, Inject } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';

import { User } from '../domain/user.entity';
import type { UserRepository } from "../domain/user.repository";

import { LoginInput, LoginOutput } from './dto/login.dto';
import { RegisterParentInput, RegisterUserOutput } from './dto/register.dto';
import { RegisterChildInput, RegisterChildOutput } from './dto/register.dto';

import type { IdGenerator } from '../../common/interfaces/id-generator.interface';
import type { TokenService } from './token-service.interface';
import type { PasswordHasher } from './password-hasher.interface';

import { UserErrorCode } from '../domain/user-error-code.enum';
import { DomainError } from '../../common/errors/domain.error';
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthUsecase {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,

        @Inject('IdGenerator')
        private readonly idGenerator: IdGenerator,

        @Inject('PasswordHasher')
        private readonly passwordHasher: PasswordHasher,

        @Inject('TokenService')
        private readonly tokenService: TokenService,

        private readonly prisma: PrismaService
    ) {}

    async registerParent(
        input: RegisterParentInput,
    ): Promise<RegisterUserOutput> {
        const existing = await this.userRepository.findByUsername(
            input.username,
        );
        if (existing)
            throw new DomainError(
                UserErrorCode.USERNAME_ALREADY_TAKEN,
                'Username already exists',
            );

        const hashedPassword = await this.passwordHasher.hash(input.password);

        const user = User.createParent(
            uuidv4(),
            input.username,
            hashedPassword,
        );
        const newUser = await this.userRepository.create(user);

        return RegisterUserOutput.create(newUser);
    }

    async registerChild(
        input: RegisterChildInput,
    ): Promise<RegisterChildOutput> {
        const parentUser = await this.userRepository.findById(input.parentId);
        if (!parentUser) {
            throw new DomainError(
                UserErrorCode.INVALID_PARENT,
                'Parent user not found',
            );
        }

        if (!parentUser.isParent()) {
            throw new DomainError(
                UserErrorCode.UNAUTHORIZED,
                'Only parent can create child accounts'
            );
        }

        const existingChild = await this.userRepository.findByUsername(input.username);
        if (existingChild) {
            throw new DomainError(
                UserErrorCode.USERNAME_ALREADY_TAKEN,
                'Username already exist',
            );
        }

        const hashedPin = await this.passwordHasher.hash(input.pin);

        const childId = uuidv4()

        const childUser = User.createChild(
            childId,
            input.username,
            hashedPin,
            parentUser.getId(),
        )

        const newChild = await this.userRepository.create(childUser);

        await this.prisma.childRelation.create({
            data: {
                id: uuidv4(),
                parentId: parentUser.getId(),
                childId: childId,
            }
        })

        return RegisterChildOutput.create(newChild);
    }

    async login(input: LoginInput): Promise<LoginOutput> {
        const user = await this.userRepository.findByUsername(input.username);
        if (!user)
            throw new DomainError(
                UserErrorCode.INVALID_CREDENTIALS,
                'Invalid username credentials',
            );

        const isMatch = await this.passwordHasher.compare(
            input.password,
            user.getHashedPassword(),
        );
        if (!isMatch)
            throw new DomainError(
                UserErrorCode.INVALID_CREDENTIALS,
                'Invalid password credentials',
            );

        const payload = {
            sub: user.getId(),
            username: user.getUsername(),
            role: user.getRole(),
        };

        return LoginOutput.create(
            await this.tokenService.generateAccessToken(payload),
            await this.tokenService.generateRefreshToken(payload),
            {
                id: user.getId(),
                username: user.getUsername(),
                role: user.getRole(),
            },
        );
    }
}