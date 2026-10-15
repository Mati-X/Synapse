export function resolvePath(context: any, path: string): any {
  if (!context || !path) return "";

  const result = path.split('.').reduce((acc, key) => {
    if (acc === null || acc === undefined) {
      return undefined;
    }
    return acc[key];
  }, context);

  return result !== undefined && result !== null ? result : "";
}

export function interpolate(template: string, variables: Record<string, any>): string {
  if (!template) return "";

  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {

    const value = resolvePath(variables, path);
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  });

  return '';
}