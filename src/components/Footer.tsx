export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer class="site-footer">
      <div class="container">
        <small>(c) {year} AgentClinic</small>
      </div>
    </footer>
  )
}
