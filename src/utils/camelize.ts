/**
 * Converts a string from snake_case or kebab-case to camelCase
 */
const camelizeKey = (str: string): string => {
  return str
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Converts object keys from snake_case to camelCase recursively
 */
const camelize = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(camelize);
  }

  if (isObject(obj)) {
    const camelized: Record<string, unknown> = {};
    Object.entries(obj).forEach(([key, value]) => {
      const camelKey = camelizeKey(key);
      camelized[camelKey] = camelize(value);
    });
    return camelized;
  }

  return obj;
};

export default camelize;
