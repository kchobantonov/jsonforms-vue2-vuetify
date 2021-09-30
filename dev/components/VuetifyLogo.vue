<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 87.5 100"
    role="presentation"
    @click="$emit('click')"
  >
    <title>Vuetify logo</title>
    <polyline :fill="color1" points="43.75 0 23.31 0 43.75 48.32" />
    <polygon
      :fill="color2"
      points="43.75 62.5 43.75 100 0 14.58 22.92 14.58 43.75 62.5"
    />
    <polyline :fill="color3" points="43.75 0 64.19 0 43.75 48.32" />
    <polygon
      :fill="color4"
      points="64.58 14.58 87.5 14.58 43.75 100 43.75 62.5 64.58 14.58"
    />
  </svg>
</template>

<script lang="ts">
type HSL = { h: number; s: number; l: number };
type RGB = { r: number; g: number; b: number };

const adjustLightnessBy = (hsl: HSL, amount: number): HSL => {
  return { h: hsl.h, s: hsl.s, l: hsl.l + amount / 100 };
};

const rgbToHsl = (rgb: RGB): HSL => {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    l: l,
  };
};

const toHSL = (color: string): HSL => {
  const base = color.startsWith('#') ? 1 : 0;

  let r = parseInt(color.substring(base, 3), 16);
  let g = parseInt(color.substring(base + 2, 5), 16);
  let b = parseInt(color.substring(base + 4, 7), 16);

  return rgbToHsl({ r, g, b });
};

const toHSLString = (hsl: HSL): string => {
  return `hsl(${hsl.h * 360},${hsl.s * 100}%,${hsl.l * 100}%)`;
};

export default {
  name: 'JsonFormsIcon',
  props: {
    width: {
      type: [Number, String],
      default: 64,
    },
    height: {
      type: [Number, String],
      default: 64,
    },
    iconColor: {
      type: String,
      default: '#1697f6',
    },
  },
  computed: {
    hsl(): { h: number; s: number; l: number } {
      return toHSL(this.iconColor);
    },
    color1(): string {
      return toHSLString(this.hsl);
    },
    color2(): string {
      return toHSLString(adjustLightnessBy(this.hsl, 22));
    },
    color3(): string {
      return toHSLString(adjustLightnessBy(this.hsl, -10));
    },
    color4(): string {
      return toHSLString(adjustLightnessBy(this.hsl, 32));
    },
  },
};
</script>
