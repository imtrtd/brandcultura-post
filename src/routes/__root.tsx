import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "Brandcultura Post";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Design and export Instagram carousel posts for Brandcultura — 1080×1080 slides, overlays, upload and download.",
      },
      { name: "theme-color", content: "#050505" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-ink text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <I18nProvider>
            <Outlet />
            <Toaster
              theme="dark"
              position="bottom-center"
              toastOptions={{
                style: {
                  background: "#0d0d0d",
                  border: "1px solid #FF2B8A",
                  color: "#f5f5f5",
                  borderRadius: 4,
                },
              }}
            />
          </I18nProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
