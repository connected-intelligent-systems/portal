import { useCallback, useEffect, useRef, useState } from "react";
import type { DataProvider } from "react-admin";

interface UseNegotiationPollingParams {
  dataProvider: DataProvider;
  pollInterval?: number;
  maxAttempts?: number;
  onFinalized: (contractAgreementId: string) => void;
  onTimeout: (negotiationId: string) => void;
  onError: (negotiationId: string, error: unknown) => void;
}

interface UseNegotiationPollingResult {
  isPolling: boolean;
  startPolling: (negotiationId: string) => void;
  stopPolling: () => void;
  negotiationId: string | null;
}

export const useNegotiationPolling = ({
  dataProvider,
  pollInterval = 5000,
  maxAttempts = 30,
  onFinalized,
  onTimeout,
  onError,
}: UseNegotiationPollingParams): UseNegotiationPollingResult => {
  const [negotiationId, setNegotiationId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const attemptsRef = useRef(0);

  const clearIntervalRef = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopPolling = useCallback(() => {
    clearIntervalRef();
    attemptsRef.current = 0;
    setNegotiationId(null);
    setIsPolling(false);
  }, [clearIntervalRef]);

  useEffect(() => {
    if (!isPolling || !negotiationId) {
      return undefined;
    }

    const pollNegotiation = async () => {
      try {
        const { data } = await dataProvider.getOne("contractnegotiations", {
          id: negotiationId,
        });

        attemptsRef.current += 1;

        if (data?.contractAgreementId) {
          stopPolling();
          onFinalized(data.contractAgreementId);
          return;
        }

        if (attemptsRef.current >= maxAttempts) {
          const timeoutNegotiationId = negotiationId;
          stopPolling();
          onTimeout(timeoutNegotiationId);
        }
      } catch (error) {
        const failedNegotiationId = negotiationId;
        stopPolling();
        onError(failedNegotiationId, error);
      }
    };

    attemptsRef.current = 0;
    pollNegotiation();
    intervalRef.current = window.setInterval(pollNegotiation, pollInterval);

    return () => {
      clearIntervalRef();
    };
  }, [
    clearIntervalRef,
    dataProvider,
    isPolling,
    maxAttempts,
    negotiationId,
    onError,
    onFinalized,
    onTimeout,
    pollInterval,
    stopPolling,
  ]);

  const startPolling = useCallback((id: string) => {
    setNegotiationId(id);
    setIsPolling(true);
  }, []);

  return {
    isPolling,
    startPolling,
    stopPolling,
    negotiationId,
  };
};
