Project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

📦 Dashboards (Composite Pattern)
│
├── 🧩 useDashboardStore / Redux Toolkit (Global State)
│   └── Manages flip, maximize, refresh state per widget
│
├── 🧱 GridLayout (react-grid-layout)
│   └── Drag & Resize widgets
│
├── 🏭 WidgetFactory (Factory Pattern)
│   ├── ChartWidget
│   ├── TableWidget
│   └── SqlViewer
│
├── 📦 WidgetWrapper
│   ├── WidgetHeader (Command Pattern: Expand ⬆️, Refresh 🔄, Flip 🔁)
│   └── WidgetBody (Strategy Pattern: flip determines view)
│       ├── FrontFace:
│       │    └── 📊 Plotly.js Chart Only (data from React Query)
│       └── BackFace:
│            └── Tabs:
│                ├── 📋 TableView (data from React Query)
│                └── 🧾 SQL Viewer (same query string)

not real data just sample example 
{
  "plotlyData": [...],        // For chart
  "plotlyLayout": {...},      // Optional: dynamic layout config
  "tableData": {
    "columns": [],
    "rows": [[], []]
  },
  "query": "SELECT name, sales, profit FROM sales_summary"
}

You click the 🔄 Refresh button on a widget.

It dispatches refreshWidget(widgetId) to:

Update a lastRefreshed: number field in Redux state.

The useQuery hook in the widget observes lastRefreshed and triggers a new API call.

Factory Pattern
While not explicitly a standalone Factory class, your widget system does follow a factory-like approach where different widget types (Chart, Table, SQL) are created and configured based on data/props. The pattern is represented in how 
WidgetWrapper
 dynamically renders different content views based on widget type.

Command Pattern
Yes, the WidgetHeader buttons implement a simplified Command Pattern:

Each button encapsulates a specific action (flip, maximize, refresh)
The actions are decoupled from their execution via Redux dispatch
Each button handler follows the same pattern: prevent event propagation, dispatch action
The receiver (widget component) doesn't need to know the details of the command
Strategy Pattern
This is accurately implemented in your flip mechanism:

The rendering strategy changes based on the isFlipped state
Front face and back face are two different rendering strategies
The container (WidgetWrapper) switches between these strategies
Each strategy (face) has its own rendering approach but shares the same interface
Your implementation is a bit more React-oriented than classical OOP patterns, but they follow the core principles:

Factory: Component creation based on type
Command: Actions encapsulated in handlers
Strategy: Interchangeable rendering approaches