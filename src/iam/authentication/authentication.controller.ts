import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { Response } from "express";
import { AuthType } from "./enum/auth-type.enum";
import { Auth } from "./decorator/auth.decorator";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Auth(AuthType.None)
@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {
  }

  @Post("sign-up")
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("sign-in")
  signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() signInDto: SignInDto) {
    const accessToken = this.authService.signIn(signInDto);

    res.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true
    })
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
