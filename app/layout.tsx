import { GeistSans } from "geist/font";
import { ThemeProvider } from "next-themes";
import { Navigation } from "@/components/navigation";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Visant® Board",
  description: "Visant® Project Management Dashboard",
  icons: {
    icon: '/assets/icons/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <Navigation />
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <div className="flex flex-col gap-20 max-w-5xl p-5 w-full">
                {children}
              </div>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
