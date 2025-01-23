import { Request, Response } from "express";
import { convertChallenge, getNewChallenge } from "../utils/helper";
import SimpleWebAuthnServer, {
  AuthenticationResponseJSON,
  generateRegistrationOptions,
  RegistrationResponseJSON,
  verifyRegistrationResponse,VerifiedRegistrationResponse
} from "@simplewebauthn/server";
import { PrismaClient } from "@prisma/client";

const rpID = "localhost";
const prisma = new PrismaClient();
const expectedOrigin = "http://localhost:3000";

export const registerStart = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  const challenge = getNewChallenge();
  await prisma.user.update({ where: { email }, data: { challenge } });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

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
  res.json(pubKey);
};

export const registerFinish = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, pubKey } = req.body;
  const data = pubKey.data as RegistrationResponseJSON;
  console.log("data", data)
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const expectedChallenge = user.challenge;
  if (!expectedChallenge) {
    return res.status(400).json({ message: "No challenge found for user" });
  }

  if (!pubKey.data || !pubKey.data.response) {
    return res.status(400).json({ message: "Invalid registration data" });
  }


  let verification;
  // try {
    verification = await SimpleWebAuthnServer.verifyRegistrationResponse({
      response: pubKey.data,
      expectedChallenge: convertChallenge(expectedChallenge),
      expectedOrigin,
      expectedRPID: rpID,
    });
  // } catch (error) {
  //   console.error(error);
  //   return res.status(400).send({ error: (error as Error).message });
  // }
  const { verified, registrationInfo } = verification;
  if (verified && registrationInfo) {
    await prisma.user.update({
      where: { email },
      data: {
        passkeyID: registrationInfo?.credential.id.toString(),
        publicKey: registrationInfo?.credential.publicKey.toString(),
        counter: registrationInfo?.credential.counter,
        challenge: null,
      },
    });
    return res.status(200).json({ success: true });
  }

  return res
    .status(500)
    .json({ success: false, message: "Verification failed" });
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
    rpId: rpID,
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

export const loginFinish = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, pubKey } = req.body;
  const data = pubKey.data as AuthenticationResponseJSON;
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
      response: data,
      expectedChallenge: user.challenge,

      credential: {
        id: Buffer.from(user.passkeyID, "base64").toString("base64"),
        publicKey: Buffer.from(user.publicKey, "base64"),
        counter: user.counter || 0,
      },
      expectedRPID: rpID,
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
