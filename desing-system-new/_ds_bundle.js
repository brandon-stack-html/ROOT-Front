/* @ds-bundle: {"format":3,"namespace":"ROOTDesignSystem_27eeaa","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"KpiCard","sourcePath":"components/core/KpiCard.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"4f4a63c92544","components/core/Badge.jsx":"3b01b6deafb3","components/core/Button.jsx":"977c85ca2d19","components/core/Card.jsx":"6081b8214eef","components/core/Input.jsx":"2b0e5b34f28b","components/core/KpiCard.jsx":"e638205594c7","components/core/Switch.jsx":"514970538cff","components/core/Tabs.jsx":"7f9f6da8aed4","ui_kits/backoffice/app.jsx":"5f5545d63894","ui_kits/mesero/app.jsx":"65410c600fd6","ui_kits/storefront/app.jsx":"b26ac53d4604"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ROOTDesignSystem_27eeaa = window.ROOTDesignSystem_27eeaa || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Avatar({
  name = '',
  src,
  size = 32,
  color,
  role,
  style = {},
  ...rest
}) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const box = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--ff-base)',
    fontWeight: 700,
    fontSize: Math.round(size * 0.36),
    color: '#fff',
    background: color || 'var(--accent)',
    flexShrink: 0,
    overflow: 'hidden',
    userSelect: 'none',
    ...style
  };
  const avatar = src ? /*#__PURE__*/React.createElement("span", _extends({
    style: box
  }, rest), /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })) : /*#__PURE__*/React.createElement("span", _extends({
    style: box,
    "aria-label": name
  }, rest), initials);
  if (!role) return avatar;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10
    }
  }, avatar, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text)',
      fontFamily: 'var(--ff-base)'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--muted)',
      fontFamily: 'var(--ff-base)'
    }
  }, role)));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  tone = 'muted',
  dot = false,
  size = 'md',
  children,
  style = {},
  ...rest
}) {
  const tones = {
    success: {
      background: 'var(--state-success-bg)',
      borderColor: 'var(--state-success-border)',
      color: 'var(--state-success)',
      dot: 'var(--state-success)'
    },
    warning: {
      background: 'var(--state-warning-bg)',
      borderColor: 'var(--state-warning-border)',
      color: 'var(--state-warning)',
      dot: 'var(--state-warning)'
    },
    danger: {
      background: 'var(--state-danger-bg)',
      borderColor: 'var(--state-danger-border)',
      color: 'var(--state-danger)',
      dot: 'var(--state-danger)'
    },
    info: {
      background: 'var(--state-info-bg)',
      borderColor: 'var(--state-info-border)',
      color: 'var(--state-info)',
      dot: 'var(--state-info)'
    },
    muted: {
      background: 'var(--alt)',
      borderColor: 'var(--border-default)',
      color: 'var(--muted)',
      dot: 'var(--muted)'
    },
    accent: {
      background: 'var(--accent-soft)',
      borderColor: 'transparent',
      color: 'var(--accent)',
      dot: 'var(--accent)'
    }
  };
  const t = tones[tone] || tones.muted;
  const sz = size === 'sm' ? {
    padding: '3px 8px',
    fontSize: 11
  } : size === 'lg' ? {
    padding: '5px 12px',
    fontSize: 13
  } : {
    padding: '4px 10px',
    fontSize: 12
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      borderRadius: 'var(--radius-full)',
      border: '1px solid',
      fontFamily: 'var(--ff-base)',
      fontWeight: 500,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      background: t.background,
      borderColor: t.borderColor,
      color: t.color,
      ...sz,
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: size === 'sm' ? 5 : 6,
      height: size === 'sm' ? 5 : 6,
      borderRadius: '50%',
      background: t.dot,
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  onClick,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '5px 10px',
      fontSize: 11,
      borderRadius: 'var(--radius-sm)'
    },
    md: {
      padding: '8px 16px',
      fontSize: 13,
      borderRadius: 'var(--radius-md)'
    },
    lg: {
      padding: '10px 18px',
      fontSize: 14,
      borderRadius: 'var(--radius-md)'
    },
    touch: {
      padding: '14px 18px',
      fontSize: 15,
      borderRadius: 'var(--radius-lg)',
      minHeight: 48
    }
  };
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: '#fff',
      borderColor: 'var(--accent)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text)',
      borderColor: 'var(--border)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--accent)',
      borderColor: 'transparent'
    },
    destructive: {
      background: 'var(--error)',
      color: '#fff',
      borderColor: 'var(--error)'
    }
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    border: '1px solid transparent',
    fontFamily: 'var(--ff-base)',
    fontWeight: 500,
    lineHeight: 1.2,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
    transition: 'background-color .15s ease, color .15s ease, border-color .15s ease, transform .05s ease',
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  const [hover, setHover] = React.useState(false);
  const hoverBg = {
    primary: 'var(--accent-hover)',
    secondary: 'var(--alt)',
    ghost: 'var(--accent-soft)',
    destructive: '#DC2626'
  };
  const hovered = hover && !disabled ? {
    background: hoverBg[variant],
    borderColor: variant === 'secondary' || variant === 'ghost' ? base.borderColor : hoverBg[variant],
    color: variant === 'ghost' ? 'var(--accent)' : base.color
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...hovered
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  title,
  meta,
  headerRight,
  footer,
  interactive = false,
  children,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--bg-surface)',
      border: `1px solid ${interactive && hover ? 'var(--border-strong)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      fontFamily: 'var(--ff-base)',
      color: 'var(--text)',
      cursor: interactive ? 'pointer' : 'default',
      transform: interactive && hover ? 'translateY(-2px)' : 'none',
      boxShadow: interactive && hover ? 'var(--shadow-md)' : 'none',
      transition: 'transform .15s ease, box-shadow .15s ease, border-color .15s ease',
      ...style
    }
  }, rest), (title || headerRight || meta) && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", null, meta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      color: 'var(--muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      marginBottom: 2
    }
  }, meta), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      lineHeight: 1.3
    }
  }, title)), headerRight), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--space-2)'
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  required = false,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  disabled = false,
  onChange,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || React.useId();
  const borderColor = error ? 'var(--error)' : focus ? 'var(--accent)' : 'var(--border)';
  const ring = focus ? `0 0 0 3px ${error ? 'rgba(239,68,68,0.15)' : 'var(--accent-ring)'}` : 'none';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'block',
      marginBottom: 'var(--space-4)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: 'block',
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--text)',
      marginBottom: 6,
      fontFamily: 'var(--ff-base)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--error)',
      marginLeft: 2
    }
  }, "*")), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: type,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      padding: '8px 12px',
      background: disabled ? 'var(--alt)' : 'var(--bg)',
      color: 'var(--text)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--ff-base)',
      fontSize: 13,
      lineHeight: 1.4,
      outline: 'none',
      opacity: disabled ? 0.6 : 1,
      boxShadow: ring,
      transition: 'border-color .15s ease, box-shadow .15s ease'
    }
  }, rest)), error ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--error)',
      marginTop: 4,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u26A0"), error) : hint ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--muted)',
      marginTop: 4,
      lineHeight: 1.4
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/KpiCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function KpiCard({
  label,
  value,
  delta,
  deltaDir = 'flat',
  icon = null,
  tone = 'default',
  style = {},
  ...rest
}) {
  const tones = {
    default: {
      background: 'var(--bg-surface)',
      borderColor: 'var(--border-default)'
    },
    success: {
      background: 'var(--state-success-bg)',
      borderColor: 'var(--state-success-border)'
    },
    warning: {
      background: 'var(--state-warning-bg)',
      borderColor: 'var(--state-warning-border)'
    },
    error: {
      background: 'var(--state-danger-bg)',
      borderColor: 'var(--state-danger-border)'
    },
    muted: {
      background: 'var(--alt)',
      borderColor: 'var(--border-default)'
    }
  };
  const deltaColor = {
    up: 'var(--success)',
    down: 'var(--error)',
    flat: 'var(--muted)'
  }[deltaDir];
  const t = tones[tone] || tones.default;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      padding: '16px 18px',
      background: t.background,
      border: `1px solid ${t.borderColor}`,
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      fontFamily: 'var(--ff-base)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      color: 'var(--muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: 'var(--alt)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--muted)',
      flexShrink: 0
    }
  }, icon)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      color: 'var(--text)',
      lineHeight: 1.15,
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      color: deltaColor
    }
  }, deltaDir === 'up' ? '▲' : deltaDir === 'down' ? '▼' : '•', " ", delta));
}
Object.assign(__ds_scope, { KpiCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/KpiCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  id,
  style = {},
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : internal;
  const fieldId = id || React.useId();
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInternal(!on);
    onChange && onChange(!on);
  };
  const sw = /*#__PURE__*/React.createElement("button", _extends({
    role: "switch",
    "aria-checked": on,
    id: fieldId,
    onClick: toggle,
    disabled: disabled,
    style: {
      width: 38,
      height: 22,
      borderRadius: 'var(--radius-full)',
      border: 'none',
      padding: 2,
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: on ? 'var(--accent)' : 'var(--border)',
      opacity: disabled ? 0.5 : 1,
      transition: 'background-color .15s ease',
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      transform: on ? 'translateX(16px)' : 'translateX(0)',
      transition: 'transform .15s ease'
    }
  }));
  if (!label) return sw;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--ff-base)',
      fontSize: 13,
      color: 'var(--text)',
      ...style
    }
  }, sw, label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style = {},
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && tabs[0].id));
  const active = value !== undefined ? value : internal;
  const select = id => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      borderBottom: '1px solid var(--border-default)',
      gap: 2,
      fontFamily: 'var(--ff-base)',
      ...style
    },
    role: "tablist"
  }, rest), tabs.map(t => {
    const isActive = t.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      role: "tab",
      "aria-selected": isActive,
      onClick: () => select(t.id),
      style: {
        background: 'transparent',
        border: 'none',
        padding: '10px 14px',
        fontFamily: 'var(--ff-base)',
        fontSize: 13,
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--accent)' : 'var(--muted)',
        cursor: 'pointer',
        borderBottom: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
        marginBottom: -1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        transition: 'color .12s ease, border-color .12s ease'
      }
    }, t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: isActive ? 'var(--accent)' : 'var(--muted)',
        background: isActive ? 'var(--accent-soft)' : 'var(--alt)',
        borderRadius: 'var(--radius-full)',
        padding: '1px 7px'
      }
    }, t.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/backoffice/app.jsx
try { (() => {
const {
  KpiCard,
  Card,
  Badge,
  Button,
  Avatar
} = window.ROOTDesignSystem_27eeaa;
const NAV = [{
  group: 'Operación',
  items: [{
    icon: 'layout-dashboard',
    label: 'Dashboard',
    active: true
  }, {
    icon: 'shopping-cart',
    label: 'POS'
  }, {
    icon: 'chef-hat',
    label: 'KDS'
  }, {
    icon: 'dollar-sign',
    label: 'Caja'
  }]
}, {
  group: 'Gestión',
  items: [{
    icon: 'package',
    label: 'Catálogo'
  }, {
    icon: 'archive',
    label: 'Inventario'
  }, {
    icon: 'users',
    label: 'Clientes'
  }, {
    icon: 'truck',
    label: 'Proveedores'
  }, {
    icon: 'receipt',
    label: 'Gastos'
  }]
}, {
  group: 'Nómina',
  items: [{
    icon: 'wallet',
    label: 'Nómina'
  }, {
    icon: 'clock',
    label: 'Adelantos',
    count: 3
  }, {
    icon: 'user-check',
    label: 'Empleados'
  }]
}, {
  group: 'Finanzas',
  items: [{
    icon: 'file-text',
    label: 'Facturación DIAN'
  }, {
    icon: 'bar-chart-3',
    label: 'Reportes'
  }]
}, {
  group: 'Config',
  items: [{
    icon: 'settings',
    label: 'Configuración'
  }, {
    icon: 'user-circle',
    label: 'Usuarios'
  }, {
    icon: 'shield',
    label: 'Roles'
  }, {
    icon: 'plug',
    label: 'Integraciones'
  }]
}];
const TOP_PRODUCTOS = [{
  n: 'Bandeja Paisa',
  u: 42,
  t: '$1.176.000'
}, {
  n: 'Ajiaco Bogotano',
  u: 31,
  t: '$682.000'
}, {
  n: 'Limonada Natural',
  u: 88,
  t: '$616.000'
}, {
  n: 'Sancocho de Gallina',
  u: 19,
  t: '$494.000'
}];
function Icon({
  name,
  style
}) {
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: style
  });
}
function Sidebar({
  active,
  setActive
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "bo-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bo-sidebar-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nova-lockup",
    style: {
      fontSize: 18
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "nova-lockup-mark",
    src: "../../assets/brand/nova-mark.svg",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "nova-wordmark"
  }, "NOVA")), /*#__PURE__*/React.createElement("button", {
    className: "bo-business-selector",
    type: "button"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bo-business-avatar"
  }, "EB"), /*#__PURE__*/React.createElement("span", {
    className: "bo-business-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Negocio"), /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "El Buen Sabor")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevrons-up-down",
    style: {
      width: 14,
      height: 14
    }
  }))), /*#__PURE__*/React.createElement("nav", {
    className: "bo-sidebar-nav"
  }, NAV.map(g => /*#__PURE__*/React.createElement("div", {
    className: "bo-sidebar-group",
    key: g.group
  }, /*#__PURE__*/React.createElement("div", {
    className: "bo-sidebar-group-title"
  }, g.group), g.items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.label,
    className: 'bo-sidebar-item' + (active === it.label ? ' is-active' : ''),
    onClick: e => {
      e.preventDefault();
      setActive(it.label);
    },
    href: "#"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon
  }), it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
    className: "badge-count"
  }, it.count)))))), /*#__PURE__*/React.createElement("div", {
    className: "bo-sidebar-footer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bo-user-avatar"
  }, "JC"), /*#__PURE__*/React.createElement("span", {
    className: "bo-user-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Juan Camilo"), /*#__PURE__*/React.createElement("span", {
    className: "role"
  }, "Administrador")), /*#__PURE__*/React.createElement("button", {
    className: "bo-logout",
    type: "button",
    "aria-label": "Cerrar sesi\xF3n"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "log-out"
  }))));
}
function Topbar({
  active,
  onToggleTheme
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "bo-topbar"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "bo-breadcrumb"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bo-breadcrumb-item"
  }, "Inicio"), /*#__PURE__*/React.createElement("span", {
    className: "bo-breadcrumb-sep"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right"
  })), /*#__PURE__*/React.createElement("span", {
    className: "bo-breadcrumb-item is-active"
  }, active)), /*#__PURE__*/React.createElement("div", {
    className: "bo-topbar-spacer"
  }), /*#__PURE__*/React.createElement("button", {
    className: "bo-topbar-sucursal",
    type: "button"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "store"
  }), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Sede Norte")), /*#__PURE__*/React.createElement("div", {
    className: "bo-topbar-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bo-topbar-icon",
    "aria-label": "Buscar"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  })), /*#__PURE__*/React.createElement("button", {
    className: "bo-topbar-icon",
    "aria-label": "Notificaciones"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "notification-dot"
  })), /*#__PURE__*/React.createElement("button", {
    className: "bo-topbar-icon",
    "aria-label": "Cambiar tema",
    onClick: onToggleTheme
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sun-moon"
  })), /*#__PURE__*/React.createElement("button", {
    className: "bo-topbar-avatar",
    "aria-label": "Perfil"
  }, "JC")));
}
function Dashboard() {
  const [period, setPeriod] = React.useState('Hoy');
  return /*#__PURE__*/React.createElement("main", {
    className: "bo-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bo-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "bo-page-title"
  }, "Buenos d\xEDas, Juan Camilo"), /*#__PURE__*/React.createElement("div", {
    className: "bo-page-subtitle"
  }, "Lunes, 15 de noviembre \xB7 Sede Norte")), /*#__PURE__*/React.createElement("div", {
    className: "bo-page-actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bo-period-toggle"
  }, ['Hoy', 'Semana', 'Mes'].map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    className: period === p ? 'is-active' : '',
    onClick: () => setPeriod(p)
  }, p))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      style: {
        width: 13,
        height: 13
      }
    })
  }, "15 nov 2026"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid"
  }, /*#__PURE__*/React.createElement(KpiCard, {
    label: "Ventas hoy",
    value: "$1.234.000",
    delta: "12% vs ayer",
    deltaDir: "up",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "dollar-sign",
      style: {
        width: 15,
        height: 15
      }
    })
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "Transacciones",
    value: "47",
    delta: "8%",
    deltaDir: "up",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "receipt",
      style: {
        width: 15,
        height: 15
      }
    })
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "Ticket promedio",
    value: "$26.255",
    delta: "3%",
    deltaDir: "down",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "trending-up",
      style: {
        width: 15,
        height: 15
      }
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "dian-card ok"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dian-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dian-card-label"
  }, "Estado DIAN"), /*#__PURE__*/React.createElement("div", {
    className: "dian-icon-wrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    style: {
      width: 15,
      height: 15,
      color: 'var(--success)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dian-card-value"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle-2",
    style: {
      width: 18,
      height: 18,
      color: 'var(--success)'
    }
  }), "Todo enviado"), /*#__PURE__*/React.createElement("div", {
    className: "dian-card-detail"
  }, "24 enviadas \xB7 0 con error"))), /*#__PURE__*/React.createElement("div", {
    className: "dash-row-2-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dash-card-title"
  }, "Ventas \xFAltimos 7 d\xEDas"), /*#__PURE__*/React.createElement("div", {
    className: "dash-card-sub"
  }, "Total: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text)'
    }
  }, "$7.901.000"), " \xB7 Promedio diario: $1.128.714")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      style: {
        width: 11,
        height: 11
      }
    })
  }, "Exportar")), /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    viewBox: "0 0 600 200",
    preserveAspectRatio: "xMidYMid meet",
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "areaGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#B98521",
    stopOpacity: "0.28"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#B98521",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("g", {
    transform: "translate(38,12)"
  }, [0, 43.5, 87, 130.5, 165].map((y, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: "0",
    x2: "548",
    y1: y,
    y2: y,
    stroke: "var(--border)",
    strokeWidth: "1",
    strokeDasharray: "3,4",
    opacity: "0.6"
  })), /*#__PURE__*/React.createElement("text", {
    x: "-8",
    y: "4",
    textAnchor: "end",
    fontSize: "10",
    fill: "var(--muted)",
    fontFamily: "monospace"
  }, "$1620K"), /*#__PURE__*/React.createElement("text", {
    x: "-8",
    y: "91",
    textAnchor: "end",
    fontSize: "10",
    fill: "var(--muted)",
    fontFamily: "monospace"
  }, "$810K"), /*#__PURE__*/React.createElement("text", {
    x: "-8",
    y: "168",
    textAnchor: "end",
    fontSize: "10",
    fill: "var(--muted)",
    fontFamily: "monospace"
  }, "$0K"), /*#__PURE__*/React.createElement("path", {
    d: "M 0,86 C 45.67,86 45.67,72.6 91.33,72.6 C 137,72.6 137,90.2 182.67,90.2 C 228.33,90.2 228.33,53.8 274,53.8 C 319.67,53.8 319.67,25.9 365.33,25.9 C 411,25.9 411,12 456.67,12 C 502.33,12 502.33,41.5 548,41.5 L 548,165 L 0,165 Z",
    fill: "url(#areaGrad)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 0,86 C 45.67,86 45.67,72.6 91.33,72.6 C 137,72.6 137,90.2 182.67,90.2 C 228.33,90.2 228.33,53.8 274,53.8 C 319.67,53.8 319.67,25.9 365.33,25.9 C 411,25.9 411,12 456.67,12 C 502.33,12 502.33,41.5 548,41.5",
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }), ['Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom', 'Lun'].map((d, i) => /*#__PURE__*/React.createElement("text", {
    key: d,
    x: i * 91.3,
    y: "186",
    textAnchor: "middle",
    fontSize: "10",
    fill: "var(--muted)"
  }, d))))), /*#__PURE__*/React.createElement(Card, {
    title: "Top productos",
    meta: "Hoy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "top-productos"
  }, TOP_PRODUCTOS.map((p, i) => /*#__PURE__*/React.createElement("div", {
    className: "top-producto-item",
    key: p.n
  }, /*#__PURE__*/React.createElement("span", {
    className: 'top-producto-rank' + (i === 0 ? ' rank-1' : '')
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    className: "top-producto-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "top-producto-nombre"
  }, p.n), /*#__PURE__*/React.createElement("span", {
    className: "top-producto-unidades"
  }, " \xB7 ", p.u, " uds")), /*#__PURE__*/React.createElement("span", {
    className: "top-producto-total"
  }, p.t)))))));
}
function Placeholder({
  active
}) {
  return /*#__PURE__*/React.createElement("main", {
    className: "bo-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bo-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "bo-page-title"
  }, active), /*#__PURE__*/React.createElement("div", {
    className: "bo-page-subtitle"
  }, "Pantalla del producto \xB7 ver repo NOVA-Front"))), /*#__PURE__*/React.createElement("div", {
    className: "dash-card",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layout",
    style: {
      width: 18,
      height: 18
    }
  }), "Esta vista existe en el producto. Este UI kit demuestra el Dashboard; abre ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text)',
      margin: '0 4px'
    }
  }, "Dashboard"), " para verlo."));
}
function App() {
  const [active, setActive] = React.useState('Dashboard');
  const toggleTheme = () => {
    const el = document.documentElement;
    el.setAttribute('data-theme', el.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    setTimeout(() => window.lucide && window.lucide.createIcons(), 0);
  };
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "bo-shell"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    active: active,
    setActive: setActive
  }), /*#__PURE__*/React.createElement("div", {
    className: "bo-content-wrap"
  }, /*#__PURE__*/React.createElement(Topbar, {
    active: active,
    onToggleTheme: toggleTheme
  }), active === 'Dashboard' ? /*#__PURE__*/React.createElement(Dashboard, null) : /*#__PURE__*/React.createElement(Placeholder, {
    active: active
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/backoffice/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mesero/app.jsx
try { (() => {
const {
  Button,
  Badge,
  Card
} = window.ROOTDesignSystem_27eeaa;
function Icon({
  name,
  style
}) {
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: style
  });
}
const MESAS = {
  'Salón Principal': [{
    n: 1,
    estado: 'libre'
  }, {
    n: 2,
    estado: 'ocupada',
    com: 4,
    total: '$86.000'
  }, {
    n: 3,
    estado: 'por-cobrar',
    com: 2,
    total: '$48.500'
  }, {
    n: 4,
    estado: 'libre'
  }, {
    n: 5,
    estado: 'ocupada',
    com: 3,
    total: '$62.000'
  }, {
    n: 6,
    estado: 'reservada'
  }],
  'Terraza': [{
    n: 11,
    estado: 'libre'
  }, {
    n: 12,
    estado: 'ocupada',
    com: 2,
    total: '$39.000'
  }]
};
const ESTADO_LABEL = {
  libre: 'Libre',
  ocupada: 'Ocupada',
  'por-cobrar': 'Por cobrar',
  reservada: 'Reservada'
};
const ESTADO_TONE = {
  ocupada: 'danger',
  'por-cobrar': 'warning',
  reservada: 'info',
  libre: 'muted'
};
function StatusBar() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mesero-statusbar"
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("div", {
    className: "mesero-statusbar-icons"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "signal"
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "wifi"
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "battery-full"
  })));
}
function BottomNav({
  tab,
  setTab
}) {
  const tabs = [{
    id: 'mesas',
    icon: 'layout-grid',
    label: 'Mesas'
  }, {
    id: 'comandas',
    icon: 'clipboard-list',
    label: 'Comandas',
    badge: 2
  }, {
    id: 'nomina',
    icon: 'wallet',
    label: 'Nómina'
  }, {
    id: 'perfil',
    icon: 'user',
    label: 'Mi perfil'
  }];
  return /*#__PURE__*/React.createElement("nav", {
    className: "mesero-bottom-nav"
  }, tabs.map(t => /*#__PURE__*/React.createElement("a", {
    key: t.id,
    href: "#",
    className: 'mesero-bottom-nav-tab' + (tab === t.id ? ' is-active' : ''),
    onClick: e => {
      e.preventDefault();
      setTab(t.id);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mesero-bottom-nav-tab-icon-wrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon
  }), t.badge && /*#__PURE__*/React.createElement("span", {
    className: "mesero-bottom-nav-tab-badge"
  }, t.badge)), /*#__PURE__*/React.createElement("span", null, t.label))));
}
function MesasScreen() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "mesero-topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-side"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mesero-zona-btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin"
  }), "Sede Norte")), /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-title"
  }, "Mesas"), /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-subtitle"
  }, "Camila Rojas")), /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-side"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mesero-icon-btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh-cw"
  })))), /*#__PURE__*/React.createElement("main", {
    className: "mesero-content"
  }, Object.entries(MESAS).map(([zona, mesas]) => /*#__PURE__*/React.createElement("div", {
    key: zona
  }, /*#__PURE__*/React.createElement("div", {
    className: "zona-label"
  }, zona), /*#__PURE__*/React.createElement("div", {
    className: "mesa-grid"
  }, mesas.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.n,
    className: 'mesa-card ' + m.estado
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mesa-num"
  }, String(m.n).padStart(2, '0')), /*#__PURE__*/React.createElement(Badge, {
    tone: ESTADO_TONE[m.estado],
    dot: true,
    size: "sm"
  }, ESTADO_LABEL[m.estado])), m.estado === 'libre' || m.estado === 'reservada' ? /*#__PURE__*/React.createElement("span", {
    className: "mesa-meta"
  }, m.estado === 'reservada' ? '19:30 · 4 pers.' : 'Tocar para abrir') : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mesa-meta"
  }, m.com, " comensales"), /*#__PURE__*/React.createElement("span", {
    className: "mesa-total"
  }, m.total)))))))));
}
function NominaScreen() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "mesero-topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-side",
    style: {
      width: 34
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-title"
  }, "Mi n\xF3mina")), /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-side"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mesero-icon-btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "history"
  })))), /*#__PURE__*/React.createElement("main", {
    className: "mesero-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nom-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nom-hero-label"
  }, "Pr\xF3ximo pago"), /*#__PURE__*/React.createElement("div", {
    className: "nom-hero-count"
  }, "en 6 d\xEDas"), /*#__PURE__*/React.createElement("div", {
    className: "nom-hero-date"
  }, "Quincenal \xB7 30 de noviembre"), /*#__PURE__*/React.createElement("div", {
    className: "nom-progress"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '60%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "nom-progress-meta"
  }, /*#__PURE__*/React.createElement("span", null, "Periodo 60%"), /*#__PURE__*/React.createElement("span", null, "$974.100 devengado"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "nom-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Salario base"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "$1.623.500")), /*#__PURE__*/React.createElement("div", {
    className: "nom-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Devengado a la fecha"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "$974.100")), /*#__PURE__*/React.createElement("div", {
    className: "nom-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Adelantos del periodo"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "$200.000")), /*#__PURE__*/React.createElement("div", {
    className: "nom-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Disponible para adelanto"), /*#__PURE__*/React.createElement("span", {
    className: "v",
    style: {
      color: 'var(--accent)'
    }
  }, "$287.050"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "touch",
    fullWidth: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "hand-coins",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Solicitar adelanto"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "touch",
    fullWidth: true
  }, "Ver mis adelantos"))));
}
function SimpleScreen({
  title,
  icon,
  note
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "mesero-topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-side",
    style: {
      width: 34
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-title"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "mesero-topbar-side",
    style: {
      width: 34
    }
  })), /*#__PURE__*/React.createElement("main", {
    className: "mesero-content",
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'var(--muted)',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    style: {
      width: 30,
      height: 30
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      maxWidth: 220,
      lineHeight: 1.5
    }
  }, note)));
}
function App() {
  const [tab, setTab] = React.useState('mesas');
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  let screen;
  if (tab === 'mesas') screen = /*#__PURE__*/React.createElement(MesasScreen, null);else if (tab === 'nomina') screen = /*#__PURE__*/React.createElement(NominaScreen, null);else if (tab === 'comandas') screen = /*#__PURE__*/React.createElement(SimpleScreen, {
    title: "Comandas",
    icon: "clipboard-list",
    note: "Comandas activas del mesero en cocina y barra. 2 en preparaci\xF3n."
  });else screen = /*#__PURE__*/React.createElement(SimpleScreen, {
    title: "Mi perfil",
    icon: "user",
    note: "Camila Rojas \xB7 emp-001 \xB7 Sede Norte. Propinas, sesi\xF3n y ajustes."
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "mesero-stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mesero-frame"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mesero-app"
  }, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    className: "mesero-body-inner"
  }, screen, /*#__PURE__*/React.createElement(BottomNav, {
    tab: tab,
    setTab: setTab
  })), /*#__PURE__*/React.createElement("div", {
    className: "mesero-home-indicator"
  }))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mesero/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/app.jsx
try { (() => {
function Icon({
  name,
  style
}) {
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: style
  });
}
const CATS = ['Todo', 'Bandejas', 'Sopas', 'Bebidas', 'Postres'];
const PRODS = [{
  n: 'Bandeja Paisa',
  d: 'Frijoles, arroz, carne molida, chicharrón, huevo, plátano y arepa.',
  p: 28000,
  c: 'Bandejas',
  img: '#B96B3A',
  badge: 'Top ventas',
  ic: 'utensils'
}, {
  n: 'Ajiaco Bogotano',
  d: 'Tres papas, pollo, mazorca, alcaparras y crema. Con aguacate.',
  p: 22000,
  c: 'Sopas',
  img: '#B98521',
  ic: 'soup'
}, {
  n: 'Sancocho de Gallina',
  d: 'Gallina criolla, yuca, plátano y mazorca. Servido con arroz.',
  p: 26000,
  c: 'Sopas',
  img: '#9A6E15',
  ic: 'soup'
}, {
  n: 'Limonada Natural',
  d: 'Limón exprimido al momento. Endulzada al gusto.',
  p: 7000,
  c: 'Bebidas',
  img: '#1E40AF',
  ic: 'cup-soda'
}, {
  n: 'Jugo de Lulo',
  d: 'Pulpa de lulo fresca en agua o leche.',
  p: 8000,
  c: 'Bebidas',
  img: '#22C55E',
  ic: 'cup-soda'
}, {
  n: 'Postre de Natas',
  d: 'Postre tradicional bogotano con uvas pasas y canela.',
  p: 9500,
  c: 'Postres',
  img: '#F59E0B',
  ic: 'cake-slice'
}];
const fmt = n => '$' + n.toLocaleString('es-CO');
function App() {
  const [cat, setCat] = React.useState('Todo');
  const [count, setCount] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const add = p => {
    setCount(c => c + 1);
    setTotal(t => t + p.p);
  };
  const shown = PRODS.filter(p => cat === 'Todo' || p.c === cat);
  return /*#__PURE__*/React.createElement("div", {
    className: "sf"
  }, /*#__PURE__*/React.createElement("header", {
    className: "sf-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sf-wrap sf-header-row"
  }, /*#__PURE__*/React.createElement("a", {
    className: "sf-brand",
    href: "#"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sf-bs-logo"
  }, "BS"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "sf-brand-name"
  }, "El Buen Sabor"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "sf-brand-sub"
  }, "Restaurante \xB7 Bogot\xE1"))), /*#__PURE__*/React.createElement("nav", {
    className: "sf-nav"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "is-active"
  }, "Inicio"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Carta"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Sucursales"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Nosotros"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Contacto")), /*#__PURE__*/React.createElement("div", {
    className: "sf-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sf-icon-btn",
    "aria-label": "Buscar"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  })), /*#__PURE__*/React.createElement("a", {
    className: "sf-login",
    href: "#"
  }, "Iniciar sesi\xF3n"), /*#__PURE__*/React.createElement("button", {
    className: "sf-cart-btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shopping-cart"
  }), "Carrito", /*#__PURE__*/React.createElement("span", {
    className: "sf-cart-count"
  }, count))))), /*#__PURE__*/React.createElement("div", {
    className: "sf-wrap"
  }, /*#__PURE__*/React.createElement("section", {
    className: "sf-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sf-hero-pattern",
    "aria-hidden": "true"
  }, Array.from({
    length: 30
  }).map((_, i) => /*#__PURE__*/React.createElement(Icon, {
    key: i,
    name: ['utensils', 'soup', 'cup-soda', 'cake-slice', 'coffee'][i % 5]
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sf-hero-content"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sf-hero-eyebrow"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    style: {
      width: 12,
      height: 12
    }
  }), "Bogot\xE1 \xB7 Domicilios y para llevar"), /*#__PURE__*/React.createElement("h1", {
    className: "sf-hero-title"
  }, "El sabor de Colombia", /*#__PURE__*/React.createElement("br", null), "en tu puerta"), /*#__PURE__*/React.createElement("p", {
    className: "sf-hero-sub"
  }, "Pedidos a domicilio sin comisiones, hechos directamente por nosotros. Fresco y caliente en 30\u201345 minutos."), /*#__PURE__*/React.createElement("a", {
    className: "sf-hero-cta",
    href: "#productos"
  }, "Pedir ahora", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sf-hero-chips"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sf-hero-chip"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "truck"
  }), "Env\xEDo gratis desde $30.000"), /*#__PURE__*/React.createElement("span", {
    className: "sf-hero-chip"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock"
  }), "Promedio 35 min"), /*#__PURE__*/React.createElement("span", {
    className: "sf-hero-chip"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  }), "4.8 \xB7 240 rese\xF1as"))), /*#__PURE__*/React.createElement("div", {
    className: "sf-section-head",
    id: "productos"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sf-section-title"
  }, "Nuestra carta"), /*#__PURE__*/React.createElement("a", {
    className: "sf-section-link",
    href: "#"
  }, "Ver todo \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "sf-cats"
  }, CATS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: 'sf-cat' + (cat === c ? ' is-active' : ''),
    onClick: () => setCat(c)
  }, c))), /*#__PURE__*/React.createElement("div", {
    className: "sf-grid"
  }, shown.map(p => /*#__PURE__*/React.createElement("article", {
    className: "sf-prod",
    key: p.n
  }, /*#__PURE__*/React.createElement("div", {
    className: "sf-prod-img",
    style: {
      background: `linear-gradient(135deg, ${p.img}, ${p.img}99)`
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: p.ic
  }), p.badge && /*#__PURE__*/React.createElement("span", {
    className: "sf-prod-badge"
  }, p.badge)), /*#__PURE__*/React.createElement("div", {
    className: "sf-prod-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sf-prod-name"
  }, p.n), /*#__PURE__*/React.createElement("div", {
    className: "sf-prod-desc"
  }, p.d), /*#__PURE__*/React.createElement("div", {
    className: "sf-prod-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sf-prod-price"
  }, fmt(p.p)), /*#__PURE__*/React.createElement("button", {
    className: "sf-add",
    "aria-label": 'Agregar ' + p.n,
    onClick: () => add(p)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }))))))), /*#__PURE__*/React.createElement("footer", {
    className: "sf-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sf-footer-row"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 El Buen Sabor \xB7 Cra. 15 #80-32, Bogot\xE1 \xB7 NIT 900.123.456-7"), /*#__PURE__*/React.createElement("span", {
    className: "sf-pay"
  }, "Pagos: ", /*#__PURE__*/React.createElement("span", null, "Visa"), /*#__PURE__*/React.createElement("span", null, "Mastercard"), /*#__PURE__*/React.createElement("span", null, "PSE"), /*#__PURE__*/React.createElement("span", null, "Wompi"))))), /*#__PURE__*/React.createElement("div", {
    className: 'sf-cartbar' + (count === 0 ? ' is-hidden' : '')
  }, /*#__PURE__*/React.createElement("span", {
    className: "sf-cartbar-info"
  }, count, " ", count === 1 ? 'producto' : 'productos', " \xB7 ", /*#__PURE__*/React.createElement("b", null, fmt(total))), /*#__PURE__*/React.createElement("button", {
    className: "sf-cartbar-cta"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shopping-bag"
  }), "Ir al checkout")));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/app.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.KpiCard = __ds_scope.KpiCard;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
