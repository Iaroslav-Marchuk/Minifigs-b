function parseText(value) {
  if (!value) return undefined;
  return value.trim();
}

export function parseFilterParams(query) {
  const { theme, search } = query;

  const parsedTheme = parseText(theme);
  const parsedSearch = parseText(search);

  return {
    theme: parsedTheme,
    search: parsedSearch,
  };
}
