'use client'

import { useState, useEffect } from 'react'
import { UserPreferences, FormingMethod, FiringType, FORMING_METHOD_LABELS, FIRING_TYPE_LABELS } from '@/types'
import { getPreferences, savePreferences } from '@/lib/store'
import { SurfaceLayerEditor } from '@/components/SurfaceLayerEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react'

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [saved, setSaved] = useState(false)
  const [newStageName, setNewStageName] = useState('')

  useEffect(() => {
    setPrefs(getPreferences())
  }, [])

  if (!prefs) return null

  function update<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    setPrefs((prev) => prev ? { ...prev, [key]: value } : prev)
    setSaved(false)
  }

  function handleSave() {
    if (!prefs) return
    savePreferences(prefs)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Preferences</h1>
        <p className="text-sm text-stone-500 mt-1">
          Set your studio defaults — these pre-fill when you create a new piece.
        </p>
      </div>

      <section className="space-y-4 bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-base font-semibold text-stone-800">Default Piece Settings</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Default Clay Body</Label>
            <Input
              value={prefs.default_clay_body || ''}
              onChange={(e) => update('default_clay_body', e.target.value || undefined)}
              placeholder="e.g. B-Mix, Speckled Buff"
            />
          </div>

          <div className="space-y-2">
            <Label>Default Forming Method</Label>
            <Select
              value={prefs.default_forming_method || ''}
              onValueChange={(v) => update('default_forming_method', v as FormingMethod || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {Object.entries(FORMING_METHOD_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Default Firing Type</Label>
            <Select
              value={prefs.default_firing_type || ''}
              onValueChange={(v) => update('default_firing_type', v as FiringType || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {Object.entries(FIRING_TYPE_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Default Cone</Label>
            <Input
              value={prefs.default_cone || ''}
              onChange={(e) => update('default_cone', e.target.value || undefined)}
              placeholder="e.g. ^6, ^10"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 bg-white rounded-xl border border-stone-200 p-6">
        <div>
          <h2 className="text-base font-semibold text-stone-800">Default Surface Layers</h2>
          <p className="text-xs text-stone-500 mt-1">
            These layers will be pre-added to every new piece. Great if you always start with a base coat.
          </p>
        </div>
        <SurfaceLayerEditor
          layers={prefs.default_surface_layers}
          onChange={(layers) => update('default_surface_layers', layers)}
        />
      </section>

      <section className="space-y-4 bg-white rounded-xl border border-stone-200 p-6">
        <div>
          <h2 className="text-base font-semibold text-stone-800">Stages</h2>
          <p className="text-xs text-stone-500 mt-1">
            Define the ordered workflow stages for your pieces. The first stage is used when no default is set.
          </p>
        </div>

        <div className="space-y-1">
          {prefs.stages.map((stage, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2"
            >
              <span className="flex-1 text-sm text-stone-800">{stage}</span>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => {
                    const next = [...prefs.stages]
                    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
                    update('stages', next)
                  }}
                  className="p-1 rounded hover:bg-stone-200 disabled:opacity-20 disabled:cursor-not-allowed"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-3.5 w-3.5 text-stone-500" />
                </button>
                <button
                  type="button"
                  disabled={idx === prefs.stages.length - 1}
                  onClick={() => {
                    const next = [...prefs.stages]
                    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
                    update('stages', next)
                  }}
                  className="p-1 rounded hover:bg-stone-200 disabled:opacity-20 disabled:cursor-not-allowed"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-3.5 w-3.5 text-stone-500" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = prefs.stages.filter((_, i) => i !== idx)
                    update('stages', next)
                    if (prefs.default_stage === stage) {
                      update('default_stage', next[0] ?? '')
                    }
                  }}
                  className="p-1 rounded hover:bg-red-100 text-stone-400 hover:text-red-500"
                  aria-label="Remove stage"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {prefs.stages.length === 0 && (
            <p className="text-sm text-stone-400 italic py-2">No stages defined. Add at least one.</p>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={newStageName}
            onChange={(e) => setNewStageName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const name = newStageName.trim()
                if (name && !prefs.stages.includes(name)) {
                  update('stages', [...prefs.stages, name])
                  setNewStageName('')
                }
              }
            }}
            placeholder="New stage name..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const name = newStageName.trim()
              if (name && !prefs.stages.includes(name)) {
                update('stages', [...prefs.stages, name])
                setNewStageName('')
              }
            }}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="space-y-2 pt-2 border-t border-stone-100">
          <Label>Default Stage for New Pieces</Label>
          <Select
            value={prefs.default_stage}
            onValueChange={(v) => update('default_stage', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a stage..." />
            </SelectTrigger>
            <SelectContent>
              {prefs.stages.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button variant="clay" onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Preferences'}
        </Button>
        {saved && <span className="text-sm text-green-600">Changes saved</span>}
      </div>
    </div>
  )
}
