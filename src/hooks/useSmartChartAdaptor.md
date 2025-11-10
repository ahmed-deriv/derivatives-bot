# useSmartChartAdaptor Hook

## Overview

`useSmartChartAdaptor` is a custom React hook that manages the SmartCharts Champion adapter lifecycle, including initialization, data fetching, and subscription management. It provides a clean, memoized interface for chart components while handling memory leaks and cleanup automatically.

## Features

- ✅ **Automatic Adapter Initialization**: Initializes the SmartCharts Champion adapter when the API is ready
- ✅ **Memoized Functions**: All returned functions are memoized with `useCallback` to prevent unnecessary re-renders
- ✅ **Memory Leak Prevention**: Comprehensive cleanup on unmount with proper subscription management
- ✅ **Error Handling**: Built-in error state management with fallback data
- ✅ **Loading States**: Provides loading state for better UX
- ✅ **Type Safety**: Full TypeScript support with proper type definitions

## Usage

```typescript
import { useSmartChartAdaptor } from '@/hooks/useSmartChartAdaptor';

function ChartComponent() {
    const {
        adapter,
        adapterInitialized,
        chartData,
        getQuotes,
        subscribeQuotes,
        unsubscribeQuotes,
        isLoading,
        error,
    } = useSmartChartAdaptor();

    // Use the hook's return values in your component
    return (
        <SmartChart
            getQuotes={getQuotes}
            subscribeQuotes={subscribeQuotes}
            unsubscribeQuotes={unsubscribeQuotes}
            chartData={chartData}
            // ... other props
        />
    );
}
```

## Return Values

### `adapter`

- **Type**: `SmartchartsChampionAdapter | null`
- **Description**: The initialized adapter instance, or `null` if not yet initialized

### `adapterInitialized`

- **Type**: `boolean`
- **Description**: Flag indicating whether the adapter has been successfully initialized

### `chartData`

- **Type**: `{ activeSymbols: ActiveSymbols; tradingTimes: TradingTimesMap }`
- **Description**: Chart reference data including active symbols and trading times
- **Default**: Empty arrays/objects until data is loaded

### `getQuotes`

- **Type**: `TGetQuotes`
- **Description**: Memoized function to fetch historical quotes for a symbol
- **Parameters**:
    - `symbol`: Symbol code (e.g., 'R_100')
    - `granularity`: Time granularity (0 for ticks, >0 for candles)
    - `count`: Number of data points to fetch
    - `start`: Optional start timestamp
    - `end`: Optional end timestamp
- **Returns**: Promise with quotes data in SmartCharts Champion format

### `subscribeQuotes`

- **Type**: `TSubscribeQuotes`
- **Description**: Memoized function to subscribe to live quote updates
- **Parameters**:
    - `params`: Subscription parameters (symbol, granularity)
    - `callback`: Function to call when new quotes arrive
- **Returns**: Unsubscribe function

### `unsubscribeQuotes`

- **Type**: `TUnsubscribeQuotes`
- **Description**: Memoized function to unsubscribe from quote updates
- **Parameters**:
    - `request`: Unsubscribe request with symbol and granularity

### `isLoading`

- **Type**: `boolean`
- **Description**: Loading state for chart data fetching

### `error`

- **Type**: `Error | null`
- **Description**: Error object if initialization or data fetching fails

## Memory Management

The hook implements several strategies to prevent memory leaks:

1. **Mounted State Tracking**: Uses `isMountedRef` to prevent state updates after unmount
2. **Cleanup Functions Registry**: Maintains an array of cleanup functions for all subscriptions
3. **Automatic Cleanup**: Executes all cleanup functions on unmount
4. **API Cleanup**: Calls `chart_api.api.forgetAll('ticks')` on unmount
5. **Transport Cleanup**: Unsubscribes from all transport subscriptions

## Memoization Strategy

All functions and the return object are memoized to optimize performance:

- **`getQuotes`**: Memoized with `useCallback`, depends on `adapter`
- **`subscribeQuotes`**: Memoized with `useCallback`, depends on `adapter`
- **`unsubscribeQuotes`**: Memoized with `useCallback`, depends on `adapter`
- **Return Object**: Memoized with `useMemo` to prevent unnecessary re-renders

## Error Handling

The hook provides comprehensive error handling:

```typescript
const { error, isLoading, chartData } = useSmartChartAdaptor();

if (error) {
    console.error('Chart adapter error:', error);
    // Handle error state
}

if (isLoading) {
    // Show loading state
}

if (chartData.activeSymbols.length === 0) {
    // No data available yet
}
```

## Best Practices

1. **Single Instance**: Use only one instance of this hook per chart component
2. **Cleanup**: The hook handles cleanup automatically, no manual cleanup needed
3. **Error Handling**: Always check the `error` state before using chart data
4. **Loading State**: Use `isLoading` to show appropriate loading UI
5. **Subscription Management**: The hook tracks all subscriptions and cleans them up automatically

## Migration from Direct Adapter Usage

### Before (Direct Adapter Usage)

```typescript
const [adapter, setAdapter] = useState<SmartchartsChampionAdapter | null>(null);
const [chartData, setChartData] = useState({...});

useEffect(() => {
    // Manual initialization
    const transport = createTransport();
    const services = createServices();
    const championAdapter = buildSmartchartsChampionAdapter(transport, services);
    setAdapter(championAdapter);
}, []);

useEffect(() => {
    // Manual data loading
    if (adapter) {
        adapter.getChartData().then(setChartData);
    }
}, [adapter]);

const getQuotes = async (params) => {
    // Manual implementation
};

// Manual cleanup
useEffect(() => {
    return () => {
        chart_api.api.forgetAll('ticks');
    };
}, []);
```

### After (Using Hook)

```typescript
const { chartData, getQuotes, subscribeQuotes, unsubscribeQuotes } = useSmartChartAdaptor();

// That's it! Everything is handled automatically
```

## Performance Considerations

- All functions are memoized to prevent unnecessary re-renders
- Chart data is only fetched once when the adapter initializes
- Subscriptions are properly managed to avoid memory leaks
- The hook uses refs to track mounted state, avoiding state updates after unmount

## Troubleshooting

### Adapter not initializing

- Ensure `chart_api.api` is available before the component mounts
- Check console for initialization errors

### Memory leaks

- The hook handles cleanup automatically
- If you see warnings about state updates after unmount, ensure you're using the latest version of the hook

### Subscriptions not working

- Verify the adapter is initialized (`adapterInitialized === true`)
- Check that the symbol and granularity are valid
- Ensure the callback function is stable (memoized if needed)

## Related Files

- `src/adapters/smartcharts-champion/index.ts` - Adapter implementation
- `src/adapters/smartcharts-champion/transport.ts` - Transport layer
- `src/adapters/smartcharts-champion/services.ts` - Services layer
- `src/pages/chart/chart.tsx` - Example usage in Chart component
