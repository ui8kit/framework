import { useEffect, useState } from 'react';
import { Button, Text } from '@ui8kit/core';
import { If } from '@ui8kit/template';

const THEME_KEY = 'resta-theme';

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getInitialTheme());
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDark]);

  function toggle() {
    setIsDark((prev) => !prev);
  }

  const title = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      title={title}
      aria-label={title}
      data-class="theme-toggle"
    >
      <If test="isDark" value={isDark}>
        <Text component="span">☀</Text>
      </If>
      <If test="!isDark" value={!isDark}>
        <Text component="span">☽</Text>
      </If>
    </Button>
  );
}
