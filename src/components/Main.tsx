type MainProps = {
  children?: unknown
}

export function Main({ children }: MainProps) {
  return <main class="site-main container">{children}</main>
}
