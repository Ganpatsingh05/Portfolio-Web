export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('portfolio-theme') || 'system';
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
