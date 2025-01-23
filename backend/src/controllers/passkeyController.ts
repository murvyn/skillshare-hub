import { Request, Response } from "express";
import { convertChallenge, generateAuthToken, getNewChallenge } from "../utils/helper";
import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";
const SimpleWebAuthnServer = require("@simplewebauthn/server");
import "dotenv/config";

const rpID = process.env.RP_ID || "localhost";
const expectedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
const prisma = new PrismaClient();

export const registerStart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const challenge = getNewChallenge();
    await prisma.user.update({ where: { email }, data: { challenge } });

    const pubKey: PublicKeyCredentialCreationOptions = {
      challenge: challenge as unknown as BufferSource,
      rp: { id: rpID, name: "webauthn-app" },
      user: { id: email, name: email, displayName: email },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "preferred",
        requireResidentKey: false,
      },
    };

    res.status(200).json(pubKey);
  } catch (error) {
    console.error("Error in registerStart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const registerFinish = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, pubKey } = req.body;
    if (!email || !pubKey?.data) {
      return res
        .status(400)
        .json({ message: "Email or registration data is missing" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { challenge: expectedChallenge } = user;
    if (!expectedChallenge) {
      return res.status(400).json({ message: "No challenge found for user" });
    }

    const { data } = pubKey;
    if (!data.response) {
      return res.status(400).json({ message: "Invalid registration data" });
    }

    const verification = await SimpleWebAuthnServer.verifyRegistrationResponse({
      response: data,
      expectedChallenge: convertChallenge(expectedChallenge),
      expectedOrigin,
      expectedRPID: rpID,
    });

    const { verified, registrationInfo } = verification;
    if (!verified || !registrationInfo) {
      return res
        .status(500)
        .json({ success: false, message: "Verification failed" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        passkeyID: registrationInfo.credential.id,
        publicKey: Buffer.from(registrationInfo.credential.publicKey),
        counter: registrationInfo.credential.counter,
        challenge: null,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error("Register Finish Error:", error);
    return res
      .status(500)
      .json({ error: "An error occurred during passkey registration" });
  }
};

export const loginStart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.passkeyID) {
      res.status(404).json({ message: "Passkey not registered" });
      return;
    }

    const challenge = getNewChallenge();
    await prisma.user.update({ where: { email }, data: { challenge } });

    const loginOptions = {
      challenge,
      rpId: rpID,
      allowCredentials: [
        {
          type: "public-key",
          id: user.passkeyID,
          transports: ["internal"],
        },
      ],
      userVerification: "preferred",
    };

    res.status(200).json({ email, data: loginOptions });
  } catch (error) {
    console.error("Error in loginStart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginFinish = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, pubKey } = req.body;
    if (!email || !pubKey?.data) {
      return res
        .status(400)
        .json({ message: "Email or login data is missing" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.publicKey || !user.passkeyID) {
      return res.status(404).json({ message: "Passkey not registered" });
    }

    const { challenge } = user;
    if (!challenge) {
      return res
        .status(400)
        .json({ message: "Challenge is missing or invalid" });
    }

    const verification =
      await SimpleWebAuthnServer.verifyAuthenticationResponse({
        response: pubKey.data,
        expectedChallenge: convertChallenge(challenge),
        credential: {
          id: user.passkeyID,
          publicKey: new Uint8Array(user.publicKey),
          counter: user.counter || 0,
        },
        expectedRPID: rpID,
        expectedOrigin,
        requireUserVerification: false,
      });

    const { verified, authenticationInfo } = verification;
    if (!verified) {
      return res.status(401).send({ success: false });
    }

    await prisma.user.update({
      where: { email },
      data: {
        counter: authenticationInfo.newCounter,
        challenge: null,
      },
    });

    const token = generateAuthToken(user)

    return res.status(200).send({ success: true });
  } catch (error) {
    logger.error("Login Finish Error:", error);
    return res
      .status(500)
      .json({ error: "An error occurred during passkey login" });
  }
};
