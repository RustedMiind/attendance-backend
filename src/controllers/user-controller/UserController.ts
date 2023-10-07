import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import validator from "validator";
import bcrypt from "bcrypt";
import { token } from "./createToken";
import loginFunction from "./login";
import createNewUserFunction from "./createNewUser";

const createNewUser = createNewUserFunction;
const login = loginFunction;

export default { createNewUser, login };
