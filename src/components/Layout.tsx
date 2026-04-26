import type { Child } from "hono/jsx";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { Main } from "./Main";

type LayoutProps = {
  title?: string;
  children?: Child;
};

export function Layout({ title = "AgentClinic", children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>{title}</title>
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </body>
    </html>
  );
}
