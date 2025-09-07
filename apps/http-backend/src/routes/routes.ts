import { Router } from "express";
import { SigninSchema, SignupSchema } from "../types";
import "dotenv/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../mail";

const EMAIL_JWT_SECRET = process.env.EMAIL_JWT_SECRET as string;
const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const router: Router = Router();

router.post("/signup", async (req, res) => {
  const { data, success } = SignupSchema.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      message: "Incorrect Inputs",
    });
    return;
  }
  try {
    const token = await jwt.sign(
      {
        email: data.email,
      },
      EMAIL_JWT_SECRET
    );

    if (process.env.NODE_ENV == "production") {
      await sendEmail(data.email, token);
      res.json({
        message: "Email sent to your email address",
      });
      return;
    } else {
      console.log(
        `Please click: ${process.env.BACKEND_URL}/api/v1/signin/post?token=${token}`
      );
      res.json({
        message: "Link sent to the console",
      });
      return;
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });

    console.log(e);
  }
});

router.post("/signin", async (req, res) => {
  const { data, success } = SigninSchema.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      message: "Incorrect Inputs",
    });
    return;
  }
  try {
    const token = await jwt.sign(
      {
        email: data.email,
      },
      EMAIL_JWT_SECRET
    );

    if (process.env.NODE_ENV == "production") {
      await sendEmail(data.email, token);
      res.json({
        message: "Email sent to your email address",
      });
      return;
    } else {
      console.log(
        `Please click: ${process.env.BACKEND_URL}/api/v1/signin/post?token=${token}`
      );
      res.json({
        message: "Link sent to the console",
      });
      return;
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });

    console.log(e);
  }
});

router.post("/signin/post", (req, res) => {
  const token = req.query.token as string;

  if (!token) return;

  try {
    const { email } = jwt.verify(token, EMAIL_JWT_SECRET) as JwtPayload;
    const authToken = jwt.sign(
      {
        email,
      },
      AUTH_JWT_SECRET
    );
    res.cookie("token", authToken);
    res.redirect(FRONTEND_URL)
    res.json({
      message: "Cookie set succesfully",
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(e);
  }
});

export default router;
