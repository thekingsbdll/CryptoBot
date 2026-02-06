import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClickWay SalesOS",
  description: "CRM multi-tenant para ClickWay Marketing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm text-slate-500">ClickWay Marketing</p>
                <h1 className="text-xl font-semibold">ClickWay SalesOS</h1>
              </div>
              <nav className="flex gap-4 text-sm">
                <a className="text-slate-600 hover:text-slate-900" href="/">
                  Dashboard
                </a>
                <a className="text-slate-600 hover:text-slate-900" href="/templates">
                  Formularios
                </a>
                <a className="text-slate-600 hover:text-slate-900" href="/settings">
                  Configuración
                </a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
