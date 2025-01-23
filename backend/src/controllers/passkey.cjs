const { convertChallenge, getNewChallenge } = require("../utils/helper");
const SimpleWebAuthnServer = require("@simplewebauthn/server");
const { PrismaClient } = require("@prisma/client");

const rpID = "localhost";
const prisma = new PrismaClient();
const expectedOrigin = "http://localhost:3000";

exports.registerStart = async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  const challenge = getNewChallenge();
  await prisma.user.update({ where: { email }, data: { challenge } });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const pubKey = {
    challenge: challenge,
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

exports.registerFinish = async (req, res) => {
  const { email, pubKey } = req.body;
  const data = pubKey.data;
  console.log("data", data);
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
try {
  verification = await SimpleWebAuthnServer.verifyRegistrationResponse({
    response: pubKey.data,
    expectedChallenge: convertChallenge(expectedChallenge),
    expectedOrigin,
    expectedRPID: rpID,
  });
} catch (error) {
  console.error(error);
  return res.status(400).send({ error: (error).message });
}
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

  return res.status(500).json({ success: false, message: "Verification failed" });
};

exports.loginStart = async (req, res) => {
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

exports.loginFinish = async (req, res) => {
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
    return res.status(400).send({ error: error.message });
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
