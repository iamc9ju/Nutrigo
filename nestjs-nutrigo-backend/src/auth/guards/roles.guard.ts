import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Observable } from 'rxjs';
import { UserRole } from '@prisma/client';

// ทุกGuardต้องเรียกcanActivate
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} //Reflectorอ่านMetadata

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //getAllAndOverride : ถ้าmethod มี role ใช้ของ method ถ้า method ไม่มี role ใช้ของ class
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), //Methodที่เราเรียกอยู่
        context.getClass(), //Controller Class ทั้งก้อน
      ],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      // Fail-Closed: ถ้ามีการเรียกใช้ Guard นี้แต่ไม่ได้ระบุ @Roles ไว้ จะบล็อคทันที
      // ป้องกันกรณีที่ Developer ลืมเติม Role เข้ามา
      throw new ForbiddenException(
        'Access denied: No role permissions defined for this endpoint.',
      );
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException('User context or role not found');
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: Requires one of roles [${requiredRoles.join(', ')}]`,
      );
    }
    return true;
  }
}
