import {
  COLOR_SCHEME_ORDER,
  ColorScheme,
} from '@/store/dashboardStore';
import { Button } from '@/components/ui/button';

interface ColorSchemeViewerProps {
  selected: ColorScheme;
  onChange: (scheme: ColorScheme, customPalette?: string[]) => void;
}

export const ColorSchemeViewer = ({
  selected,
  onChange,
}: ColorSchemeViewerProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {COLOR_SCHEME_ORDER.map((scheme) => (
        <Button
          key={scheme}
          variant={scheme === selected ? 'default' : 'outline'}
          className="text-xs capitalize"
          onClick={() => onChange(scheme)}
        >
          {scheme}
        </Button>
      ))}

      {/* Custom palette stub */}
      <div className="col-span-full mt-4 text-xs text-muted-foreground">
        {selected === 'custom' && (
          <p>
            Implement your custom‑palette picker here and pass the palette to
            <code>onChange('custom', paletteArray)</code>.
          </p>
        )}
      </div>
    </div>
  );
};
