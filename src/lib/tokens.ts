import type { CssToken, ColorToken, SemanticColorToken } from './design-tokens.generated';

export type { CssToken, ColorToken, SemanticColorToken };

export type TokenVar<T extends CssToken = CssToken> = `var(${T})`;

export function cssVar<T extends CssToken>(token: T): TokenVar<T> {
  return `var(${token})`;
}
