import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ગુજરાતી ડાયરો રેડિયો | ગુજરાતનો અસલ સૂર",
  description: "લોકગીત, ભજન, સંતવાણી, હાસ્ય ડાયરો અને લોકવાર્તાની જીવંત ગુજરાતી મહેફિલ.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="gu"><body>{children}</body></html>;
}
