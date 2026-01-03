import Image from "next/image";
import RegisterFormWrapper from "@/components/forms/RegisterFormWrapper";

/**
 * Patient Registration Page
 *
 * Displays the complete patient registration form
 * for collecting medical and personal information.
 * Uses RegisterFormWrapper to fetch user data client-side.
 */
export default async function RegisterPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="CarePulse"
            className="mb-12 h-10 w-fit"
          />

          <RegisterFormWrapper userId={userId} />

          <p className="copyright py-12">© {new Date().getFullYear()} CarePulse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
}
