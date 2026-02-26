import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  TextInput,
  Typography,
} from "@/design-system/ui";
import {
  DESIGN_SYSTEM_COLORS,
  DESIGN_SYSTEM_SPACING,
  type ColorFamily,
  type SpacingToken,
} from "@/design-system/ui/atoms";

const COLOR_FAMILIES = Object.entries(DESIGN_SYSTEM_COLORS) as Array<
  [ColorFamily, Record<string, string>]
>;

const SPACING_TOKENS = Object.entries(DESIGN_SYSTEM_SPACING) as Array<
  [SpacingToken, string]
>;

const BUTTON_VARIANTS = ["primary", "secondary", "outline", "ghost"] as const;
const BUTTON_SIZES = ["sm", "md", "lg"] as const;

const TYPOGRAPHY_VARIANTS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "body",
  "caption",
  "overline",
] as const;

export default function DesignSystemScreen() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-md md:px-lg py-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Typography variant="h3">🎨 Design System</Typography>
          <Link
            to="/"
            className="text-sm text-primary-600 hover:text-primary-700 underline"
          >
            ← Back to Workflow
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-md md:px-lg lg:px-xl py-lg md:py-xl space-y-xl md:space-y-2xl">
        <ColorPaletteSection />
        <SpacingSection />
        <TypographySection />
        <ButtonSection />
        <TextInputSection />
      </main>
    </div>
  );
}

function SectionWrapper({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <Typography variant="h2" className="mb-md border-b border-neutral-200 pb-sm">
        {title}
      </Typography>
      {children}
    </section>
  );
}

function ColorPaletteSection() {
  return (
    <SectionWrapper title="🎨 Color Palette">
      <div className="space-y-lg">
        {COLOR_FAMILIES.map(([familyName, shades]) => (
          <div key={familyName}>
            <Typography variant="h4" className="mb-sm capitalize">
              {familyName}
            </Typography>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-sm">
              {Object.entries(shades).map(([shade, hex]) => (
                <div key={shade} className="text-center">
                  <div
                    className="w-full aspect-square rounded-lg shadow-sm border border-neutral-200"
                    style={{ backgroundColor: hex }}
                  />
                  <Typography variant="caption" className="mt-xs block">
                    {shade}
                  </Typography>
                  <Typography variant="caption" className="block text-neutral-400">
                    {hex}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function SpacingSection() {
  return (
    <SectionWrapper title="📏 Spacing Scale">
      <div className="space-y-sm">
        {SPACING_TOKENS.map(([token, value]) => (
          <div key={token} className="flex items-center gap-md">
            <Typography variant="caption" className="w-16 text-right font-mono">
              {token}
            </Typography>
            <div
              className="h-6 bg-primary-400 rounded-sm"
              style={{ width: value }}
            />
            <Typography variant="caption" className="text-neutral-400 font-mono">
              {value}
            </Typography>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function TypographySection() {
  return (
    <SectionWrapper title="🔤 Typography">
      <div className="space-y-md bg-white p-md md:p-lg rounded-xl border border-neutral-200">
        {TYPOGRAPHY_VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col sm:flex-row sm:items-baseline gap-sm">
            <Typography variant="caption" className="w-20 font-mono shrink-0">
              {variant}
            </Typography>
            <Typography variant={variant}>
              The quick brown fox jumps over the lazy dog
            </Typography>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function ButtonSection() {
  return (
    <SectionWrapper title="🔘 Buttons">
      <div className="space-y-lg">
        {BUTTON_VARIANTS.map((variant) => (
          <div key={variant}>
            <Typography variant="overline" className="mb-sm block">
              {variant}
            </Typography>
            <div className="flex flex-wrap items-center gap-sm">
              {BUTTON_SIZES.map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {size.toUpperCase()} Button
                </Button>
              ))}
              <Button variant={variant} disabled>
                Disabled
              </Button>
              <Button variant={variant} loading>
                Loading
              </Button>
            </div>
          </div>
        ))}

        <div>
          <Typography variant="overline" className="mb-sm block">
            Full Width
          </Typography>
          <Button variant="primary" fullWidth>
            Full Width Primary
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

function TextInputSection() {
  return (
    <SectionWrapper title="📝 Text Inputs">
      <div className="space-y-lg bg-white p-md md:p-lg rounded-xl border border-neutral-200">
        <div>
          <Typography variant="overline" className="mb-sm block">
            Sizes
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {BUTTON_SIZES.map((size) => (
              <TextInput
                key={size}
                label={`${size.toUpperCase()} Input`}
                placeholder={`Size ${size}`}
                inputSize={size}
                fullWidth
              />
            ))}
          </div>
        </div>

        <div>
          <Typography variant="overline" className="mb-sm block">
            States
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <TextInput
              label="Default"
              placeholder="Type something..."
              fullWidth
            />
            <TextInput
              label="With Error"
              placeholder="Invalid input"
              error="This field is required"
              fullWidth
            />
            <TextInput
              label="Disabled"
              placeholder="Cannot edit"
              disabled
              fullWidth
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
