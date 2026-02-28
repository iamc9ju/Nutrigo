import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('Role-Based Access Control (RBAC) Guard Security', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  it('should THROW ForbiddenException if a PATIENT tries to access a NUTRITIONIST endpoint', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['nutritionist']);

    const mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            role: 'patient',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(() => rolesGuard.canActivate(mockContext)).toThrow(
      ForbiddenException,
    );
  });
});
