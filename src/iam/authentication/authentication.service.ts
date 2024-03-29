import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../users/entities/user.entity";
import { Repository } from "typeorm";
import { HashingService } from "../hashing/hashing.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../../../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { ActiveUserData } from "../interfaces/active-user.interface";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {
  }

  async signUp(signUpDto: SignUpDto) {
    try {


      const user = new User();

      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);

      await this.usersRepository.save(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = "23505";
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email
    });
    if (!user) {
      throw new UnauthorizedException("User does not exists");
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password
    );

    if (!isEqual) {
      throw new UnauthorizedException("Password does not match");
    }

    return await this.generateTokens(user);
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUserData, "sub">>(
        refreshTokenDto.refreshToken, {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret
        });

      const user = await this.usersRepository.findOneOrFail({ where: { id: sub } });

      return await this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException();
    }

  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTtl, { email: user.email }),
      this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.refreshToken, { email: user.email })
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  private signToken(userId: number, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync({
        sub: userId,
        ...payload
      } as ActiveUserData,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn
      }
    );
  }
}