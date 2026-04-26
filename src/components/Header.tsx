export function Header() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/agents', label: 'Agents' },
    { href: '/ailments', label: 'Ailments' },
    { href: '/therapies', label: 'Therapies' },
    { href: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="brand" href="/">
          <img alt="" aria-hidden="true" class="brand__mark" height="28" src="/static/agentclinic-mark.svg" width="28" />
          <span>AgentClinic</span>
        </a>
        <nav aria-label="Primary">
          <ul class="nav-list">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}