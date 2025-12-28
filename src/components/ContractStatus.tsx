// Smart contract status component for debugging and monitoring
import { useContractVersion, usePostCount, useReplyCount } from '@/hooks/useContract';
import { useUserReputation } from '@/hooks/useContract';
import { useAppKitAccount } from '@reown/appkit/react';
import { useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from '@reown/appkit/networks';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function ContractStatus() {
  const { address } = useAppKitAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const { data: version, isLoading: versionLoading, error: versionError } = useContractVersion();
  const { data: postCount, isLoading: postLoading } = usePostCount();
  const { data: replyCount, isLoading: replyLoading } = useReplyCount();
  const { data: userRep, isLoading: repLoading } = useUserReputation(address as `0x${string}`);

  const isConnected = !!address;
  const isOnCorrectNetwork = chainId === baseSepolia.id;
  const contractConnected = !!version && !versionError && isOnCorrectNetwork;
  const totalActivity = (postCount || 0) + (replyCount || 0);

  const handleSwitchNetwork = () => {
    switchChain({ chainId: baseSepolia.id });
  };

  return (
    <Card className="p-5 bg-card/80 border-primary/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Smart Contract Status</h3>
        <div className="flex items-center gap-2">
          {!isOnCorrectNetwork && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Wrong Network
            </Badge>
          )}
          <Badge variant={contractConnected ? "default" : "destructive"} className="text-xs">
            {contractConnected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
        </div>
      </div>

      {!isOnCorrectNetwork && (
        <div className="mb-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm">
          <div className="flex items-center justify-between">
            <span className="text-destructive">Please switch to Base Sepolia network</span>
            <Button onClick={handleSwitchNetwork} size="sm" variant="destructive">
              Switch Network
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Network:</span>
          <span className="ml-1 font-mono">
            {isOnCorrectNetwork ? 'Base Sepolia' : 'Wrong Network'}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground">Version:</span>
          {versionLoading ? (
            <Loader2 className="h-3 w-3 animate-spin inline ml-1" />
          ) : (
            <span className="ml-1 font-mono">{version || 'Unknown'}</span>
          )}
        </div>

        <div>
          <span className="text-muted-foreground">Posts:</span>
          {postLoading ? (
            <Loader2 className="h-3 w-3 animate-spin inline ml-1" />
          ) : (
            <span className="ml-1 font-mono">{postCount?.toString() || '0'}</span>
          )}
        </div>

        <div>
          <span className="text-muted-foreground">Replies:</span>
          {replyLoading ? (
            <Loader2 className="h-3 w-3 animate-spin inline ml-1" />
          ) : (
            <span className="ml-1 font-mono">{replyCount?.toString() || '0'}</span>
          )}
        </div>

        <div>
          <span className="text-muted-foreground">Your Rep:</span>
          {repLoading ? (
            <Loader2 className="h-3 w-3 animate-spin inline ml-1" />
          ) : (
            <span className="ml-1 font-mono">{userRep?.toString() || '0'}</span>
          )}
        </div>
      </div>

      {totalActivity > 0 && (
        <div className="mt-3 pt-3 border-t border-primary/10">
          <div className="text-xs text-muted-foreground">
            Total Activity: <span className="font-mono">{totalActivity.toString()}</span> interactions
          </div>
        </div>
      )}
    </Card>
  );
}