/**
 * Brand package validation test.
 * Verifies all required assets and tokens are present per OEP-48.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const required = {
  logos: ['logo.svg', 'logo.png', 'logo-trademark.svg', 'logo-trademark.png',
    'logo-white.svg', 'logo-white.png'],
  web: ['favicon.ico'],
  paragon: ['paragon/_variables.scss', 'paragon/_overrides.scss', 'paragon/_fonts.scss'],
};

describe('Brand package validation', () => {
  describe('Logo assets', () => {
    required.logos.forEach((file) => {
      test(`${file} exists`, () => {
        const p = path.join(ROOT, file);
        expect(fs.existsSync(p)).toBe(true);
        const stat = fs.statSync(p);
        expect(stat.size).toBeGreaterThan(100);
      });
    });
  });

  describe('Web assets', () => {
    test('favicon.ico exists', () => {
      expect(fs.existsSync(path.join(ROOT, 'favicon.ico'))).toBe(true);
    });
  });

  describe('Paragon SCSS', () => {
    test('_variables.scss defines brand colors', () => {
      const content = fs.readFileSync(path.join(ROOT, 'paragon/_variables.scss'), 'utf8');
      expect(content).toContain('$primary');
      expect(content).toContain('#1B8354');
      expect(content).toContain('$font-family-sans-serif');
      expect(content).toContain('IBM Plex Sans Arabic');
    });

    test('_overrides.scss defines CSS custom properties for Paragon 23+', () => {
      const content = fs.readFileSync(path.join(ROOT, 'paragon/_overrides.scss'), 'utf8');
      expect(content).toContain(':root');
      expect(content).toContain('--pgn-color-brand-base');
      expect(content).toContain('--pgn-color-primary-base');
      expect(content).toContain('--pgn-typography-font-family-base');
    });

    test('_overrides.scss includes dark theme support', () => {
      const content = fs.readFileSync(path.join(ROOT, 'paragon/_overrides.scss'), 'utf8');
      expect(content).toContain('indigo-dark-theme');
    });

    test('_fonts.scss imports Google Fonts', () => {
      const content = fs.readFileSync(path.join(ROOT, 'paragon/_fonts.scss'), 'utf8');
      expect(content).toContain('fonts.googleapis.com');
      expect(content).toContain('IBM+Plex+Sans+Arabic');
    });
  });
});
