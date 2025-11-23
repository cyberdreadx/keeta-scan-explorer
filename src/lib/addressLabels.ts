// Known address labels/nicknames from the Keeta network
export interface AddressLabel {
  address: string;
  name: string;
  type?: 'storage' | 'anchor' | 'exchange' | 'representative' | 'other';
  icon?: string;
}

// Base Anchor address constant for easy reference
export const BASE_ANCHOR_ADDRESS = "keeta_aabal6jl7dgl3xa6dkzehkbzmzuch3h5yjbmkijyo6vra6xjgzrpfv7gftdkgoy";

export const ADDRESS_LABELS: AddressLabel[] = [
  {
    address: "keeta_aabkv4rnog7herzxncgs6nfszbwf4fvbraukrnapcoanxuijcujwqhkydub5kvq",
    name: "Murphy Storage",
    type: "storage",
  },
  {
    address: "keeta_aqg2mcrdbifrpfw57ufyarexbesztnbqbey446mpykhmacjpskod6x44tvwkg",
    name: "Murphy Storage",
    type: "storage",
  },
  {
    address: BASE_ANCHOR_ADDRESS,
    name: "Base Anchor",
    type: "anchor",
  },
  {
    address: "keeta_anqdilpazdekdu4acw65fj7smltcp26wbrildkqtszqvverljpwpezmd44ssg",
    name: "KTA",
    type: "other",
  },
  {
    address: "keeta_amlx64uigzckvbecjuqjxucvkjpk3fqjr5h3cixsfdvjcfh42yd3zc3m746jxpy",
    name: "Murphy Token",
    type: "other",
  },
];

export function getAddressLabel(address: string): string | null {
  const label = ADDRESS_LABELS.find(l => l.address === address);
  return label?.name || null;
}

export function getAddressType(address: string): string | null {
  const label = ADDRESS_LABELS.find(l => l.address === address);
  return label?.type || null;
}

export function formatAddressWithLabel(address: string): string {
  const label = getAddressLabel(address);
  if (label) return label;
  
  // Return shortened address if no label
  if (!address) return "N/A";
  return `${address.substring(0, 10)}...${address.substring(address.length - 6)}`;
}

export function isBaseAnchorDeposit(tx: any): boolean {
  // Check if this is a regular transaction (purpose 0) where someone is sending TO the base anchor
  if (tx.purpose !== 0) return false;
  
  // Check if any operation is sending to the base anchor address
  return tx.operations?.some((op: any) => 
    op.type === 0 && op.to === BASE_ANCHOR_ADDRESS
  ) || false;
}

export function isBaseAnchorWithdrawal(tx: any): boolean {
  // Check if this is an admin transaction (purpose 1) FROM the base anchor
  return tx.purpose === 1 && tx.account === BASE_ANCHOR_ADDRESS;
}
