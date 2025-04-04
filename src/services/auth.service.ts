import mongoose from 'mongoose';
import UserModel from '../models/user.model';
import AccountModel from '../models/account.model';
import WorkspaceModel from '../models/workspace.model';
import RoleModel from '../models/roles-permission.model';
import { Roles } from '../enums/role.enum';
import MemberModel from '../models/member.model';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '../utils/appError';
import { ProviderEnum } from '../enums/account-provider.enum';

export const loginOrCreateAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) => {
  const { provider, displayName, providerId, picture, email } = data;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const existingUser = await UserModel.findOne({ email }).session(session);

    if (!existingUser) {
      const user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });
      const account = new AccountModel({
        provider: provider,
        providerId: providerId,
        userId: user._id,
      });
      await account.save({ session });
      const workspace = new WorkspaceModel({
        name: 'My Workspace',
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });

      await workspace.save({ session });
      const ownerRole = await RoleModel.findOne({ name: Roles.ADMIN }).session(
        session
      );

      if (!ownerRole) {
        throw new BadRequestException('Owner role not found');
      }
      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    return { user: existingUser };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
  } finally {
    session.endSession();
  }
};

export const registerUserService = async (body: {
  name: string;
  email: string;
  password: string;
}) => {
  const { name, email, password } = body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const existingUser = await UserModel.findOne({ email }).session(session);

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const user = new UserModel({
      name,
      email,
      password,
    });
    await user.save({ session });

    const account = new AccountModel({
      provider: ProviderEnum.EMAIL,
      providerId: email,
      userId: user._id,
    });
    await account.save({ session });
    const workspace = new WorkspaceModel({
      name: 'My Workspace',
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });

    await workspace.save({ session });
    const ownerRole = await RoleModel.findOne({ name: Roles.ADMIN }).session(
      session
    );

    if (!ownerRole) {
      throw new BadRequestException('Owner role not found');
    }
    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save({ session });

    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      userId: user._id,
      workspaceId: workspace._id,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
  } finally {
    session.endSession();
  }
};

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) => {
  const account = await AccountModel.findOne({ email, providerId: email });
};
