import { ResetPasswordForm } from "@/app/(authentication)/forget-password/[token]/_components/reset-password-form";

type ResetPasswordPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params;
  return <ResetPasswordForm resetToken={token} />;
}
