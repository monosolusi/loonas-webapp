import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function DemoButton() {
  const { setCompanyName, setCompanyEmail, setCompanyPhoneNumber, setCompanyAddress } = useCreateBusinessAccountState();

  const handleClick = () => {
    setCompanyName?.("PT. Karya Kita Keren");
    setCompanyEmail?.("admin@karyakita.com");
    setCompanyPhoneNumber?.("08123456789");
    setCompanyAddress?.("Jalan Karya Kita Keren No. 123");
  };

  if (process.env.NODE_ENV !== "development") return null;
  return <OutlinedButton onClick={handleClick}>Populate Data</OutlinedButton>;
}
