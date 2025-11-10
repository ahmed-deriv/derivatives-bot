import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { api_base } from '@/external/bot-skeleton';
import chart_api from '@/external/bot-skeleton/services/api/chart-api';
import { useSmartChartAdaptor } from '@/hooks/useSmartChartAdaptor';
import { useStore } from '@/hooks/useStore';
import { ChartTitle, SmartChart, TGranularity } from '@deriv-com/smartcharts-champion';
import { useDevice } from '@deriv-com/ui';
import ToolbarWidgets from './toolbar-widgets';
import '@deriv-com/smartcharts-champion/dist/smartcharts.css';

const Chart = observer(({ show_digits_stats }: { show_digits_stats: boolean }) => {
    const barriers: [] = [];
    const { common, ui } = useStore();
    const { chart_store, run_panel, dashboard } = useStore();
    const [isSafari, setIsSafari] = useState(false);

    // Use the custom hook for SmartChart Adaptor
    const { chartData, getQuotes, subscribeQuotes, unsubscribeQuotes } = useSmartChartAdaptor();

    const {
        chart_type,
        getMarketsOrder,
        granularity,
        onSymbolChange,
        setChartStatus,
        symbol,
        updateChartType,
        updateGranularity,
        updateSymbol,
    } = chart_store;

    const { isDesktop, isMobile } = useDevice();
    const { is_drawer_open } = run_panel;
    const { is_chart_modal_visible } = dashboard;

    const settings = {
        assetInformation: false, // ui.is_chart_asset_info_visible,
        countdown: true,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: common.current_language.toLowerCase(),
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
    };

    useEffect(() => {
        // Safari browser detection
        const isSafariBrowser = () => {
            const ua = navigator.userAgent.toLowerCase();
            return ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1 && ua.indexOf('android') === -1;
        };

        setIsSafari(isSafariBrowser());

        return () => {
            chart_api.api.forgetAll('ticks');
        };
    }, []);

    useEffect(() => {
        if (!symbol) updateSymbol();
    }, [symbol, updateSymbol]);

    const [forceChartRefresh, setForceChartRefresh] = useState(0);

    useEffect(() => {
        // FORCE INJECT 1s volatility indices directly into api_base.active_symbols
        if (api_base.active_symbols && Array.isArray(api_base.active_symbols)) {
            let symbols = [...api_base.active_symbols];

            // Check if our symbols are already present
            const existing_1s_symbols = symbols.filter((s: any) =>
                ['1HZ15V', '1HZ30V', '1HZ90V'].includes(s.symbol || s.underlying_symbol)
            );

            if (existing_1s_symbols.length < 3) {
                // Remove Spain 35 and any existing instances of our symbols
                symbols = symbols.filter((symbol: any) => {
                    const symbol_code = symbol.symbol || symbol.underlying_symbol;
                    // symbol_code !== 'OTC_IBEX35' &&
                    return !['1HZ15V', '1HZ30V', '1HZ90V'].includes(symbol_code);
                });

                // Force add our 1s volatility indices
                const required_1s_symbols = [
                    {
                        symbol: '1HZ15V',
                        underlying_symbol: '1HZ15V',
                        display_name: 'Volatility 15 (1s) Index',
                        market: 'synthetic_index',
                        market_display_name: 'Derived',
                        submarket: 'random_index',
                        submarket_display_name: 'Continuous Indices',
                        pip: 0.001,
                        pip_size: 0.001,
                        exchange_is_open: true,
                        is_trading_suspended: false,
                    },
                    {
                        symbol: '1HZ30V',
                        underlying_symbol: '1HZ30V',
                        display_name: 'Volatility 30 (1s) Index',
                        market: 'synthetic_index',
                        market_display_name: 'Derived',
                        submarket: 'random_index',
                        submarket_display_name: 'Continuous Indices',
                        pip: 0.001,
                        pip_size: 0.001,
                        exchange_is_open: true,
                        is_trading_suspended: false,
                    },
                    {
                        symbol: '1HZ90V',
                        underlying_symbol: '1HZ90V',
                        display_name: 'Volatility 90 (1s) Index',
                        market: 'synthetic_index',
                        market_display_name: 'Derived',
                        submarket: 'random_index',
                        submarket_display_name: 'Continuous Indices',
                        pip: 0.001,
                        pip_size: 0.001,
                        exchange_is_open: true,
                        is_trading_suspended: false,
                    },
                ];

                // Add our symbols
                symbols.push(...required_1s_symbols);

                // Replace the global api_base.active_symbols
                api_base.active_symbols = symbols;

                // Force chart to refresh by triggering a re-render
                setTimeout(() => {
                    setForceChartRefresh(prev => prev + 1);
                }, 100);
            }
        }
    }, [symbol]);

    if (!symbol || chartData.activeSymbols.length === 0) return null;

    const is_connection_opened = !!chart_api?.api;

    return (
        <div
            className={classNames('dashboard__chart-wrapper', {
                'dashboard__chart-wrapper--expanded': is_drawer_open && isDesktop,
                'dashboard__chart-wrapper--modal': is_chart_modal_visible && isDesktop,
                'dashboard__chart-wrapper--safari': isSafari,
            })}
            dir='ltr'
        >
            <SmartChart
                id={`dbot-${forceChartRefresh}`}
                key={`chart-${forceChartRefresh}`}
                barriers={barriers}
                showLastDigitStats={show_digits_stats}
                chartControlsWidgets={null}
                enabledChartFooter={false}
                stateChangeListener={(state: string) => {
                    // Handle state changes: INITIAL, READY, SCROLL_TO_LEFT
                    if (state === 'READY') {
                        setChartStatus(true);
                    }
                }}
                toolbarWidget={() => (
                    <ToolbarWidgets
                        updateChartType={updateChartType}
                        updateGranularity={updateGranularity}
                        position={!isDesktop ? 'bottom' : 'top'}
                        isDesktop={isDesktop}
                    />
                )}
                chartType={chart_type}
                isMobile={isMobile}
                enabledNavigationWidget={isDesktop}
                granularity={granularity as TGranularity}
                getQuotes={getQuotes}
                subscribeQuotes={subscribeQuotes}
                unsubscribeQuotes={unsubscribeQuotes}
                chartData={{ activeSymbols: chartData.activeSymbols, tradingTimes: chartData.tradingTimes }}
                settings={settings}
                symbol={symbol}
                topWidgets={() => <ChartTitle onChange={onSymbolChange} />}
                isConnectionOpened={is_connection_opened}
                getMarketsOrder={active_symbols => {
                    // Check if our 1s volatility indices are present
                    const volatility_1s_present =
                        active_symbols?.filter((s: any) =>
                            ['1HZ15V', '1HZ30V', '1HZ90V'].includes(s.symbol || s.underlying_symbol)
                        ) || [];

                    // If our symbols are missing, force add them here
                    if (active_symbols && volatility_1s_present.length < 3) {
                        const required_1s_symbols = [
                            {
                                symbol: '1HZ15V',
                                underlying_symbol: '1HZ15V',
                                display_name: 'Volatility 15 (1s) Index',
                                market: 'synthetic_index',
                                market_display_name: 'Derived',
                                submarket: 'random_index',
                                submarket_display_name: 'Continuous Indices',
                                pip: 0.001,
                                pip_size: 0.001,
                                exchange_is_open: true,
                                is_trading_suspended: false,
                            },
                            {
                                symbol: '1HZ30V',
                                underlying_symbol: '1HZ30V',
                                display_name: 'Volatility 30 (1s) Index',
                                market: 'synthetic_index',
                                market_display_name: 'Derived',
                                submarket: 'random_index',
                                submarket_display_name: 'Continuous Indices',
                                pip: 0.001,
                                pip_size: 0.001,
                                exchange_is_open: true,
                                is_trading_suspended: false,
                            },
                            {
                                symbol: '1HZ90V',
                                underlying_symbol: '1HZ90V',
                                display_name: 'Volatility 90 (1s) Index',
                                market: 'synthetic_index',
                                market_display_name: 'Derived',
                                submarket: 'random_index',
                                submarket_display_name: 'Continuous Indices',
                                pip: 0.001,
                                pip_size: 0.001,
                                exchange_is_open: true,
                                is_trading_suspended: false,
                            },
                        ];

                        // Remove Spain 35 and any existing instances of our symbols
                        const modified_symbols = active_symbols.filter((symbol: any) => {
                            const symbol_code = symbol.symbol || symbol.underlying_symbol;
                            //symbol_code !== 'OTC_IBEX35' &&
                            return !['1HZ15V', '1HZ30V', '1HZ90V'].includes(symbol_code);
                        });

                        // Add our 1s volatility indices
                        modified_symbols.push(...required_1s_symbols);

                        return getMarketsOrder(modified_symbols);
                    }

                    return getMarketsOrder(active_symbols);
                }}
                isLive
                leftMargin={80}
                drawingToolFloatingMenuPosition={isMobile ? { x: 100, y: 100 } : { x: 200, y: 200 }}
            />
        </div>
    );
});

export default Chart;
