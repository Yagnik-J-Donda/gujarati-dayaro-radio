import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "ગુજરાતી ડાયરો રેડિયો | ગુજરાતનો અસલ સૂર",
  description: "લોકગીત, ભજન, સંતવાણી, હાસ્ય ડાયરો અને લોકવાર્તાની જીવંત ગુજરાતી મહેફિલ.",
  icons: { icon: `${basePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="gu"><body>{children}</body></html>;
}
