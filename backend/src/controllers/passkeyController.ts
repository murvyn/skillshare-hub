import { Request, Response } from "express";
import { getNewChallenge } from "../utils/helper";
import SimpleWebAuthnServer, {
  AuthenticationResponseJSON,
} from "@simplewebauthn/server";
import { PrismaClient } from "@prisma/client";

const rpId = "localhost";
const expectedOrigin = ["http://localhost:5000"];
const prisma = new PrismaClient();

export const registerStart = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  const challenge = getNewChallenge();
  await prisma.user.update({ where: { email }, data: { challenge } });

  const pubKey: PublicKeyCredentialCreationOptions = {
    challenge: challenge as unknown as BufferSource,
    rp: { id: rpId, name: "webauthn-app" },
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
  res.json(pubKey);
};
export const registerFinish = async (req: Request, res: Response): Promise<any> => {
  const { email, data } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const expectedChallenge = user.challenge;
  if (!expectedChallenge) {
    return res.status(400).json({ message: "No challenge found for user" });
  }

  let verification;
  try {
    verification = await SimpleWebAuthnServer.verifyRegistrationResponse({
      response: data,
      expectedChallenge,
      expectedOrigin,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: (error as Error).message });
  }
  const { verified, registrationInfo } = verification;
  if (verified) {
    await prisma.user.update({
      where: { email },
      data: {
        passkeyID: registrationInfo?.credential.id.toString(),
        publicKey: registrationInfo?.credential.publicKey.toString(),
        counter: registrationInfo?.credential.counter,
        challenge: null,
      },
    });
    return res.status(200).send(true);
  }
  res.status(500).send(false);
};

export const loginStart = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passkeyID) {
    return res.status(404).send({ message: "Passkey not registered" });
  }
  const challenge = getNewChallenge();
  await prisma.user.update({
    where: { email },
    data: { challenge },
  });

  res.json({
    challenge,
    rpId,
    allowCredentials: [
      {
        type: "public-key",
        id: Buffer.from(user.passkeyID, "base64"),
        transports: ["internal"],
      },
    ],
    userVerification: "preferred",
  });
};

export const loginFinish = async (req: Request, res: Response): Promise<any> => {
  const { email, data } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.publicKey || !user.passkeyID) {
    return res.status(404).json({ message: "Passkey not registered" });
  }

  if (!user.challenge) {
    return res.status(400).json({ message: "Challenge is missing or invalid" });
  }

  let verification;
  try {
    verification = await SimpleWebAuthnServer.verifyAuthenticationResponse({
      response: data as AuthenticationResponseJSON,
      expectedChallenge: user.challenge,
      credential: {
        id: Buffer.from(user.passkeyID, "base64").toString('base64'),
        publicKey: Buffer.from(user.publicKey, "base64"),
        counter: user.counter || 0,
      },
      expectedRPID: rpId,
      expectedOrigin,
      requireUserVerification: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: (error as Error).message });
  }
  const { verified, authenticationInfo } = verification;
  if (verified) {
    await prisma.user.update({
      where: { email },
      data: {
        counter: authenticationInfo.newCounter,
        challenge: null,
      },
    });
    return res.status(200).send({ success: true });
  }

  res.status(401).send({ success: false });
};
