class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="site-header">
        <div class="nav-container">
          <a href="/" class="logo-text">Elsy Leonso</a>
          <button class="mobile-menu-btn" aria-label="Toggle navigation">
            ☰
          </button>
          <nav>
            <ul class="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about-us/">About Us</a></li>
              <li><a href="/services/">Services</a></li>
              <li><a href="/insurance/">Insurance</a></li>
              <li><a href="/locations/">Locations</a></li>
              <li><a href="/contact-us/">Contact Us</a></li>
            </ul>
          </nav>
        </div>
      </header>
    `;

    // Mobile menu toggle logic
    const btn = this.querySelector('.mobile-menu-btn');
    const links = this.querySelector('.nav-links');
    
    if (btn && links) {
      btn.addEventListener('click', () => {
        links.classList.toggle('active');
        btn.textContent = links.classList.contains('active') ? '✕' : '☰';
      });
    }

    // Set active link
    const currentPath = window.location.pathname;
    const navItems = this.querySelectorAll('.nav-links a');
    navItems.forEach(link => {
      if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === '/')) {
        link.classList.add('active');
      }
    });
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-widget">
              <h4>Elsy Leonso</h4>
              <p>Elsy Leonso Insurance is a reputable provider offering tailored coverage solutions for individuals and businesses.</p>
            </div>
            <div class="footer-widget">
              <h4>Quick Links</h4>
              <ul class="footer-links">
                <li><a href="/about-us/">About Us</a></li>
                <li><a href="/services/">Services</a></li>
                <li><a href="/insurance/">Insurance</a></li>
                <li><a href="/contact-us/">Contact</a></li>
              </ul>
            </div>
            <div class="footer-widget">
              <h4>Contact Info</h4>
              <p>Email: info@elsyleonso.com</p>
              <p>Phone: (123) 456-7890</p>
            </div>
          </div>
          <div class="footer-bottom">
            &copy; ${new Date().getFullYear()} Elsy Leonso Insurance, Tag and Title Maryland. All rights reserved.
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
