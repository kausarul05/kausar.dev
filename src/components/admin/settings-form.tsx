"use client";

import { useActionState, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { saveSettings, type ActionState } from "@/app/admin/actions";
import {
  Card,
  Field,
  FormError,
  Input,
  SubmitButton,
  Textarea,
} from "@/components/admin/form";
import type { Settings } from "@/lib/schemas";

const MAX_STATS = 4;

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveSettings, {});
  const err = state.fields ?? {};

  const [stats, setStats] = useState(() =>
    settings.about.stats.length
      ? settings.about.stats
      : [{ value: 0, suffix: "", label: "" }],
  );
  const [socials, setSocials] = useState(() =>
    settings.socials.length ? settings.socials : [{ label: "", handle: "", href: "" }],
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormError message={state.error} />

      <Card title="Identity" description="Name, role and the details in the hero.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name" name="name" error={err["site.name"]}>
            <Input name="name" defaultValue={settings.site.name} />
          </Field>
          <Field label="Role" name="role" error={err["site.role"]}>
            <Input name="role" defaultValue={settings.site.role} />
          </Field>
          <Field
            label="First name"
            name="first"
            hint="The solid line of the hero lockup."
            error={err["site.first"]}
          >
            <Input name="first" defaultValue={settings.site.first} />
          </Field>
          <Field
            label="Last name"
            name="last"
            hint="The outlined line underneath."
            error={err["site.last"]}
          >
            <Input name="last" defaultValue={settings.site.last} />
          </Field>
          <Field label="Email" name="email" error={err["site.email"]}>
            <Input name="email" type="email" defaultValue={settings.site.email} />
          </Field>
          <Field label="Site URL" name="url" error={err["site.url"]}>
            <Input name="url" defaultValue={settings.site.url} />
          </Field>
          <Field label="Location" name="location" error={err["site.location"]}>
            <Input name="location" defaultValue={settings.site.location} />
          </Field>
          <Field
            label="Time zone"
            name="timeZone"
            hint="IANA name, e.g. Asia/Dhaka. Drives the live clock."
            error={err["site.timeZone"]}
          >
            <Input name="timeZone" defaultValue={settings.site.timeZone} />
          </Field>
          <Field label="Edition" name="edition" hint="Shown as the year marker." error={err["site.edition"]}>
            <Input name="edition" defaultValue={settings.site.edition} />
          </Field>
          <Field
            label="Photo path"
            name="photo"
            hint="A file in /public, e.g. /kausarul.jpg"
            error={err["site.photo"]}
          >
            <Input name="photo" defaultValue={settings.site.photo} />
          </Field>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          <Field label="Tagline" name="tagline" error={err["site.tagline"]}>
            <Textarea name="tagline" defaultValue={settings.site.tagline} className="min-h-20" />
          </Field>

          <div className="flex flex-wrap items-end gap-5">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="available"
                defaultChecked={settings.site.available}
                className="h-4 w-4 accent-[#ccff3d]"
              />
              <span className="font-mono text-[11px] tracking-[0.16em] text-mute uppercase">
                Show availability pill
              </span>
            </label>
            <div className="min-w-56 flex-1">
              <Field label="Availability label" name="availableLabel" error={err["site.availableLabel"]}>
                <Input name="availableLabel" defaultValue={settings.site.availableLabel} />
              </Field>
            </div>
          </div>
        </div>
      </Card>

      <Card title="About" description="The scroll-lit paragraph and the counters under it.">
        <div className="flex flex-col gap-5">
          <Field label="Kicker" name="aboutKicker" error={err["about.kicker"]}>
            <Input name="aboutKicker" defaultValue={settings.about.kicker} />
          </Field>
          <Field
            label="Body"
            name="aboutBody"
            hint="Lights up word by word as the section scrolls."
            error={err["about.body"]}
          >
            <Textarea name="aboutBody" defaultValue={settings.about.body} className="min-h-40" />
          </Field>
          <Field label="Note" name="aboutNote" error={err["about.note"]}>
            <Textarea name="aboutNote" defaultValue={settings.about.note} className="min-h-20" />
          </Field>
        </div>

        <div className="mt-7">
          <p className="mb-3 font-mono text-[11px] tracking-[0.16em] text-mute uppercase">
            Counters
          </p>
          <div className="flex flex-col gap-3">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  name="statValue"
                  type="number"
                  defaultValue={stat.value}
                  aria-label="Value"
                  className="w-24 shrink-0"
                />
                <Input
                  name="statSuffix"
                  defaultValue={stat.suffix}
                  placeholder="+"
                  aria-label="Suffix"
                  className="w-20 shrink-0"
                />
                <Input
                  name="statLabel"
                  defaultValue={stat.label}
                  placeholder="Products shipped"
                  aria-label="Label"
                />
                <button
                  type="button"
                  aria-label="Remove counter"
                  onClick={() => setStats(stats.filter((_, index) => index !== i))}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-dim transition-colors hover:border-rose/40 hover:text-rose"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          {stats.length < MAX_STATS && (
            <button
              type="button"
              onClick={() => setStats([...stats, { value: 0, suffix: "", label: "" }])}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/12 px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-mute uppercase transition-colors hover:border-white/25 hover:text-ink"
            >
              <Plus className="h-3.5 w-3.5" />
              Add counter
            </button>
          )}
        </div>
      </Card>

      <Card title="Contact" description="The closing section.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Kicker" name="contactKicker" error={err["contact.kicker"]}>
            <Input name="contactKicker" defaultValue={settings.contact.kicker} />
          </Field>
          <Field label="Headline" name="contactHeadline" error={err["contact.headline"]}>
            <Input name="contactHeadline" defaultValue={settings.contact.headline} />
          </Field>
          <Field
            label="Headline accent"
            name="contactAccent"
            hint="Rendered in italic serif on the second line."
            error={err["contact.headlineAccent"]}
          >
            <Input name="contactAccent" defaultValue={settings.contact.headlineAccent} />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Body" name="contactBody" error={err["contact.body"]}>
            <Textarea name="contactBody" defaultValue={settings.contact.body} className="min-h-24" />
          </Field>
        </div>
      </Card>

      <Card title="Socials" description="Listed in the contact section and the left rail.">
        <div className="flex flex-col gap-3">
          {socials.map((social, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <Input
                name="socialLabel"
                defaultValue={social.label}
                placeholder="GitHub"
                aria-label="Label"
                className="w-36 shrink-0"
              />
              <Input
                name="socialHandle"
                defaultValue={social.handle}
                placeholder="@you"
                aria-label="Handle"
                className="w-40 shrink-0"
              />
              <Input
                name="socialHref"
                defaultValue={social.href}
                placeholder="https://github.com/you"
                aria-label="URL"
                className="min-w-56 flex-1"
              />
              <button
                type="button"
                aria-label="Remove social"
                onClick={() => setSocials(socials.filter((_, index) => index !== i))}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-dim transition-colors hover:border-rose/40 hover:text-rose"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSocials([...socials, { label: "", handle: "", href: "" }])}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/12 px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-mute uppercase transition-colors hover:border-white/25 hover:text-ink"
        >
          <Plus className="h-3.5 w-3.5" />
          Add social
        </button>
      </Card>

      <Card title="Marquee" description="The ticker above the Stack section. One word per line.">
        <Field label="Items" name="marquee" error={err.marquee}>
          <Textarea
            name="marquee"
            defaultValue={settings.marquee.join("\n")}
            className="min-h-40"
          />
        </Field>
      </Card>

      <div className="sticky bottom-4 flex items-center gap-3 rounded-xl border border-white/10 bg-void/90 p-3 backdrop-blur-xl">
        <SubmitButton>Save settings</SubmitButton>
        {state.ok && (
          <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-acid uppercase">
            <Check className="h-3.5 w-3.5" />
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
