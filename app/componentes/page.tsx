"use client"

import { useState } from "react"
import { ChoiceList } from "@/components/diagnostico/choice-list"
import { ChoiceWithText } from "@/components/diagnostico/choice-with-text"
import { LikertFive } from "@/components/diagnostico/likert-five"
import { Microcopy } from "@/components/diagnostico/microcopy"
import { PrefilledChoice } from "@/components/diagnostico/prefilled-choice"
import { RankBoard } from "@/components/diagnostico/rank-board"
import { sessionById } from "@/components/diagnostico/session-theme"

const n1 = sessionById("n1")
const n2 = sessionById("n2")

const LIKERT = [
  { value: "1", label: "1 · 20 pts. Altamente impredecible. Las reglas cambian y frenan la operación.", score: 20 },
  { value: "2", label: "2 · 40 pts. Impredecible. Tramitología lenta y poca claridad en cobros.", score: 40 },
  { value: "3", label: "3 · 60 pts. Neutro. Se cumple, pero toma tiempo de más.", score: 60 },
  { value: "4", label: "4 · 80 pts. Predecible. Reglas claras y ventanillas que funcionan.", score: 80 },
  { value: "5", label: "5 · 100 pts. Altamente predecible. Trámites digitales y certeza para invertir.", score: 100 },
]

const PROJECTS = [
  { value: "p1", label: "Proyecto 1. Motor de reservas en el sitio.", score: null },
  { value: "p2", label: "Proyecto 2. CRM con seguimiento por WhatsApp.", score: null },
  { value: "own", label: "Proyecto propio. Escríbelo en máximo 100 caracteres.", score: null },
]

const FRICTIONS = [
  { id: "f1", label: "Comisiones de plataformas de reserva." },
  { id: "f2", label: "Cotizaciones que se quedan en Excel." },
  { id: "f3", label: "Fallas en la pasarela de pago." },
]

export default function ComponentesPage() {
  const [likert, setLikert] = useState<string | null>(null)
  const [sector, setSector] = useState<string | null>("agro")
  const [project, setProject] = useState<{ optionValue: string; text: string }>({ optionValue: "", text: "" })
  const [ranks, setRanks] = useState<Record<string, number>>({})

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Componentes del instrumento v2</h1>
        <Microcopy>La guía técnica va debajo de la pregunta, no dentro de la opción.</Microcopy>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tarjeta de selección única</h2>
        <ChoiceList
          options={[
            { value: "auto", label: "Automotriz, autopartes y electromovilidad.", score: null },
            { value: "agro", label: "Producción agrícola y pecuaria tecnificada.", score: null },
            { value: "food", label: "Alimentos empacados y procesados.", score: null },
          ]}
          value={sector}
          accent={n1.color}
          accentInk={n1.ink}
          onChange={setSector}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pre-poblado</h2>
        <PrefilledChoice
          label="Producción agrícola y pecuaria tecnificada."
          source="Nivel 1"
          accent={n2.color}
          accentInk={n2.ink}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Likert de 5</h2>
        <LikertFive options={LIKERT} value={likert} accent={n1.color} accentInk={n1.ink} onChange={setLikert} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Selección más texto libre</h2>
        <ChoiceWithText
          options={PROJECTS}
          value={project.optionValue || null}
          text={project.text}
          textOptionValue="own"
          accent={n2.color}
          accentInk={n2.ink}
          onChange={setProject}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Rompehielos</h2>
        <RankBoard factors={FRICTIONS} ranks={ranks} accent={n2.color} accentInk={n2.ink} onChange={setRanks} />
      </section>
    </main>
  )
}
