import { 
  Send, 
  Download, 
  FileText, 
  Coins,
  TrendingUp,
  UserPlus,
  Shield,
  GitBranch,
  LucideIcon 
} from 'lucide-react';
import { getTokenSymbol, getTokenDecimals } from './tokenMetadata';

export interface OperationType {
  name: string;
  description: string;
  icon: LucideIcon;
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  color: string;
}

export const OPERATION_TYPES: Record<number, OperationType> = {
  0: {
    name: 'Send',
    description: 'Transfer tokens',
    icon: Send,
    variant: 'destructive',
    color: 'hsl(var(--destructive))',
  },
  1: {
    name: 'Receive',
    description: 'Receive tokens',
    icon: Download,
    variant: 'success',
    color: 'hsl(142, 71%, 45%)',
  },
  2: {
    name: 'Transfer',
    description: 'Token transfer',
    icon: GitBranch,
    variant: 'secondary',
    color: 'hsl(var(--secondary))',
  },
  3: {
    name: 'Generate ID',
    description: 'Create identifier',
    icon: UserPlus,
    variant: 'outline',
    color: 'hsl(var(--primary))',
  },
  4: {
    name: 'Set Info',
    description: 'Set metadata',
    icon: FileText,
    variant: 'outline',
    color: 'hsl(var(--muted-foreground))',
  },
  5: {
    name: 'Modify Balance',
    description: 'Adjust token balance',
    icon: Coins,
    variant: 'warning',
    color: 'hsl(38, 92%, 50%)',
  },
  6: {
    name: 'Admin Supply',
    description: 'Modify token supply',
    icon: TrendingUp,
    variant: 'success',
    color: 'hsl(173, 58%, 39%)',
  },
  7: {
    name: 'Conditional Receive',
    description: 'Conditional token receipt',
    icon: Download,
    variant: 'secondary',
    color: 'hsl(var(--secondary))',
  },
  8: {
    name: 'Update Permissions',
    description: 'Manage permissions',
    icon: Shield,
    variant: 'outline',
    color: 'hsl(var(--primary))',
  },
};

export const PURPOSE_LABELS: Record<number, string> = {
  0: 'Transaction',
  1: 'Admin',
  2: 'Delegate',
  3: 'Certificate',
  4: 'Metadata',
};

export function getOperationType(type: number): OperationType {
  return OPERATION_TYPES[type] || {
    name: 'Unknown',
    description: 'Unknown operation',
    icon: FileText,
    variant: 'outline',
    color: 'hsl(var(--muted-foreground))',
  };
}

export function getPurposeLabel(purpose: number): string {
  return PURPOSE_LABELS[purpose] || 'Unknown';
}

export function formatKeetaAddress(address: string, length: number = 10): string {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

export function formatKeetaAmount(hexAmount: string, tokenAddress?: string): string {
  try {
    const amount = BigInt(hexAmount);
    // Use token-specific decimals or default to 18
    const decimals = tokenAddress ? getTokenDecimals(tokenAddress) : 18;
    const divisor = BigInt(10) ** BigInt(decimals);
    const wholePart = amount / divisor;
    const fractionalPart = amount % divisor;

    if (fractionalPart === 0n) {
      return wholePart.toString();
    }

    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    // Remove trailing zeros
    const trimmed = fractionalStr.replace(/0+$/, '');
    const result = trimmed ? `${wholePart}.${trimmed}` : wholePart.toString();
    
    // Format large numbers
    const numValue = parseFloat(result);
    if (numValue >= 1000000) {
      return (numValue / 1000000).toFixed(2) + 'M';
    } else if (numValue >= 1000) {
      return (numValue / 1000).toFixed(2) + 'K';
    }
    
    return result;
  } catch {
    return '0';
  }
}

export function isAtomicSwap(operations: any[]): boolean {
  if (!operations || operations.length < 2) return false;
  
  const hasSend = operations.some(op => op.type === 0);
  const hasConditionalReceive = operations.some(op => op.type === 7); // Conditional Receive for swaps
  
  return hasSend && hasConditionalReceive;
}

export function getSwapAmounts(operations: any[]): { from: string; to: string } | null {
  if (!operations || operations.length < 2) return null;
  
  const sendOp = operations.find(op => op.type === 0);
  const receiveOp = operations.find(op => op.type === 7); // Conditional Receive for swaps
  
  if (!sendOp || !receiveOp) return null;
  
  const sendTokenAddress = sendOp.token || 'keeta_anqdilpazdekdu4acw65fj7smltcp26wbrildkqtszqvverljpwpezmd44ssg';
  const receiveTokenAddress = receiveOp.token || 'keeta_anqdilpazdekdu4acw65fj7smltcp26wbrildkqtszqvverljpwpezmd44ssg';
  
  const sendToken = getTokenSymbol(sendTokenAddress);
  const receiveToken = getTokenSymbol(receiveTokenAddress);
  
  return {
    from: `${formatKeetaAmount(sendOp.amount || '0x0', sendTokenAddress)} ${sendToken}`,
    to: `${formatKeetaAmount(receiveOp.amount || '0x0', receiveTokenAddress)} ${receiveToken}`
  };
}
