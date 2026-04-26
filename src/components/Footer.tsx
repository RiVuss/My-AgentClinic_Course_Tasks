export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer class="site-footer">
      <div class="container">
        <small>(c) {year} AgentClinic. Operational support for recovering agents.</small>
      </div>
    </footer>
  )
}
