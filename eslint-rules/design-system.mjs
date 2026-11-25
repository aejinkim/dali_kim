// Design-system lint rules. Each rule encodes a decision already written in
// AGENTS.md / CLAUDE.md / docs/DESIGN.md, so an agent gets told at the line
// where it breaks the rule instead of hoping it read the docs.
// Rules run as warnings; scripts/ds-check.mjs fails CI only when a count rises.

const RAW_COLOR_FULL = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)?/;
const PX_VALUE = /(?:^|[\s(,])-?\d*\.?\d+px\b/;
const TW_ARBITRARY = /\b[a-z][a-z-]*-\[-?\d*\.?\d+(?:px|rem|em)\]/;

const SIZE_PROPS = new Set([
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'paddingInline', 'paddingBlock',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'marginInline', 'marginBlock',
  'gap', 'rowGap', 'columnGap',
  'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'top', 'right', 'bottom', 'left', 'inset',
  'fontSize', 'borderRadius', 'letterSpacing', 'lineHeight',
]);
// lineHeight as a unitless number is a ratio, not px.
const UNITLESS_OK = new Set(['lineHeight']);

function stringValue(node) {
  if (!node) return null;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'TemplateLiteral') return node.quasis.map((q) => q.value.cooked).join('${}');
  return null;
}

function propName(prop) {
  if (prop.type !== 'Property' || prop.computed) return null;
  if (prop.key.type === 'Identifier') return prop.key.name;
  if (prop.key.type === 'Literal') return String(prop.key.value);
  return null;
}

function jsxName(node) {
  return node.name && node.name.type === 'JSXIdentifier' ? node.name.name : null;
}

function jsxAttr(opening, name) {
  return opening.attributes.find((a) => a.type === 'JSXAttribute' && a.name.name === name);
}

const noRawColor = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Use a color token (var(--color-*) or CS.color.*) instead of a raw hex/rgb value.' },
    messages: {
      raw: 'Raw color "{{value}}". Use a semantic token from globals.css (e.g. var(--color-text-primary)). See docs/DESIGN.md › Color.',
    },
    schema: [],
  },
  create(context) {
    function check(node, value) {
      const m = value && value.match(RAW_COLOR_FULL);
      if (m) context.report({ node, messageId: 'raw', data: { value: m[0] } });
    }
    return {
      Literal(node) {
        if (typeof node.value === 'string') check(node, node.value);
      },
      TemplateLiteral(node) {
        check(node, stringValue(node));
      },
    };
  },
};

const noOneOffValue = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Sizes come from tokens, not values invented at the call site.' },
    messages: {
      px: 'One-off value {{value}} for "{{prop}}". Use a token (var(--…) or CS.space.*/CS.size.*). See docs/DESIGN.md › Spacing.',
      tw: 'Tailwind arbitrary value "{{value}}". Add a token to @theme in globals.css and use it instead.',
    },
    schema: [],
  },
  create(context) {
    return {
      Property(node) {
        const name = propName(node);
        if (!name || !SIZE_PROPS.has(name)) return;
        const v = node.value;
        if (v.type === 'Literal' && typeof v.value === 'number') {
          if (v.value === 0 || UNITLESS_OK.has(name)) return;
          context.report({ node: v, messageId: 'px', data: { value: String(v.value), prop: name } });
          return;
        }
        const s = stringValue(v);
        if (s && PX_VALUE.test(s) && !/var\(--/.test(s)) {
          context.report({ node: v, messageId: 'px', data: { value: JSON.stringify(s), prop: name } });
        }
      },
      JSXAttribute(node) {
        if (node.name.name !== 'className') return;
        const s = stringValue(node.value) ?? (node.value?.type === 'JSXExpressionContainer' ? stringValue(node.value.expression) : null);
        const m = s && s.match(TW_ARBITRARY);
        if (m) context.report({ node, messageId: 'tw', data: { value: m[0] } });
      },
    };
  },
};

const noRawElement = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Use the existing component instead of the raw HTML element.' },
    messages: {
      img: 'Raw <img>. Use next/image <Image> (or the case-study FullBleedImage). See docs/DESIGN.md › Components.',
      link: 'Raw <a href="{{href}}"> for an internal route. Use next/link <Link>.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const name = jsxName(node);
        if (name === 'img') context.report({ node, messageId: 'img' });
        if (name === 'a') {
          const href = jsxAttr(node, 'href');
          const v = href && stringValue(href.value?.type === 'JSXExpressionContainer' ? href.value.expression : href.value);
          if (v && v.startsWith('/') && !v.startsWith('//') && !/\.(pdf|png|jpe?g|mp4|webm|zip)$/i.test(v)) {
            context.report({ node, messageId: 'link', data: { href: v } });
          }
        }
      },
    };
  },
};

const singleH1 = {
  meta: {
    type: 'problem',
    docs: { description: 'A page has one <h1>.' },
    messages: { extra: 'Second <h1> in this file. A page has exactly one <h1>; use <h2> for section titles.' },
    schema: [],
  },
  create(context) {
    let seen = 0;
    return {
      JSXOpeningElement(node) {
        if (jsxName(node) === 'h1' && ++seen > 1) context.report({ node, messageId: 'extra' });
      },
    };
  },
};

const fontFamily = {
  meta: {
    type: 'problem',
    docs: { description: 'Only the project font tokens are allowed.' },
    messages: {
      font: 'fontFamily "{{value}}" is not a font token. Use var(--font-google-sans-flex) (or var(--font-pixel) inside Hero Mode C only).',
    },
    schema: [],
  },
  create(context) {
    return {
      Property(node) {
        if (propName(node) !== 'fontFamily') return;
        const s = stringValue(node.value);
        if (s === null) return;
        if (s === 'inherit' || /var\(--font-(google-sans-flex|pixel)\)/.test(s)) return;
        context.report({ node: node.value, messageId: 'font', data: { value: s } });
      },
    };
  },
};

const noOffScale = {
  meta: {
    type: 'suggestion',
    docs: { description: 'offScale() is the visible escape hatch for a spacing value outside the scale.' },
    messages: { off: 'offScale({{value}}) is outside the spacing scale. Keep only if the design really needs it, then record why in docs/DESIGN.md.' },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'offScale') {
          const arg = node.arguments[0];
          context.report({ node, messageId: 'off', data: { value: arg && arg.type === 'Literal' ? String(arg.value) : '…' } });
        }
      },
    };
  },
};

export default {
  meta: { name: 'design-system' },
  rules: {
    'no-raw-color': noRawColor,
    'no-one-off-value': noOneOffValue,
    'no-raw-element': noRawElement,
    'single-h1': singleH1,
    'font-family': fontFamily,
    'no-off-scale': noOffScale,
  },
};
