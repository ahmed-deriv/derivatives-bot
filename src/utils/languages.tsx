import {
    FlagArabLeagueIcon,
    FlagBangladeshIcon,
    FlagCambodiaIcon,
    FlagChinaSimplifiedIcon,
    FlagChinaTraditionalIcon,
    FlagFranceIcon,
    FlagGermanyIcon,
    FlagItalyIcon,
    FlagMongoliaIcon,
    FlagPolandIcon,
    FlagPortugalIcon,
    FlagRussiaIcon,
    FlagSouthKoreaIcon,
    FlagSpainIcon,
    FlagSriLankaIcon,
    FlagTanzaniaIcon,
    FlagTurkeyIcon,
    FlagUnitedKingdomIcon,
    FlagVietnamIcon,
} from '@deriv/quill-icons/Flags';

// NOTE: Language codes use uppercase format (EN, AR, etc.) instead of standard ISO 639-1
// lowercase format (en, ar, etc.). This is a project convention for consistency with
// the translation system. Ensure i18n/translation systems correctly map these codes.
export const LANGUAGES = [
    {
        code: 'EN',
        displayName: 'English',
        icon: <FlagUnitedKingdomIcon height={24} width={36} />,
        placeholderIcon: <FlagUnitedKingdomIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagUnitedKingdomIcon height={14.67} width={22} />,
    },
    {
        code: 'AR',
        displayName: 'العربية',
        icon: <FlagArabLeagueIcon height={24} width={36} />,
        placeholderIcon: <FlagArabLeagueIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagArabLeagueIcon height={14.67} width={22} />,
    },
    {
        code: 'BN',
        displayName: 'বাংলা',
        icon: <FlagBangladeshIcon height={24} width={36} />,
        placeholderIcon: <FlagBangladeshIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagBangladeshIcon height={14.67} width={22} />,
    },
    {
        code: 'DE',
        displayName: 'Deutsch',
        icon: <FlagGermanyIcon height={24} width={36} />,
        placeholderIcon: <FlagGermanyIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagGermanyIcon height={14.67} width={22} />,
    },

    {
        code: 'ES',
        displayName: 'Español',
        icon: <FlagSpainIcon height={24} width={36} />,
        placeholderIcon: <FlagSpainIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagSpainIcon height={14.67} width={22} />,
    },
    {
        code: 'FR',
        displayName: 'Français',
        icon: <FlagFranceIcon height={24} width={36} />,
        placeholderIcon: <FlagFranceIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagFranceIcon height={14.67} width={22} />,
    },
    {
        code: 'IT',
        displayName: 'Italiano',
        icon: <FlagItalyIcon height={24} width={36} />,
        placeholderIcon: <FlagItalyIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagItalyIcon height={14.67} width={22} />,
    },
    {
        code: 'SW',
        displayName: 'Kiswahili',
        icon: <FlagTanzaniaIcon height={24} width={36} />,
        placeholderIcon: <FlagTanzaniaIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagTanzaniaIcon height={14.67} width={22} />,
    },
    {
        code: 'KM',
        displayName: 'ខ្មែរ',
        icon: <FlagCambodiaIcon height={24} width={36} />,
        placeholderIcon: <FlagCambodiaIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagCambodiaIcon height={14.67} width={22} />,
    },
    {
        code: 'KO',
        displayName: '한국어',
        icon: <FlagSouthKoreaIcon height={24} width={36} />,
        placeholderIcon: <FlagSouthKoreaIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagSouthKoreaIcon height={14.67} width={22} />,
    },
    {
        code: 'MN',
        displayName: 'Монгол',
        icon: <FlagMongoliaIcon height={24} width={36} />,
        placeholderIcon: <FlagMongoliaIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagMongoliaIcon height={14.67} width={22} />,
    },
    {
        code: 'PL',
        displayName: 'Polski',
        icon: <FlagPolandIcon height={24} width={36} />,
        placeholderIcon: <FlagPolandIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagPolandIcon height={14.67} width={22} />,
    },
    {
        code: 'PT',
        displayName: 'Português',
        icon: <FlagPortugalIcon height={24} width={36} />,
        placeholderIcon: <FlagPortugalIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagPortugalIcon height={14.67} width={22} />,
    },
    {
        code: 'RU',
        displayName: 'Русский',
        icon: <FlagRussiaIcon height={24} width={36} />,
        placeholderIcon: <FlagRussiaIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagRussiaIcon height={14.67} width={22} />,
    },
    {
        code: 'SI',
        displayName: 'සිංහල',
        icon: <FlagSriLankaIcon height={24} width={36} />,
        placeholderIcon: <FlagSriLankaIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagSriLankaIcon height={14.67} width={22} />,
    },
    {
        code: 'TA',
        displayName: 'தமிழ்',
        // Using empty fragments instead of null to avoid potential runtime issues
        // Tamil is spoken across multiple countries (India, Sri Lanka, Singapore, Malaysia)
        // so no single flag is appropriate - icons are hidden via CSS anyway
        icon: <></>,
        placeholderIcon: <></>,
        placeholderIconInMobile: <></>,
    },
    {
        code: 'TR',
        displayName: 'Türkçe',
        icon: <FlagTurkeyIcon height={24} width={36} />,
        placeholderIcon: <FlagTurkeyIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagTurkeyIcon height={14.67} width={22} />,
    },
    {
        code: 'VI',
        displayName: 'Tiếng Việt',
        icon: <FlagVietnamIcon height={24} width={36} />,
        placeholderIcon: <FlagVietnamIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagVietnamIcon height={14.67} width={22} />,
    },
    {
        code: 'ZH_CN',
        displayName: '简体中文',
        icon: <FlagChinaSimplifiedIcon height={24} width={36} />,
        placeholderIcon: <FlagChinaSimplifiedIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagChinaSimplifiedIcon height={14.67} width={22} />,
    },
    {
        code: 'ZH_TW',
        displayName: '繁體中文',
        icon: <FlagChinaTraditionalIcon height={24} width={36} />,
        placeholderIcon: <FlagChinaTraditionalIcon height={12} width={18} />,
        placeholderIconInMobile: <FlagChinaTraditionalIcon height={14.67} width={22} />,
    },
];

// Available languages for the language switcher
// This filter exists to control which languages are shown in the UI, allowing for
// gradual rollout of new languages or temporary removal of languages if needed
// Currently includes all defined languages
export const FILTERED_LANGUAGES = LANGUAGES.filter(lang =>
    [
        'EN',
        'ES',
        'FR',
        'PT',
        'AR',
        'IT',
        'RU',
        'VI',
        'TR',
        'ZH_CN',
        'ZH_TW',
        'DE',
        'BN',
        'SW',
        'KO',
        'PL',
        'KM',
        'SI',
    ].includes(lang.code)
);
