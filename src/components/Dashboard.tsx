import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'

interface Widget {
  id: string
  type: 'quick-actions' | 'stats' | 'calendar' | 'tasks' | 'weather' | 'news' | 'analytics'
  title: string
  icon: string
  accentColor: string
  component: React.ComponentType
}

interface SortableWidgetProps {
  widget: Widget
  index: number
}

function SortableWidget({ widget, index }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`transition-all duration-500 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 group ${isDragging ? 'ring-2 ring-blue-400 shadow-2xl scale-105' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl ${widget.accentColor} flex items-center justify-center text-lg shadow-sm`}>
              {widget.icon}
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
              {widget.title}
            </h3>
          </div>
          <button
            {...listeners}
            className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            title="Drag to reorder"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
            </svg>
          </button>
        </div>
        <widget.component />
      </div>
    </div>
  )
}

function QuickActionsWidget() {
  return (
    <div className="space-y-2.5">
      {[
        { icon: '📅', label: 'View Calendar', desc: 'Upcoming meetings', bg: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', ring: 'hover:ring-1 hover:ring-blue-200' },
        { icon: '🎯', label: 'My Tasks', desc: 'Daily task manager', bg: 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', ring: 'hover:ring-1 hover:ring-emerald-200' },
        { icon: '👥', label: 'Team Directory', desc: 'Find team members', bg: 'bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300', ring: 'hover:ring-1 hover:ring-violet-200' },
      ].map((action) => (
        <button key={action.label} className={`w-full text-left p-3 rounded-xl ${action.bg} ${action.ring} transition-all duration-200 flex items-center gap-3`}>
          <span className="text-xl">{action.icon}</span>
          <div>
            <div className={`font-medium text-sm ${action.text}`}>{action.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{action.desc}</div>
          </div>
        </button>
      ))}
    </div>
  )
}

function StatsWidget() {
  const { user } = useAuthStore()
  const [animated, setAnimated] = useState(false)
  useEffect(() => { setTimeout(() => setAnimated(true), 300) }, [])

  const stats = [
    { value: user?.level ?? 0, label: 'Level', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: '⚡' },
    { value: user?.points ?? 0, label: 'Points', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: '✨' },
    { value: user?.badges.length ?? 0, label: 'Badges', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20', icon: '🏆' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center transition-all duration-500 ${animated ? 'scale-100' : 'scale-90'}`}>
          <div className="text-lg mb-1">{stat.icon}</div>
          <div className={`text-2xl font-bold ${stat.color} tabular-nums`}>{stat.value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

function CalendarWidget() {
  const meetings = [
    { time: '9:00 AM', title: 'Team Standup', type: 'meeting', color: 'bg-blue-500', lightBg: 'bg-blue-50 dark:bg-blue-900/20' },
    { time: '2:00 PM', title: 'Project Review', type: 'meeting', color: 'bg-amber-500', lightBg: 'bg-amber-50 dark:bg-amber-900/20' },
    { time: '4:00 PM', title: 'Client Call', type: 'call', color: 'bg-rose-500', lightBg: 'bg-rose-50 dark:bg-rose-900/20' },
  ]

  return (
    <div className="space-y-2.5">
      {meetings.map((meeting, index) => (
        <div key={index} className={`flex items-center gap-3 p-3 rounded-xl ${meeting.lightBg} transition-all duration-200 hover:scale-[1.02]`}>
          <div className={`w-1 h-10 ${meeting.color} rounded-full flex-shrink-0`}></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{meeting.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{meeting.time}</div>
          </div>
          <div className={`w-2 h-2 ${meeting.color} rounded-full flex-shrink-0 animate-pulse`}></div>
        </div>
      ))}
    </div>
  )
}

function TasksWidget() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review code PR #123', completed: false, priority: 'high' },
    { id: 2, title: 'Prepare presentation', completed: true, priority: 'medium' },
    { id: 3, title: 'Update documentation', completed: false, priority: 'low' },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const priorityDot: Record<string, string> = {
    high: 'bg-rose-400',
    medium: 'bg-amber-400',
    low: 'bg-emerald-400',
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => toggleTask(task.id)}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${task.completed ? 'bg-gray-50 dark:bg-gray-700/50 opacity-60' : 'bg-white dark:bg-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-700/50'} border border-gray-100 dark:border-gray-700`}
        >
          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-500'}`}>
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className={`text-sm flex-1 transition-all duration-300 ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
            {task.title}
          </span>
          <div className={`w-2 h-2 rounded-full ${priorityDot[task.priority]} flex-shrink-0`} title={`${task.priority} priority`}></div>
        </div>
      ))}
      <div className="text-xs text-gray-400 dark:text-gray-500 text-center pt-1">
        {tasks.filter(t => t.completed).length}/{tasks.length} completed
      </div>
    </div>
  )
}

function WeatherWidget() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 mb-3">
        <span className="text-3xl">☀️</span>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-0.5">24°C</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">Sunny</div>
      <div className="flex justify-center gap-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
        <span>💧 45%</span>
        <span>🌬️ 12 km/h</span>
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">San Francisco, CA</div>
    </div>
  )
}

function NewsWidget() {
  const news = [
    { title: 'Company Q3 Results Released', time: '2 hours ago', tag: 'Finance', tagColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { title: 'New Office Opening in Tokyo', time: '1 day ago', tag: 'Company', tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { title: 'Team Building Event Next Week', time: '2 days ago', tag: 'Events', tagColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  ]

  return (
    <div className="space-y-3">
      {news.map((item, index) => (
        <div key={index} className="group flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
          <div className="w-1 h-full min-h-[40px] bg-gradient-to-b from-blue-500 to-violet-500 rounded-full flex-shrink-0 mt-0.5"></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${item.tagColor}`}>{item.tag}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{item.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AnalyticsWidget() {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { setTimeout(() => setAnimated(true), 500) }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">Productivity</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">+5%</span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: animated ? '75%' : '0%' }}
        ></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">12</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tasks Done</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">6h</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Focus Time</div>
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'stats', type: 'stats', title: 'Your Stats', icon: '📊', accentColor: 'bg-blue-100 dark:bg-blue-900/30', component: StatsWidget },
    { id: 'calendar', type: 'calendar', title: "Today's Schedule", icon: '📅', accentColor: 'bg-amber-100 dark:bg-amber-900/30', component: CalendarWidget },
    { id: 'tasks', type: 'tasks', title: 'My Tasks', icon: '✅', accentColor: 'bg-emerald-100 dark:bg-emerald-900/30', component: TasksWidget },
    { id: 'quick-actions', type: 'quick-actions', title: 'Quick Actions', icon: '⚡', accentColor: 'bg-violet-100 dark:bg-violet-900/30', component: QuickActionsWidget },
    { id: 'weather', type: 'weather', title: 'Weather', icon: '🌤️', accentColor: 'bg-orange-100 dark:bg-orange-900/30', component: WeatherWidget },
    { id: 'news', type: 'news', title: 'Company News', icon: '📰', accentColor: 'bg-rose-100 dark:bg-rose-900/30', component: NewsWidget },
    { id: 'analytics', type: 'analytics', title: 'Analytics', icon: '📈', accentColor: 'bg-cyan-100 dark:bg-cyan-900/30', component: AnalyticsWidget },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Your daily overview at a glance</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          Drag to reorder
        </div>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {widgets.map((widget, index) => (
              <div key={widget.id} data-widget={widget.id}>
                <SortableWidget widget={widget} index={index} />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
