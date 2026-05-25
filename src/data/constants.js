// Shared colour and transliteration constants used across components.
// Single source of truth — import from here rather than redefining locally.

export const HOMERIC_COLOURS = {
    'γλαυκός':        '#6B9AA3',
    'κυάνεος':        '#1E3A5F',
    'πορφυρεός':      '#53285b',
    'οἶνοψ':          '#43171e',
    'φοῖνιξ':         '#8B2F39',
    'ἐρυθρός':        '#B8302C',
    'ῥοδοδάκτυλος':   '#E8A0A0',
    'ξανθός':         '#D4AF37',
    'αἴθων':          '#C85A28',
    'χλωρός':         '#9CAF88',
    'λευκός':         '#FAFAFA',
    'ἀργός':          '#f4f4f4',
    'πολιός':         '#c2c2c2',
    'μέλας':          '#1A1A1A',
};

// Maps Greek term → Transliteration value (must match d.Transliteration in the scatterplot data)
export const GREEK_TO_TRANSLITERATION = {
    'γλαυκός':        'Glaukos',
    'κυάνεος':        'Kyaneos',
    'πορφυρεός':      'Porphureos',
    'οἶνοψ':          'Oinops',
    'φοῖνιξ':         'Phoinix',
    'ἐρυθρός':        'Erythros',
    'ῥοδοδάκτυλος':   'Rhododaktylos',
    'ξανθός':         'Xanthos',
    'αἴθων':          'Aithon',
    'χλωρός':         'Chloros',
    'λευκός':         'Leukos',
    'ἀργός':          'Argos',
    'πολιός':         'Polios',
    'μέλας':          'Melas',
};
