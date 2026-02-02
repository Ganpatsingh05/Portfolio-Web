export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              // Skip for admin pages - they have their own theme system
              if (window.location.pathname.startsWith('/admin')) {
                var adminTheme = localStorage.getItem('admin-theme') || 'light';
                var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                var resolvedTheme = adminTheme === 'system' ? systemTheme : adminTheme;
                
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(resolvedTheme);
                
                if (resolvedTheme === 'dark') {
                  document.documentElement.style.setProperty('--background', '#0a0a0a');
                  document.documentElement.style.setProperty('--foreground', '#ededed');
                } else {
                  document.documentElement.style.setProperty('--background', '#ffffff');
                  document.documentElement.style.setProperty('--foreground', '#171717');
                }
                
                var accent = localStorage.getItem('admin-accent-color');
                if (accent) {
                  document.documentElement.style.setProperty('--accent-color', accent);
                }
                return;
              }
              
              // Public portfolio theme
              var theme = localStorage.getItem('portfolio-theme') || 'light';
              var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              var resolvedTheme = theme === 'system' ? systemTheme : theme;
              
              document.documentElement.classList.remove('light', 'dark');
              document.documentElement.classList.add(resolvedTheme);
              
              if (resolvedTheme === 'dark') {
                document.documentElement.style.setProperty('--background', '#0a0a0a');
                document.documentElement.style.setProperty('--foreground', '#ededed');
              } else {
                document.documentElement.style.setProperty('--background', '#ffffff');
                document.documentElement.style.setProperty('--foreground', '#171717');
              }
            } catch (e) {
              console.warn('Theme initialization failed:', e);
            }
          })();
        `,
      }}
    />
  )
}
