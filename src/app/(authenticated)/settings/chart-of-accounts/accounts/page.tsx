import { permanentRedirect } from "next/navigation";

export default function CoaAccountsRedirectPage() {
  permanentRedirect("/chart-of-accounts/accounts");
}
