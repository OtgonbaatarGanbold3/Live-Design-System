import {
  type TokenAddress,
  type TokenDefinition,
  type TokenLayer,
  type TokenMode,
  type TokenReference,
  type TokenTheme,
  TokenRegistry,
} from "@/tokens/registry";

export interface ResolvedToken {
  value: string | number;
  sourceThemeId: string;
  sourceMode: TokenMode;
  sourceLayer: TokenLayer;
  sourceKey: string;
}

export interface ResolveOptions {
  mode?: TokenMode;
  fallbackMode?: TokenMode;
}

function parseReference(reference: TokenReference): TokenAddress {
  const [layer, ...keyParts] = reference.$ref.split(".");
  if (layer !== "primitive" && layer !== "semantic" && layer !== "component") {
    throw new Error(`Invalid token layer in reference '${reference.$ref}'.`);
  }

  return {
    mode: "light",
    layer,
    key: keyParts.join("."),
  };
}

function tokenId(themeId: string, mode: TokenMode, layer: TokenLayer, key: string): string {
  return `${themeId}:${mode}:${layer}:${key}`;
}

export class TokenResolver {
  constructor(private readonly registry: TokenRegistry) {}

  resolve(themeId: string, address: Omit<TokenAddress, "mode"> & { mode?: TokenMode }, options?: ResolveOptions): ResolvedToken {
    const requestedMode = address.mode ?? options?.mode ?? "light";
    const fallbackMode = options?.fallbackMode ?? (requestedMode === "light" ? "dark" : "light");

    const resolved = this.resolveRecursive(
      themeId,
      {
        mode: requestedMode,
        layer: address.layer,
        key: address.key,
      },
      new Set<string>(),
      fallbackMode
    );

    if (!resolved) {
      throw new Error(
        `Unable to resolve token '${address.layer}.${address.key}' from theme '${themeId}' in ${requestedMode} mode.`
      );
    }

    return resolved;
  }

  private resolveRecursive(
    themeId: string,
    address: TokenAddress,
    visited: Set<string>,
    fallbackMode: TokenMode
  ): ResolvedToken | null {
    const token = this.findTokenInThemeChain(themeId, address);
    if (!token) {
      if (address.mode !== fallbackMode) {
        return this.resolveRecursive(
          themeId,
          {
            ...address,
            mode: fallbackMode,
          },
          visited,
          fallbackMode
        );
      }
      return null;
    }

    const currentId = tokenId(token.sourceThemeId, token.sourceMode, token.sourceLayer, token.sourceKey);
    if (visited.has(currentId)) {
      throw new Error(`Circular token reference detected at '${currentId}'.`);
    }
    visited.add(currentId);

    const value = token.definition.value;
    if (typeof value === "string" || typeof value === "number") {
      return {
        value,
        sourceThemeId: token.sourceThemeId,
        sourceMode: token.sourceMode,
        sourceLayer: token.sourceLayer,
        sourceKey: token.sourceKey,
      };
    }

    const nextAddress = parseReference(value);
    const nextMode = token.sourceMode;

    return this.resolveRecursive(
      token.sourceThemeId,
      {
        mode: nextMode,
        layer: nextAddress.layer,
        key: nextAddress.key,
      },
      visited,
      fallbackMode
    );
  }

  private findTokenInThemeChain(
    themeId: string,
    address: TokenAddress
  ): {
    definition: TokenDefinition;
    sourceThemeId: string;
    sourceMode: TokenMode;
    sourceLayer: TokenLayer;
    sourceKey: string;
  } | null {
    const chain = this.themeChain(themeId);

    for (const currentThemeId of chain) {
      const theme = this.registry.getTheme(currentThemeId);
      if (!theme) continue;

      const definition = theme.modes[address.mode][address.layer][address.key];
      if (definition) {
        return {
          definition,
          sourceThemeId: currentThemeId,
          sourceMode: address.mode,
          sourceLayer: address.layer,
          sourceKey: address.key,
        };
      }
    }

    return null;
  }

  private themeChain(themeId: string): string[] {
    const chain: string[] = [];
    const visited = new Set<string>();

    let cursor: TokenTheme | undefined = this.registry.getTheme(themeId);
    while (cursor) {
      if (visited.has(cursor.id)) {
        throw new Error(`Circular theme inheritance detected at '${cursor.id}'.`);
      }

      chain.push(cursor.id);
      visited.add(cursor.id);
      cursor = cursor.extends ? this.registry.getTheme(cursor.extends) : undefined;
    }

    return chain;
  }
}

export function resolveTokenValue(
  registry: TokenRegistry,
  themeId: string,
  address: Omit<TokenAddress, "mode"> & { mode?: TokenMode },
  options?: ResolveOptions
): ResolvedToken {
  return new TokenResolver(registry).resolve(themeId, address, options);
}
