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
import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'

interface Widget {
  id: string
  type: 'quick-actions' | 'stats' | 'calendar' | 'tasks' | 'weather' | 'news' | 'analytics'
  title: string
  component: React.ComponentType
}

interface SortableWidgetProps {
  widget: Widget
}

function SortableWidget({ widget }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {widget.title}
          </h3>
          <button
            {...listeners}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
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
    <div className="space-y-3">
      <button className="w-full text-left p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
        <div className="font-medium text-blue-900 dark:text-blue-300">📅 View Calendar</div>
        <div className="text-sm text-blue-700 dark:text-blue-400">Check your upcoming meetings</div>
      </button>
      <button className="w-full text-left p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
        <div className="font-medium text-green-900 dark:text-green-300">🎯 My Tasks</div>
        <div className="text-sm text-green-700 dark:text-green-400">Manage your daily tasks</div>
      </button>
      <button className="w-full text-left p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
        <div className="font-medium text-purple-900 dark:text-purple-300">👥 Team Directory</div>
        <div className="text-sm text-purple-700 dark:text-purple-400">Find team members</div>
      </button>
    </div>
  )
}

function StatsWidget() {
  const { user } = useAuthStore()
  
  return (
    <div className="text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your Stats</p>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user?.level}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Level</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{user?.points}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Points</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{user?.badges.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Badges</p>
        </div>
      </div>
    </div>
  )
}

function CalendarWidget() {
  const meetings = [
    { time: '9:00 AM', title: 'Team Standup', type: 'meeting' },
    { time: '2:00 PM', title: 'Project Review', type: 'meeting' },
    { time: '4:00 PM', title: 'Client Call', type: 'call' },
  ]

  return (
    <div className="space-y-3">
      {meetings.map((meeting, index) => (
        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{meeting.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{meeting.time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TasksWidget() {
  const tasks = [
    { id: 1, title: 'Review code PR #123', completed: false },
    { id: 2, title: 'Prepare presentation', completed: true },
    { id: 3, title: 'Update documentation', completed: false },
  ]

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={task.completed}
            className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
            readOnly
          />
          <span className={`text-sm ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {task.title}
          </span>
        </div>
      ))}
    </div>
  )
}

function WeatherWidget() {
  return (
    <div className="text-center">
      <div className="text-4xl mb-2">☀️</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">24°C</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">Sunny</div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">San Francisco, CA</div>
    </div>
  )
}

function NewsWidget() {
  const news = [
    { title: 'Company Q3 Results Released', time: '2 hours ago' },
    { title: 'New Office Opening in Tokyo', time: '1 day ago' },
    { title: 'Team Building Event Next Week', time: '2 days ago' },
  ]

  return (
    <div className="space-y-3">
      {news.map((item, index) => (
        <div key={index} className="border-l-2 border-blue-500 pl-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{item.time}</div>
        </div>
      ))}
    </div>
  )
}

function AnalyticsWidget() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">Productivity</span>
        <span className="text-sm font-medium text-green-600 dark:text-green-400">+5%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">12</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tasks Done</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">6h</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Focus Time</div>
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'stats', type: 'stats', title: 'Your Stats', component: StatsWidget },
    { id: 'calendar', type: 'calendar', title: 'Today\'s Schedule', component: CalendarWidget },
    { id: 'tasks', type: 'tasks', title: 'My Tasks', component: TasksWidget },
    { id: 'quick-actions', type: 'quick-actions', title: 'Quick Actions', component: QuickActionsWidget },
    { id: 'weather', type: 'weather', title: 'Weather', component: WeatherWidget },
    { id: 'news', type: 'news', title: 'Company News', component: NewsWidget },
    { id: 'analytics', type: 'analytics', title: 'Analytics', component: AnalyticsWidget },
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Drag widgets to reorder</p>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {widgets.map((widget) => (
              <div key={widget.id} data-widget={widget.id}>
                <SortableWidget widget={widget} />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}