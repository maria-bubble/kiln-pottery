'use client'

import { useState, useEffect } from 'react'
import { UserPreferences, FormingMethod, FiringType, FORMING_METHOD_LABELS, FIRING_TYPE_LABELS } from '@/types'
import { getPreferences, savePreferences } from '@/lib/store'
import { SurfaceLayerEditor } from '@/components/SurfaceLayerEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [saved, setSaved] = useState(false)

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

      <div className="flex items-center gap-3">
        <Button variant="clay" onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Preferences'}
        </Button>
        {saved && <span className="text-sm text-green-600">Changes saved</span>}
      </div>
    </div>
  )
}
