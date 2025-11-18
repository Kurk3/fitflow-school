import { useState } from 'react'
import { X, Trophy, Calendar, BarChart3, Star, TrendingUp, Target, Flame, Dumbbell } from 'lucide-react'
import XPBar from './XPBar'
import LevelCircle from './LevelCircle'
import AchievementCard from './AchievementCard'
import WorkoutCalendar from './WorkoutCalendar'
import { mockUserProgress, mockAchievements, mockStats } from '../../data/mockProgress'
import { useWorkout } from '../../context/WorkoutContext'

function ProfilePanel({ onClose }) {
  const [activeTab, setActiveTab] = useState('overview')
  const { getWorkoutCalendarData } = useWorkout()

  const tabs = [
    { id: 'overview', label: 'Prehľad', icon: Star },
    { id: 'achievements', label: 'Achievementy', icon: Trophy },
    { id: 'calendar', label: 'Kalendár', icon: Calendar },
    { id: 'stats', label: 'Štatistiky', icon: BarChart3 },
  ]

  // Filter achievements by category for organized display
  const achievementsByCategory = {
    workouts: mockAchievements.filter((a) => a.category === 'workouts'),
    streaks: mockAchievements.filter((a) => a.category === 'streaks'),
    variety: mockAchievements.filter((a) => a.category === 'variety'),
    strength: mockAchievements.filter((a) => a.category === 'strength'),
    special: mockAchievements.filter((a) => a.category === 'special'),
    progression: mockAchievements.filter((a) => a.category === 'progression'),
  }

  return (
    <div className="h-full bg-gray-900 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          {/* User info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
              💪
            </div>
            <div>
              <h2 className="text-2xl font-bold">Tvoj Pokrok</h2>
              <p className="text-gray-200 text-sm">Člen od September 2024</p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Zavrieť"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Level and XP */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <XPBar
            currentXP={mockUserProgress.currentXP}
            maxXP={mockUserProgress.xpToNextLevel}
            level={mockUserProgress.level}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 bg-gray-800 px-4 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-900'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Level Circle */}
            <div className="flex justify-center py-4">
              <LevelCircle
                level={mockUserProgress.level}
                currentXP={mockUserProgress.currentXP}
                maxXP={mockUserProgress.xpToNextLevel}
              />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 p-4 rounded-xl border border-blue-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="w-5 h-5 text-blue-400" />
                  <div className="text-sm text-gray-400">Workouty</div>
                </div>
                <div className="text-3xl font-bold text-blue-300">
                  {mockUserProgress.totalWorkouts}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 p-4 rounded-xl border border-orange-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <div className="text-sm text-gray-400">Streak</div>
                </div>
                <div className="text-3xl font-bold text-orange-300">
                  {mockUserProgress.currentStreak} 🔥
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 p-4 rounded-xl border border-purple-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <div className="text-sm text-gray-400">Achievementy</div>
                </div>
                <div className="text-3xl font-bold text-purple-300">
                  {mockUserProgress.unlockedAchievements}/{mockUserProgress.totalAchievements}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 p-4 rounded-xl border border-green-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <div className="text-sm text-gray-400">Naj Streak</div>
                </div>
                <div className="text-3xl font-bold text-green-300">
                  {mockUserProgress.longestStreak}
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Posledné Achievementy
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {mockAchievements
                  .filter((a) => a.unlocked)
                  .slice(-4)
                  .map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
              </div>
            </div>

            {/* Progress Insights */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-4 rounded-xl border border-gray-600">
              <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Tvoje Ciele
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Beast Mode (50 workoutov)</span>
                    <span className="font-semibold text-gray-200">87%</span>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-[87%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Mesačný Bojovník (30 dní streak)</span>
                    <span className="font-semibold text-gray-200">50%</span>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 w-[50%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 p-4 rounded-xl border border-purple-600/30">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-200">Celkový Pokrok</h3>
                <span className="text-2xl font-bold text-purple-300">
                  {mockUserProgress.unlockedAchievements}/{mockUserProgress.totalAchievements}
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                  style={{
                    width: `${(mockUserProgress.unlockedAchievements / mockUserProgress.totalAchievements) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Achievements by category */}
            {Object.entries(achievementsByCategory).map(([category, achievements]) => {
              const categoryTitles = {
                workouts: '🏋️ Workout Milestones',
                streaks: '🔥 Streak Achievementy',
                variety: '🌈 Rozmanitosť',
                strength: '💪 Sila & Objem',
                special: '⭐ Špeciálne',
                progression: '📈 Progresívny Tréning',
              }

              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">
                    {categoryTitles[category]}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {achievements.map((achievement) => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div>
            <WorkoutCalendar workoutData={getWorkoutCalendarData()} />
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 p-4 rounded-xl border border-blue-600/30">
                <div className="text-sm text-gray-400 mb-1">Celkový Objem</div>
                <div className="text-3xl font-bold text-blue-300">
                  {mockStats.totalVolume.toLocaleString()} kg
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 p-4 rounded-xl border border-green-600/30">
                <div className="text-sm text-gray-400 mb-1">Priemerný Workout</div>
                <div className="text-3xl font-bold text-green-300">
                  {mockStats.averageDuration} min
                </div>
              </div>
            </div>

            {/* Most Trained Muscle */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <h3 className="font-semibold text-gray-200 mb-3">Najtrénovanejší Sval</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg text-gray-300">{mockStats.mostTrainedMuscle.name}</span>
                <span className="text-2xl font-bold text-blue-400">
                  {mockStats.mostTrainedMuscle.count}x
                </span>
              </div>
            </div>

            {/* Muscle Distribution */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <h3 className="font-semibold text-gray-200 mb-3">Rozloženie Tréningov</h3>
              <div className="space-y-2">
                {Object.entries(mockStats.muscleDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([muscle, count]) => {
                    const max = Math.max(...Object.values(mockStats.muscleDistribution))
                    const percentage = (count / max) * 100
                    return (
                      <div key={muscle}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{muscle}</span>
                          <span className="font-semibold text-gray-200">{count}x</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Favorite Exercise */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 p-4 rounded-xl border border-purple-600/30">
              <div className="text-sm text-gray-400 mb-1">Obľúbený Cvik</div>
              <div className="text-xl font-bold text-purple-300">
                {mockStats.favoriteExercise.name}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Vykonaný {mockStats.favoriteExercise.count}x
              </div>
            </div>

            {/* Best Day */}
            <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 p-4 rounded-xl border border-orange-600/30">
              <div className="text-sm text-gray-400 mb-1">Najlepší Deň</div>
              <div className="text-xl font-bold text-orange-300">
                {mockStats.bestDayOfWeek.day}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {mockStats.bestDayOfWeek.count} workoutov
              </div>
            </div>

            {/* Mode Distribution */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <h3 className="font-semibold text-gray-200 mb-3">Tréningové Módy</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">💪 Bodybuilding</span>
                  <span className="font-semibold text-gray-200">
                    {mockStats.modeDistribution.bodybuilding}x
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">🏃 Calisthenics</span>
                  <span className="font-semibold text-gray-200">
                    {mockStats.modeDistribution.calisthenics}x
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">🧘 Pilates</span>
                  <span className="font-semibold text-gray-200">
                    {mockStats.modeDistribution.pilates}x
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePanel
