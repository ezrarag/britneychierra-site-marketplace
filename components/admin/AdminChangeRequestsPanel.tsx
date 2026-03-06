"use client"

import { useEffect, useMemo, useState } from "react"
import type { AdminChangePriority, AdminChangeRequest } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type CreateFormState = {
  title: string
  description: string
  priority: AdminChangePriority
}

const INITIAL_FORM_STATE: CreateFormState = {
  title: "",
  description: "",
  priority: "medium",
}

function priorityBadgeClass(priority: AdminChangePriority): string {
  if (priority === "high") return "bg-red-600/20 text-red-200 border-red-300/30"
  if (priority === "low") return "bg-blue-600/20 text-blue-200 border-blue-300/30"
  return "bg-amber-600/20 text-amber-100 border-amber-300/30"
}

export function AdminChangeRequestsPanel() {
  const [requests, setRequests] = useState<AdminChangeRequest[]>([])
  const [form, setForm] = useState<CreateFormState>(INITIAL_FORM_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  async function loadRequests() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/change-requests")
      if (!response.ok) {
        throw new Error("Failed to load requests")
      }
      const data = (await response.json()) as AdminChangeRequest[]
      setRequests(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      toast.error("Could not load requests.")
      setRequests([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadRequests()
  }, [])

  const canSubmit = useMemo(() => {
    return form.title.trim().length >= 3 && form.description.trim().length >= 10 && !isSubmitting
  }, [form, isSubmitting])

  async function submitRequest() {
    if (!canSubmit) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/change-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error || "Failed to submit request")
      }

      const created = (await response.json()) as AdminChangeRequest
      setRequests((current) => [created, ...current])
      setForm(INITIAL_FORM_STATE)
      toast.success("Request submitted.")
    } catch (error) {
      console.error(error)
      toast.error("Could not submit request.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Card className="bg-white/5 border-white/20 text-white">
        <CardHeader>
          <CardTitle>Request a functionality change</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/80" htmlFor="request-title">
              Title
            </label>
            <Input
              id="request-title"
              placeholder="Example: Add recurring product drops"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="bg-black/30 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80" htmlFor="request-description">
              Description
            </label>
            <Textarea
              id="request-description"
              placeholder="Explain what should change and why."
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="min-h-32 bg-black/30 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80" htmlFor="request-priority">
              Priority
            </label>
            <select
              id="request-priority"
              value={form.priority}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  priority: event.target.value as AdminChangePriority,
                }))
              }
              className="w-full rounded-md border border-white/20 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <Button
            type="button"
            onClick={submitRequest}
            disabled={!canSubmit}
            className="w-full bg-white text-black hover:bg-white/85"
          >
            {isSubmitting ? "Submitting..." : "Send to Slack + Admin queue"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/20 text-white">
        <CardHeader>
          <CardTitle>Recent change requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-white/70">Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-white/70">No requests submitted yet.</p>
          ) : (
            <ul className="space-y-3">
              {requests.map((request) => (
                <li key={request.id} className="rounded-lg border border-white/10 bg-black/25 p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{request.title}</h3>
                    <Badge className={priorityBadgeClass(request.priority)}>{request.priority}</Badge>
                  </div>
                  <p className="text-sm text-white/80">{request.description}</p>
                  <p className="mt-2 text-xs text-white/50">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
