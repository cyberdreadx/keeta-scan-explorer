export interface TokenMetadata {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  description?: string;
  imageUrl?: string;
  updatedAt: number;
}

export const TOKEN_METADATA: TokenMetadata[] = [
  {
    "address": "keeta_anqdilpazdekdu4acw65fj7smltcp26wbrildkqtszqvverljpwpezmd44ssg",
    "name": "Keeta",
    "symbol": "KTA",
    "decimals": 18,
    "description": "Native Keeta Token",
    "imageUrl": "",
    "updatedAt": 1735689600000
  },
  {
    "address": "keeta_ao7nitutebhm2pkrfbtniepivaw324hecyb43wsxts5rrhi2p5ckgof37racm",
    "name": "Murphy",
    "symbol": "MURF",
    "decimals": 0,
    "description": "Murphy Token",
    "imageUrl": "",
    "updatedAt": 1763935600000
  },
  {
    "address": "keeta_amlx64uigzckvbecjuqjxucvkjpk3fqjr5h3cixsfdvjcfh42yd3zc3m746jxpy",
    "name": "Murphy",
    "symbol": "MURF",
    "decimals": 0,
    "description": "Murphy Token (Alternative Address)",
    "imageUrl": "",
    "updatedAt": 1763935600000
  },
  {
    "address": "keeta_aabiku5vlchcgsxqwj6o4sryvqucaywcb46advac425biaroqzhibaaj7mt6a6i",
    "name": "Baby Paca",
    "symbol": "BPACA",
    "decimals": 18,
    "description": "Baby Paca Token",
    "imageUrl": "https://pbs.twimg.com/profile_images/1988496861586509824/uel7pBhX_400x400.jpg",
    "updatedAt": 1735689600000
  },
  {
    "address": "keeta_aabjew5wmckwg2vuccvu4h2gkildyrp2nlmdocebwfchxmhh7xb6g6y6rzvcxda",
    "name": "Alpaca",
    "symbol": "PACA",
    "decimals": 18,
    "description": "Native Dex Token for Alpaca",
    "imageUrl": "https://pbs.twimg.com/profile_images/1981585383587491840/QEWpc6Uj_400x400.jpg",
    "updatedAt": 1763350053379
  },
  {
    "address": "keeta_aabsuldj4srhjx2rfgzf3b5c55i4vqoo2kmisbc62vd4qd2bmqkmu2mdr4l3zqi",
    "name": "Non-Disclosure Agreement",
    "symbol": "NDA",
    "decimals": 18,
    "imageUrl": "https://pbs.twimg.com/profile_images/1989440466870276096/zpZjGCb5_400x400.jpg",
    "updatedAt": 1763350437770
  },
  {
    "address": "keeta_aabwqabactqc3s7lq4khxbpcze7cfux75iuixpevlfsrvwwf3ecdznegnn52m7q",
    "name": "Drink",
    "symbol": "DRINK",
    "decimals": 18,
    "imageUrl": "https://pbs.twimg.com/profile_images/1989728099525931008/QZ0tj-Yh_400x400.jpg",
    "updatedAt": 1763350584031
  },
  {
    "address": "keeta_aabwi6k5rislbhevld3frsfaso2d3v3t7u436clp5fqtsapppyjrzf4deuqyvdi",
    "name": "AKEETA",
    "symbol": "AKTA",
    "decimals": 18,
    "imageUrl": "https://pbs.twimg.com/profile_images/1989387760918990848/4cjwZMpR_400x400.jpg",
    "updatedAt": 1763352293387
  },
  {
    "address": "keeta_ao55q4okjv4hrbo7z7zl3hivrf64og3fpokup5hvt2wfejim5mxzxcykboc3w",
    "name": "PACA",
    "symbol": "PACA",
    "decimals": 18,
    "description": "",
    "imageUrl": "",
    "updatedAt": 1735689600000
  },
  {
    "address": "keeta_anin2xcn2ijmhezrmrzyoabztxc5kq43n3ftr4bziw2unvg46dvncqkbbpc72",
    "name": "KeetaChad",
    "symbol": "KCHAD",
    "decimals": 18,
    "description": "",
    "imageUrl": "https://pbs.twimg.com/profile_images/1990322392149716992/J_s8wkqp_400x400.jpg",
    "updatedAt": 1763500800000
  }
];

// Create a map for quick lookups
const tokenMap = new Map<string, TokenMetadata>(
  TOKEN_METADATA.map(token => [token.address, token])
);

export function getTokenMetadata(address: string): TokenMetadata | undefined {
  return tokenMap.get(address);
}

export function getTokenSymbol(address: string): string {
  // Check if it's the native KTA token
  if (address === "keeta_anqdilpazdekdu4acw65fj7smltcp26wbrildkqtszqvverljpwpezmd44ssg") {
    return "KTA";
  }
  
  const metadata = getTokenMetadata(address);
  return metadata?.symbol || formatKeetaAddress(address);
}

export function getTokenDecimals(address: string): number {
  const metadata = getTokenMetadata(address);
  return metadata?.decimals ?? 18; // Default to 18 if not specified
}

export function getTokenName(address: string): string {
  const metadata = getTokenMetadata(address);
  return metadata?.name || formatKeetaAddress(address);
}

function formatKeetaAddress(address: string): string {
  if (!address) return "Unknown";
  if (address.length <= 15) return address;
  return `${address.slice(0, 10)}...${address.slice(-5)}`;
}
