import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY!);

export async function sendEmail(to: string, token: string) {
  const status = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to,
    subject: "Login link",
    html: `<h1> Please click here to login</h1>
        <a target = "_blank" href="${process.env.BACKEND_URL}/api/v1/signin/post?token=${token}">Click Here</a>`,
  });
  // console.log("email sent to: ", to);
  // console.log(status);
  return;
}
