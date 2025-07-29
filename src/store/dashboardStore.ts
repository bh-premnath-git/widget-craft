import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';

/* --------------------------------------------------------------------- */
/*  Types                                                                */
/* --------------------------------------------------------------------- */

export type ChartType =
  | 'bar' | 'line' | 'scatter' | 'pie' | 'area'
  | 'histogram' | 'box' | 'heatmap' | 'treemap' | 'funnel';

export const CHART_TYPE_ORDER: ChartType[] = [
  'bar', 'line', 'scatter', 'pie', 'area',
  'histogram', 'box', 'heatmap', 'treemap', 'funnel',
];

export type ColorScheme =
  | 'default' | 'viridis' | 'plasma' | 'inferno' | 'magma'
  | 'blues' | 'greens' | 'reds' | 'rainbow' | 'sinebow'
  | 'turbo' | 'custom';

export const COLOR_SCHEME_ORDER: ColorScheme[] = [
  'default', 'viridis', 'plasma', 'inferno', 'magma',
  'blues', 'greens', 'reds', 'rainbow', 'sinebow', 'turbo',
];

export type WidgetView = 'chart' | 'table' | 'sql' | 'settings';

export interface WidgetLayout {
  x: number; y: number; w: number; h: number;
}

export interface WidgetState {
  id: string;
  /* UI state ----------------------------------------------------------- */
  isFlipped: boolean;
  isMaximized: boolean;

  /* Presentation ------------------------------------------------------- */
  view: WidgetView;
  chartType: ChartType;
  color: { scheme: ColorScheme; customPalette?: string[] };

  isChartTypePickerOpen: boolean;
  isColorSchemePickerOpen: boolean;

  /* Meta --------------------------------------------------------------- */
  lastRefreshed: number;
  layout: WidgetLayout;
}

export interface DashboardState {
  widgets: Record<string, WidgetState>;
  isGridLocked: boolean;
}

/* --------------------------------------------------------------------- */
/*  Initial state helper                                                 */
/* --------------------------------------------------------------------- */

const now = () => Date.now();

const DEFAULT_WIDGET: Omit<WidgetState, 'id'> = {
  isFlipped: false,
  isMaximized: false,
  view: 'chart',
  chartType: 'bar',
  color: { scheme: 'default' },
  isChartTypePickerOpen: false,
  isColorSchemePickerOpen: false,
  lastRefreshed: now(),
  layout: { x: 0, y: 0, w: 4, h: 6 },
};

const initialState: DashboardState = {
  widgets: {},
  isGridLocked: false,
};

const ensure = (s: DashboardState, id: string) => s.widgets[id];

/* --------------------------------------------------------------------- */
/*  Slice                                                                */
/* --------------------------------------------------------------------- */

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    /* CRUD ------------------------------------------------------------- */
    addWidget: (
      s,
      { payload }: PayloadAction<WidgetState | { id: string } & Partial<Omit<WidgetState, 'id'>>>,
    ) => {
      const id = payload.id;
      s.widgets[id] = { ...DEFAULT_WIDGET, ...payload, id };
    },
    removeWidget: (s, { payload }: PayloadAction<string>) => {
      delete s.widgets[payload];
    },

    /* Core toggles ----------------------------------------------------- */
    flipWidget: (s, { payload }: PayloadAction<string>) => {
      const w = ensure(s, payload); if (w) w.isFlipped = !w.isFlipped;
    },
    toggleMaximize: (s, { payload }: PayloadAction<string>) => {
      const w = ensure(s, payload); if (w) w.isMaximized = !w.isMaximized;
    },
    refreshWidget: (s, { payload }: PayloadAction<string>) => {
      const w = ensure(s, payload); if (w) w.lastRefreshed = now();
    },
    updateWidgetLayout: (s, { payload }: PayloadAction<{ id: string; layout: WidgetLayout }>) => {
      const w = ensure(s, payload.id); if (w) w.layout = { ...w.layout, ...payload.layout };
    },

    /* Grid ------------------------------------------------------------- */
    toggleGridLock: (s) => { s.isGridLocked = !s.isGridLocked; },
    setGridLock: (s, { payload }: PayloadAction<boolean>) => { s.isGridLocked = payload; },

    /* View ------------------------------------------------------------- */
    setWidgetView: (s, { payload }: PayloadAction<{ id: string; view: WidgetView }>) => {
      const w = ensure(s, payload.id); if (w) w.view = payload.view;
    },

    /* Chart type ------------------------------------------------------- */
    setChartType: (s, { payload }: PayloadAction<{ id: string; chartType: ChartType }>) => {
      const w = ensure(s, payload.id); if (w) w.chartType = payload.chartType;
    },

    /* Color scheme ----------------------------------------------------- */
    setColorScheme: (s, { payload }: PayloadAction<{ id: string; scheme: ColorScheme; customPalette?: string[] }>) => {
      const w = ensure(s, payload.id); if (!w) return;
      if (payload.scheme === 'custom') {
        w.color = { scheme: 'custom', customPalette: payload.customPalette ?? [] };
      } else {
        w.color = { scheme: payload.scheme };
      }
    },
     toggleChartTypePicker: (s, { payload }: PayloadAction<string>) => {
      const w = ensure(s, payload);
      if (!w) return;
      w.isChartTypePickerOpen = !w.isChartTypePickerOpen;
      if (w.isChartTypePickerOpen) {
        w.isColorSchemePickerOpen = false; // close the other one
        w.isFlipped = false;               // stay on front face
      }
    },
    toggleColorSchemePicker: (s, { payload }: PayloadAction<string>) => {
      const w = ensure(s, payload);
      if (!w) return;
      w.isColorSchemePickerOpen = !w.isColorSchemePickerOpen;
      if (w.isColorSchemePickerOpen) {
        w.isChartTypePickerOpen = false;
        w.isFlipped = false;
      }
    },
  },
});

/* --------------------------------------------------------------------- */
/*  Exports                                                              */
/* --------------------------------------------------------------------- */

export const {
  addWidget,
  removeWidget,
  flipWidget,
  toggleMaximize,
  refreshWidget,
  updateWidgetLayout,
  toggleGridLock,
  setGridLock,
  setWidgetView,
  setChartType,
  setColorScheme,
  toggleChartTypePicker,
  toggleColorSchemePicker,
} = dashboardSlice.actions;

export const store = configureStore({
  reducer: { dashboard: dashboardSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
