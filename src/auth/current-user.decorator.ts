import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './dto/auth.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload =>
    ctx.switchToHttp().getRequest().user,
);