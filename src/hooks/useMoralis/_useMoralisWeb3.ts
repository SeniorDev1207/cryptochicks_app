import { useState, useCallback, useEffect } from "react";
import { Moralis } from "moralis";

export interface Web3EnableOptions {
  onError?: (error: Error) => void;
  onSuccess?: (web3: Moralis.Web3) => void;
  onComplete?: () => void;
  throwOnError?: boolean;
}

/**
 * Handles enabling of web3 and providing it, as soon as the user is authenticated
 */
export const _useMoralisWeb3 = (isAuthenticated: boolean) => {
  const [web3, setWeb3] = useState<Moralis.Web3 | null>(new Moralis.Web3());
  const [isWeb3Enabled, setIsWeb3Enabled] = useState(false);
  const [web3EnableError, setEnableWeb3Error] = useState<null | Error>(null);
  const [isWeb3EnableLoading, setIsWeb3EnableLoading] = useState(false);

  /**
   * Enable web3 with the browsers web3Provider (only available when a user has been authenticated)
   */
  const enableWeb3 = useCallback(
    async ({
      throwOnError,
      onComplete,
      onError,
      onSuccess,
    }: Web3EnableOptions = {}) => {
      setIsWeb3EnableLoading(true);
      setEnableWeb3Error(null);

      try {
        console.log("1");
        const currentWeb3 = await Moralis.Web3.enable();

        console.log("2 currentWeb3", currentWeb3);

        setWeb3(currentWeb3);
        setIsWeb3Enabled(true);

        if (onSuccess) {
          onSuccess(currentWeb3);
        }
      } catch (error) {
        console.log("ERR", error);
        setEnableWeb3Error(error);
        if (throwOnError) {
          throw error;
        }
        if (onError) {
          onError(error);
        }
      } finally {
        setIsWeb3EnableLoading(false);
        if (onComplete) {
          onComplete();
        }
      }
    },
    [],
  );

  return {
    enableWeb3,
    web3,
    isWeb3Enabled,
    web3EnableError,
    isWeb3EnableLoading,
  };
};
