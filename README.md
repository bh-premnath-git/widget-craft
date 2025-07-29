Project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

📦 Dashboards (Composite Pattern) All widgets participate as child components in a unified dashboard
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
│   ├── WidgetHeader additional (Command pattern: Vertical dot menu triggers encapsulated actions (e.g., download as pdf download as jpeg, change chart type, choose color scheme))
│   └── WidgetBody (Strategy Pattern: flip determines view)  
│       ├── FrontFace:
│       │    └── 📊 Plotly.js Chart Only (data from React Query) Different rendering strategy for choosen chart types qand color scheme (startegy pattern)
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

Vertical Dots (⋮)
Dropdown Menu:

📥 Download as PDF

🖼️ Download as JPEG

📊 Change Chart Type

🎨 Change Color Scheme

✅ Project Tech Stack
Vite

TypeScript

React

Tailwind CSS

shadcn-ui

Redux Toolkit

react-grid-layout

React Query

Plotly.js

🧠 Architecture Overview (Design Pattern Focused)
sql
Copy
Edit
📦 Dashboards (Composite Pattern)
│
├── 🧩 useDashboardStore / Redux Toolkit (Global State)
│   ├── Supports multiple dashboards
│   └── Per-dashboard state:
│       ├── widgets[]: List of widget configs
│       ├── layout[]: Layout positions/sizes (from react-grid-layout)
│       ├── metadata:
│       │    ├── dashboardName
│       │    └── timestamps (createdAt, updatedAt)
│
├── 🧱 GridLayout (react-grid-layout)
│   └── Enables drag and resize for each widget
│   └── Persists layout positions & sizes via Redux
│
├── 🏭 WidgetFactory (Factory Pattern)
│   ├── ChartWidget
│   ├── TableWidget
│   └── SqlViewer
│   └── Factory behavior: Dynamically renders based on widget `type`
│
├── 📦 WidgetWrapper
│   ├── WidgetHeader (Command Pattern)
│   │   ├── 🔄 Refresh
│   │   ├── ⬆️ Maximize
│   │   ├── 🔁 Flip
│   │   └── ⋮ Vertical Dot Menu (extra commands)
│   │        ├── 📥 Download as PDF
│   │        ├── 🖼️ Download as JPEG
│   │        ├── 📊 Change Chart Type (e.g., bar, line, pie)
│   │        └── 🎨 Change Color Scheme
│   └── WidgetBody (Strategy Pattern)
│       ├── FrontFace
│       │    └── 📊 ChartView using Plotly.js
│       │        ├── chartType: default `"bar"`, customizable per widget
│       │        └── colorScheme: default `"light"`, customizable per widget
│       └── BackFace
│            └── Tabs:
│                ├── 📋 TableView (from React Query)
│                └── 🧾 SQL Viewer (shows raw query string)
🗂️ Multi-Dashboard Support
You support multiple dashboards, each with:

ts
Copy
Edit
type Dashboard = {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  layout: Layout[]; // react-grid-layout layout
  createdAt: number;
  updatedAt: number;
};
Each dashboard can be selected from a sidebar/menu and maintains independent state and layout.

🧾 WidgetConfig Schema
ts
Copy
Edit
type WidgetConfig = {
  id: string;
  type: "chart" | "table" | "sql";
  title: string;
  data: {
    plotlyData?: any[];
    plotlyLayout?: any;
    tableData?: { columns: string[]; rows: any[][] };
    query: string;
  };
  chartType?: "bar" | "line" | "pie"; // default: "bar"
  colorScheme?: string;               // default: "light"
  isFlipped?: boolean;
  isMaximized?: boolean;
  lastRefreshed?: number;
};
🔄 Refresh Flow (Command Pattern)
User clicks 🔄 Refresh

Dispatch refreshWidget(widgetId)

lastRefreshed is updated in Redux

useQuery observes this and triggers a new fetch

🧠 Design Pattern Summary
Pattern	Location	Description
Composite	Dashboards → Widgets → Children	Nested UI structure managed as tree
Factory	WidgetFactory	Dynamically renders widget types
Command	WidgetHeader buttons + menu	Encapsulated actions dispatched to Redux
Strategy	WidgetBody + chartType/color	Switch rendering behavior dynamically

🧩 UI Features Recap
Resizable, draggable widgets (with saved layout)

Multiple dashboards each with saved widget layout

Chart widget with:

Default chart type: "bar" (can be changed per widget)

Default color scheme: "light" (can be customized)

Flip to alternate views (chart → table + SQL)

Command menu for:

Downloading (PDF, JPEG)

Changing chart type and theme