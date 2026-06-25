import { permanentRedirect } from "next/navigation";

export default function CoaMappingsRedirectPage() {
  permanentRedirect("/settings/chart-of-accounts/mappings");
}
