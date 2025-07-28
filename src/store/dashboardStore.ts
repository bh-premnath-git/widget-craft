import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';

export interface WidgetState {
  id: string;
  isFlipped: boolean;
  isMaximized: boolean;
  lastRefreshed: number;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface DashboardState {
  widgets: Record<string, WidgetState>;
  isGridLocked: boolean;
}

const initialState: DashboardState = {
  widgets: {
    'chart-widget-1': {
      id: 'chart-widget-1',
      isFlipped: false,
      isMaximized: false,
      lastRefreshed: Date.now(),
      layout: { x: 0, y: 0, w: 6, h: 4 }
    },
    'chart-widget-2': {
      id: 'chart-widget-2',
      isFlipped: false,
      isMaximized: false,
      lastRefreshed: Date.now(),
      layout: { x: 6, y: 0, w: 6, h: 4 }
    },
    'table-widget-1': {
      id: 'table-widget-1',
      isFlipped: false,
      isMaximized: false,
      lastRefreshed: Date.now(),
      layout: { x: 0, y: 4, w: 12, h: 6 }
    }
  },
  isGridLocked: false
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    flipWidget: (state, action: PayloadAction<string>) => {
      const widgetId = action.payload;
      if (state.widgets[widgetId]) {
        const newFlippedState = !state.widgets[widgetId].isFlipped;
        state.widgets[widgetId].isFlipped = newFlippedState;
        console.log(`[Redux] Widget ${widgetId} flipped state changed to: ${newFlippedState}`);
      } else {
        console.error(`[Redux] Widget ${widgetId} not found in state`);
      }
    },
    maximizeWidget: (state, action: PayloadAction<string>) => {
      const widgetId = action.payload;
      if (state.widgets[widgetId]) {
        state.widgets[widgetId].isMaximized = !state.widgets[widgetId].isMaximized;
      }
    },
    refreshWidget: (state, action: PayloadAction<string>) => {
      const widgetId = action.payload;
      if (state.widgets[widgetId]) {
        state.widgets[widgetId].lastRefreshed = Date.now();
      }
    },
    updateWidgetLayout: (state, action: PayloadAction<{ id: string; layout: WidgetState['layout'] }>) => {
      const { id, layout } = action.payload;
      if (state.widgets[id]) {
        state.widgets[id].layout = layout;
      }
    },
    toggleGridLock: (state) => {
      state.isGridLocked = !state.isGridLocked;
    },
    addWidget: (state, action: PayloadAction<WidgetState>) => {
      const widget = action.payload;
      state.widgets[widget.id] = widget;
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      delete state.widgets[action.payload];
    }
  }
});

export const {
  flipWidget,
  maximizeWidget,
  refreshWidget,
  updateWidgetLayout,
  toggleGridLock,
  addWidget,
  removeWidget
} = dashboardSlice.actions;

export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;