'use client'

import { useState, useEffect } from 'react'
import { UserPreferences, FormingMethod, FiringType, Stage, PieceType, FORMING_METHOD_LABELS, FIRING_TYPE_LABELS } from '@/types'
import { getPreferences, savePreferences, DEFAULT_STAGES, DEFAULT_PIECE_TYPES } from '@/lib/store'
import { SurfaceLayerEditor } from '@/components/SurfaceLayerEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [saved, setSaved] = useState(false)
  const [newStageLabel, setNewStageLabel] = useState('')
  const [newPieceTypeLabel, setNewPieceTypeLabel] = useState('')

  useEffect(() => {
    const loaded = getPreferences()
    // Back-fill stages for existing users whose stored prefs pre-date this field
    if (!loaded.stages || loaded.stages.length === 0) {
      loaded.stages = DEFAULT_STAGES
    }
    if (!loaded.default_stage) {
      loaded.default_stage = loaded.stages[0]?.id
    }
    // Back-fill piece_types for existing users whose stored prefs pre-date this field
    if (!loaded.piece_types || loaded.piece_types.length === 0) {
      loaded.piece_types = DEFAULT_PIECE_TYPES
      loaded.default_piece_type = undefined
    }
    setPrefs(loaded)
  }, [])

  if (!prefs) return null

  function update<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    setPrefs((prev) => prev ? { ...prev, [key]: value } : prev)
    setSaved(false)
  }

  // ── Stage helpers ──────────────────────────────────────────────────────────

  function updateStageLabel(idx: number, label: string) {
    const stages = prefs!.stages.map((s, i) => i === idx ? { ...s, label } : s)
    update('stages', stages)
  }

  function moveStage(idx: number, direction: -1 | 1) {
    const stages = [...prefs!.stages]
    const target = idx + direction
    if (target < 0 || target >= stages.length) return
    ;[stages[idx], stages[target]] = [stages[target], stages[idx]]
    update('stages', stages)
  }

  function deleteStage(idx: number) {
    const stages = prefs!.stages.filter((_, i) => i !== idx)
    const deletedId = prefs!.stages[idx].id
    const newDefaultStage =
      prefs!.default_stage === deletedId ? stages[0]?.id : prefs!.default_stage
    setPrefs((prev) =>
      prev ? { ...prev, stages, default_stage: newDefaultStage } : prev
    )
    setSaved(false)
  }

  function addStage() {
    const label = newStageLabel.trim()
    if (!label) return
    const id = `stage_${Date.now()}`
    const stages = [...prefs!.stages, { id, label }]
    update('stages', stages)
    setNewStageLabel('')
  }

  // ── Piece type helpers ────────────────────────────────────────────────────

  function updatePieceTypeLabel(idx: number, label: string) {
    const piece_types = prefs!.piece_types.map((t, i) => i === idx ? { ...t, label } : t)
    update('piece_types', piece_types)
  }

  function movePieceType(idx: number, direction: -1 | 1) {
    const piece_types = [...prefs!.piece_types]
    const target = idx + direction
    if (target < 0 || target >= piece_types.length) return
    ;[piece_types[idx], piece_types[target]] = [piece_types[target], piece_types[idx]]
    update('piece_types', piece_types)
  }

  function deletePieceType(idx: number) {
    const piece_types = prefs!.piece_types.filter((_, i) => i !== idx)
    const deletedId = prefs!.piece_types[idx].id
    const newDefaultPieceType =
      prefs!.default_piece_type === deletedId ? undefined : prefs!.default_piece_type
    setPrefs((prev) =>
      prev ? { ...prev, piece_types, default_piece_type: newDefaultPieceType } : prev
    )
    setSaved(false)
  }

  function addPieceType() {
    const label = newPieceTypeLabel.trim()
    if (!label) return
    const id = `piece_type_${Date.now()}`
    const piece_types = [...prefs!.piece_types, { id, label }]
    update('piece_types', piece_types)
    setNewPieceTypeLabel('')
  }

  // ── Save ──────────────────────────────────────────────────────────────────

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
          <h2 className="text-base font-semibold text-stone-800">Stages</h2>
          <p className="text-xs text-stone-500 mt-1">
            Define the workflow stages for your pieces. Drag to reorder, or use the arrows.
          </p>
        </div>

        <div className="space-y-2">
          {prefs.stages.map((stage: Stage, idx: number) => (
            <div key={stage.id} className="flex items-center gap-2">
              <Input
                value={stage.label}
                onChange={(e) => updateStageLabel(idx, e.target.value)}
                className="flex-1"
              />
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => moveStage(idx, -1)}
                className="px-2 py-1 text-xs rounded border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={idx === prefs.stages.length - 1}
                onClick={() => moveStage(idx, 1)}
                className="px-2 py-1 text-xs rounded border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                disabled={prefs.stages.length <= 1}
                onClick={() => deleteStage(idx)}
                className="px-2 py-1 text-xs rounded border border-stone-200 text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Delete stage"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={newStageLabel}
            onChange={(e) => setNewStageLabel(e.target.value)}
            placeholder="New stage name..."
            className="flex-1"
            onKeyDown={(e) => { if (e.key === 'Enter') addStage() }}
          />
          <Button
            variant="outline"
            onClick={addStage}
            disabled={!newStageLabel.trim()}
          >
            Add stage
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Default stage</Label>
          <Select
            value={prefs.default_stage || prefs.stages[0]?.id || ''}
            onValueChange={(v) => update('default_stage', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {prefs.stages.map((s: Stage) => (
                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="space-y-4 bg-white rounded-xl border border-stone-200 p-6">
        <div>
          <h2 className="text-base font-semibold text-stone-800">Piece Types</h2>
          <p className="text-xs text-stone-500 mt-1">
            Define the types of pieces you make. Reorder or rename them to match your practice.
          </p>
        </div>

        <div className="space-y-2">
          {prefs.piece_types.map((pieceType: PieceType, idx: number) => (
            <div key={pieceType.id} className="flex items-center gap-2">
              <Input
                value={pieceType.label}
                onChange={(e) => updatePieceTypeLabel(idx, e.target.value)}
                className="flex-1"
              />
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => movePieceType(idx, -1)}
                className="px-2 py-1 text-xs rounded border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={idx === prefs.piece_types.length - 1}
                onClick={() => movePieceType(idx, 1)}
                className="px-2 py-1 text-xs rounded border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                disabled={prefs.piece_types.length <= 1}
                onClick={() => deletePieceType(idx)}
                className="px-2 py-1 text-xs rounded border border-stone-200 text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Delete piece type"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={newPieceTypeLabel}
            onChange={(e) => setNewPieceTypeLabel(e.target.value)}
            placeholder="New type name..."
            className="flex-1"
            onKeyDown={(e) => { if (e.key === 'Enter') addPieceType() }}
          />
          <Button
            variant="outline"
            onClick={addPieceType}
            disabled={!newPieceTypeLabel.trim()}
          >
            Add type
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Default piece type</Label>
          <Select
            value={prefs.default_piece_type || ''}
            onValueChange={(v) => update('default_piece_type', v || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {prefs.piece_types.map((t: PieceType) => (
                <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
