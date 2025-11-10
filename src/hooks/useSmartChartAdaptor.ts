import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildSmartchartsChampionAdapter } from '@/adapters/smartcharts-champion';
import { createServices } from '@/adapters/smartcharts-champion/services';
import { createTransport } from '@/adapters/smartcharts-champion/transport';
import chart_api from '@/external/bot-skeleton/services/api/chart-api';
import type { SmartchartsChampionAdapter } from '@/types/smartchart.types';
import type {
    ActiveSymbols,
    TGetQuotes,
    TradingTimesMap,
    TSubscribeQuotes,
    TUnsubscribeQuotes,
} from '@deriv-com/smartcharts-champion';

interface UseSmartChartAdaptorReturn {
    adapter: SmartchartsChampionAdapter | null;
    adapterInitialized: boolean;
    chartData: {
        activeSymbols: ActiveSymbols;
        tradingTimes: TradingTimesMap;
    };
    getQuotes: TGetQuotes;
    subscribeQuotes: TSubscribeQuotes;
    unsubscribeQuotes: TUnsubscribeQuotes;
    isLoading: boolean;
    error: Error | null;
}

/**
 * Custom hook for SmartChart Adaptor
 * Handles adapter initialization, data fetching, and subscription management
 * with proper memoization and memory leak prevention
 */
export const useSmartChartAdaptor = (): UseSmartChartAdaptorReturn => {
    // State management
    const [adapter, setAdapter] = useState<SmartchartsChampionAdapter | null>(null);
    const [adapterInitialized, setAdapterInitialized] = useState(false);
    const [chartData, setChartData] = useState<{
        activeSymbols: ActiveSymbols;
        tradingTimes: TradingTimesMap;
    }>({
        activeSymbols: [] as ActiveSymbols,
        tradingTimes: {} as TradingTimesMap,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Refs to track mounted state and prevent memory leaks
    const isMountedRef = useRef(true);
    const cleanupFunctionsRef = useRef<Array<() => void>>([]);

    // Track mounted state
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Initialize adapter - runs once when chart_api.api is available
    useEffect(() => {
        if (!adapterInitialized && chart_api.api) {
            try {
                const transport = createTransport();
                const services = createServices();
                const championAdapter = buildSmartchartsChampionAdapter(transport, services, {
                    debug: true,
                    subscriptionTimeout: 30000,
                });

                if (isMountedRef.current) {
                    setAdapter(championAdapter);
                    setAdapterInitialized(true);
                    setError(null);
                }
            } catch (err) {
                console.error('❌ [SmartCharts Champion Adapter] Failed to initialize:', err);
                if (isMountedRef.current) {
                    setError(err instanceof Error ? err : new Error('Failed to initialize adapter'));
                    setIsLoading(false);
                }
            }
        }
    }, [adapterInitialized]);

    // Load chart data when adapter is initialized
    useEffect(() => {
        if (!adapter || !adapterInitialized) return;

        let cancelled = false;

        const loadChartData = async () => {
            try {
                setIsLoading(true);
                const data = await adapter.getChartData();

                if (!cancelled && isMountedRef.current) {
                    setChartData({
                        activeSymbols: data.activeSymbols,
                        tradingTimes: data.tradingTimes,
                    });
                    setError(null);
                }
            } catch (err) {
                console.error('❌ [SmartCharts Champion] Failed to load chart data:', err);
                if (!cancelled && isMountedRef.current) {
                    setError(err instanceof Error ? err : new Error('Failed to load chart data'));
                    // Set fallback data to prevent undefined
                    setChartData({
                        activeSymbols: [] as ActiveSymbols,
                        tradingTimes: {} as TradingTimesMap,
                    });
                }
            } finally {
                if (!cancelled && isMountedRef.current) {
                    setIsLoading(false);
                }
            }
        };

        loadChartData();

        // Cleanup function to cancel async operations
        return () => {
            cancelled = true;
        };
    }, [adapter, adapterInitialized]);

    // Memoized getQuotes function
    const getQuotes: TGetQuotes = useCallback(
        async params => {
            if (!adapter) {
                throw new Error('Adapter not initialized');
            }

            const result = await adapter.getQuotes({
                symbol: params.symbol,
                granularity: params.granularity as any,
                count: params.count,
                start: params.start,
                end: params.end,
            });

            // Transform adapter result to SmartCharts Champion format
            if (params.granularity === 0) {
                // For ticks, return history format
                return {
                    history: {
                        prices: result.quotes.map(q => q.Close),
                        times: result.quotes.map(q => parseInt(q.Date)),
                    },
                };
            } else {
                // For candles, return candles format
                return {
                    candles: result.quotes.map(q => ({
                        open: q.Open || q.Close,
                        high: q.High || q.Close,
                        low: q.Low || q.Close,
                        close: q.Close,
                        epoch: parseInt(q.Date),
                    })),
                };
            }
        },
        [adapter]
    );

    // Memoized subscribeQuotes function
    const subscribeQuotes: TSubscribeQuotes = useCallback(
        (params, callback) => {
            if (!adapter) {
                return () => {};
            }

            const unsubscribe = adapter.subscribeQuotes(
                {
                    symbol: params.symbol,
                    granularity: params.granularity as any,
                },
                quote => {
                    if (isMountedRef.current) {
                        callback(quote);
                    }
                }
            );

            // Store cleanup function
            cleanupFunctionsRef.current.push(unsubscribe);

            // Return wrapped unsubscribe that also removes from cleanup array
            return () => {
                unsubscribe();
                const index = cleanupFunctionsRef.current.indexOf(unsubscribe);
                if (index > -1) {
                    cleanupFunctionsRef.current.splice(index, 1);
                }
            };
        },
        [adapter]
    );

    // Memoized unsubscribeQuotes function
    const unsubscribeQuotes: TUnsubscribeQuotes = useCallback(
        request => {
            if (adapter) {
                // If we have request details, use the adapter's unsubscribe method
                if (request?.symbol && typeof request.granularity !== 'undefined') {
                    adapter.unsubscribeQuotes({
                        symbol: request.symbol,
                        granularity: request.granularity as any,
                    });
                } else {
                    // Fallback: unsubscribe all via transport
                    adapter.transport.unsubscribeAll('ticks');
                }
            }
        },
        [adapter]
    );

    // Cleanup effect - runs on unmount
    useEffect(() => {
        return () => {
            // Execute all cleanup functions
            cleanupFunctionsRef.current.forEach(cleanup => {
                try {
                    cleanup();
                } catch (err) {
                    console.error('Error during cleanup:', err);
                }
            });
            cleanupFunctionsRef.current = [];

            // Unsubscribe from all ticks
            try {
                chart_api.api?.forgetAll('ticks');
            } catch (err) {
                console.error('Error forgetting ticks:', err);
            }

            // Clean up adapter subscriptions
            if (adapter?.transport) {
                try {
                    adapter.transport.unsubscribeAll('ticks');
                } catch (err) {
                    console.error('Error unsubscribing from adapter:', err);
                }
            }
        };
    }, [adapter]);

    // Memoize the return object to prevent unnecessary re-renders
    return useMemo(
        () => ({
            adapter,
            adapterInitialized,
            chartData,
            getQuotes,
            subscribeQuotes,
            unsubscribeQuotes,
            isLoading,
            error,
        }),
        [adapter, adapterInitialized, chartData, getQuotes, subscribeQuotes, unsubscribeQuotes, isLoading, error]
    );
};
