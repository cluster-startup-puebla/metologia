#!/usr/bin/env python3
"""Seed 120 complete diagnostic sessions from the Foro Puebla x Puebla roster.

The PDF fixes who was invited (sector, type, size). It does not fix how they
answer. Size and the collapsed sector are copied from the roster. The chain
link is a deterministic map onto the closest instrument option. Every other
answer is a seeded draw, marked source='simulated'.

Alimentos shares the agroindustria module. Gastronomía shares turismo.
Armadoras have no OEM option. Hospitals are not a medical-device link.
Those mismatches are stored on the respondent, not smoothed away.
"""

from __future__ import annotations

import hashlib
import json
import random
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANK = ROOT / "content" / "methodology"
DB_PATH = ROOT / "data" / "foro-puebla-120.sqlite"
SEED = 20261118
MODEL = "foro-roster-v1"

# sector, tipo, size label, headcount. Order follows the PDF.
QUOTAS: list[tuple[str, str, str, int]] = [
    ("Automotriz", "Armadoras OEM y centros de manufactura", "Grande", 2),
    ("Automotriz", "Proveedores Tier 1", "Mediana", 3),
    ("Automotriz", "Proveedores Tier 1", "Grande", 7),
    ("Automotriz", "Proveedores Tier 2 / Tier 3", "Pequeña", 3),
    ("Automotriz", "Proveedores Tier 2 / Tier 3", "Mediana", 5),
    ("Automotriz", "Proveedores Tier 2 / Tier 3", "Grande", 2),
    ("Agroindustria", "Producción agrícola tecnificada", "Micro", 1),
    ("Agroindustria", "Producción agrícola tecnificada", "Pequeña", 3),
    ("Agroindustria", "Producción agrícola tecnificada", "Mediana", 2),
    ("Agroindustria", "Producción pecuaria", "Micro", 1),
    ("Agroindustria", "Producción pecuaria", "Pequeña", 2),
    ("Agroindustria", "Producción pecuaria", "Mediana", 2),
    ("Agroindustria", "Producción pecuaria", "Grande", 1),
    ("Agroindustria", "Empacadoras y procesadoras", "Pequeña", 1),
    ("Agroindustria", "Empacadoras y procesadoras", "Mediana", 2),
    ("Agroindustria", "Empacadoras y procesadoras", "Grande", 1),
    ("Agroindustria", "Agroinsumos y agroquímicos", "Pequeña", 1),
    ("Agroindustria", "Agroinsumos y agroquímicos", "Mediana", 1),
    ("Turismo", "Hotel corporativo o de cadena", "Mediana", 2),
    ("Turismo", "Hotel corporativo o de cadena", "Grande", 2),
    ("Turismo", "Hotel fuera de la capital (destino comunitario)", "Micro", 2),
    ("Turismo", "Hotel fuera de la capital (destino comunitario)", "Pequeña", 1),
    ("Turismo", "Agencias de viaje y operadores", "Micro", 2),
    ("Turismo", "Agencias de viaje y operadores", "Pequeña", 1),
    ("Turismo", "Eventos, congresos y recintos", "Micro", 1),
    ("Turismo", "Eventos, congresos y recintos", "Mediana", 1),
    ("Alimentos", "Procesadoras de alimentos", "Pequeña", 2),
    ("Alimentos", "Procesadoras de alimentos", "Mediana", 2),
    ("Alimentos", "Procesadoras de alimentos", "Grande", 1),
    ("Alimentos", "Bebidas", "Pequeña", 1),
    ("Alimentos", "Bebidas", "Mediana", 1),
    ("Alimentos", "Bebidas", "Grande", 1),
    ("Alimentos", "Panificación y confitería", "Pequeña", 1),
    ("Alimentos", "Panificación y confitería", "Mediana", 1),
    ("Metalmecánica", "Maquinados y troquelados", "Pequeña", 2),
    ("Metalmecánica", "Maquinados y troquelados", "Mediana", 3),
    ("Metalmecánica", "Estructuras y fabricación metálica", "Pequeña", 2),
    ("Metalmecánica", "Estructuras y fabricación metálica", "Mediana", 1),
    ("Metalmecánica", "Estructuras y fabricación metálica", "Grande", 1),
    ("Metalmecánica", "Tratamientos y recubrimientos", "Mediana", 1),
    ("Plásticos", "Inyección y soplado", "Pequeña", 1),
    ("Plásticos", "Inyección y soplado", "Mediana", 2),
    ("Plásticos", "Inyección y soplado", "Grande", 1),
    ("Plásticos", "Envases y empaques", "Pequeña", 1),
    ("Plásticos", "Envases y empaques", "Mediana", 1),
    ("Plásticos", "Envases y empaques", "Grande", 1),
    ("Plásticos", "Reciclaje y compuestos", "Pequeña", 1),
    ("Construcción", "Constructoras obra civil / vivienda", "Pequeña", 1),
    ("Construcción", "Constructoras obra civil / vivienda", "Mediana", 2),
    ("Construcción", "Constructoras obra civil / vivienda", "Grande", 1),
    ("Construcción", "Despachos de arquitectura e ingeniería", "Micro", 1),
    ("Construcción", "Despachos de arquitectura e ingeniería", "Pequeña", 1),
    ("Construcción", "Proveedores de materiales", "Pequeña", 1),
    ("Construcción", "Proveedores de materiales", "Mediana", 1),
    ("Logística", "Transporte de carga", "Pequeña", 1),
    ("Logística", "Transporte de carga", "Mediana", 1),
    ("Logística", "Transporte de carga", "Grande", 1),
    ("Logística", "Almacenaje y 3PL", "Pequeña", 1),
    ("Logística", "Almacenaje y 3PL", "Mediana", 1),
    ("Logística", "Paquetería y última milla", "Pequeña", 1),
    ("Gastronomía", "Restaurantes independientes", "Micro", 2),
    ("Gastronomía", "Restaurantes independientes", "Pequeña", 1),
    ("Gastronomía", "Cadenas y franquicias", "Mediana", 1),
    ("Gastronomía", "Cafeterías y caterings", "Micro", 1),
    ("Gastronomía", "Cafeterías y caterings", "Pequeña", 1),
    ("Médico hospitalario", "Hospitales privados", "Mediana", 1),
    ("Médico hospitalario", "Hospitales privados", "Grande", 1),
    ("Médico hospitalario", "Clínicas y laboratorios", "Pequeña", 1),
    ("Médico hospitalario", "Clínicas y laboratorios", "Mediana", 1),
    ("Médico hospitalario", "Dispositivos médicos y distribuidores", "Pequeña", 1),
    ("Textil", "Confección y maquila", "Pequeña", 1),
    ("Textil", "Confección y maquila", "Mediana", 1),
    ("Textil", "Confección y maquila", "Grande", 1),
    ("Textil", "Hilados y tejidos", "Mediana", 1),
    ("Textil", "Diseño y marca propia", "Pequeña", 1),
    ("Muebles", "Fabricantes de muebles", "Micro", 1),
    ("Muebles", "Fabricantes de muebles", "Pequeña", 1),
    ("Muebles", "Fabricantes de muebles", "Mediana", 1),
    ("Muebles", "Artesanal y decoración (talavera, madera)", "Micro", 1),
    ("Muebles", "Artesanal y decoración (talavera, madera)", "Pequeña", 1),
    ("Artes Gráficas", "Impresión comercial y offset", "Pequeña", 1),
    ("Artes Gráficas", "Impresión comercial y offset", "Mediana", 1),
    ("Artes Gráficas", "Empaque y etiquetas", "Pequeña", 1),
    ("Artes Gráficas", "Empaque y etiquetas", "Mediana", 1),
    ("Artes Gráficas", "Impresión digital y diseño", "Micro", 1),
]

SECTOR_TOTALS = {
    "Automotriz": 22,
    "Agroindustria": 18,
    "Turismo": 12,
    "Alimentos": 10,
    "Metalmecánica": 10,
    "Plásticos": 8,
    "Construcción": 8,
    "Logística": 6,
    "Gastronomía": 6,
    "Médico hospitalario": 5,
    "Textil": 5,
    "Muebles": 5,
    "Artes Gráficas": 5,
}

INSTRUMENT = {
    "Automotriz": "automotriz",
    "Agroindustria": "agroindustria",
    "Alimentos": "agroindustria",
    "Turismo": "turismo",
    "Gastronomía": "turismo",
    "Metalmecánica": "metalmecanica",
    "Plásticos": "plasticos",
    "Construcción": "construccion",
    "Logística": "logistica",
    "Médico hospitalario": "medico-hospitalario",
    "Textil": "textil",
    "Muebles": "muebles",
    "Artes Gráficas": "artes-graficas",
}

SIZE_OPTION = {
    "Micro": ("M1", "1-10"),
    "Pequeña": ("M2", "11-50"),
    "Mediana": ("M3", "51-250"),
    "Grande": ("M4", "251+"),
}

TERRITORY_QUESTION = {
    "automotriz": "N2-AUTO-02",
    "agroindustria": "N2-AGRO-02",
    "artes-graficas": "N2-GRAF-02",
    "construccion": "N2-CONST-02",
    "logistica": "N2-LOG-02",
    "medico-hospitalario": "N2-MED-02",
    "metalmecanica": "N2-METAL-02",
    "muebles": "N2-MUEB-02",
    "plasticos": "N2-PLAST-02",
    "textil": "N2-TEXT-02",
    "turismo": "N2-TUR-02",
}

COST_BAND = {
    "Micro": (80_000, 400_000),
    "Pequeña": (250_000, 1_500_000),
    "Mediana": (800_000, 6_000_000),
    "Grande": (2_000_000, 18_000_000),
}


def load_questions() -> list[dict]:
    n1 = json.loads((BANK / "n1.json").read_text())["questions"]
    found: list[dict] = list(n1)
    for path in sorted((BANK / "n2").glob("*.json")):
        found.extend(json.loads(path.read_text())["questions"])
    return found


def questions_for(all_questions: list[dict], instrument_sector: str) -> list[dict]:
    return [
        question
        for question in all_questions
        if question["level"] == "n1" or question.get("sectorId") == instrument_sector
    ]


def stable_index(key: str, modulo: int) -> int:
    digest = hashlib.sha256(key.encode()).hexdigest()
    return int(digest[:8], 16) % modulo


def eslabon(forum_sector: str, tipo: str, size: str, seq: int) -> tuple[str, str, str]:
    """Closest Nivel 2 link option. The note records a forced fit."""
    if forum_sector == "Automotriz":
        if tipo.startswith("Armadoras"):
            return "N2-AUTO-01", "opt1", "no_oem_option"
        if tipo == "Proveedores Tier 1":
            return "N2-AUTO-01", "opt1", ""
        option = "opt2" if seq % 2 == 0 else "opt3"
        return "N2-AUTO-01", option, "pdf_pools_tier2_and_tier3"
    if forum_sector == "Agroindustria":
        if tipo.startswith("Producción agrícola"):
            return "N2-AGRO-01", "opt1", ""
        if tipo.startswith("Producción pecuaria"):
            return "N2-AGRO-01", "opt1", "livestock_shares_primary_option"
        if tipo.startswith("Empacadoras"):
            option = "opt3" if size == "Grande" else "opt2"
            return "N2-AGRO-01", option, ""
        return "N2-AGRO-01", "opt4", ""
    if forum_sector == "Alimentos":
        if tipo.startswith("Panificación"):
            return "N2-AGRO-01", "opt2", "bakery_shares_basic_processing"
        if tipo == "Bebidas":
            return "N2-AGRO-01", "opt3", "bebidas_share_processed_food_option"
        option = "opt2" if size == "Pequeña" else "opt3"
        return "N2-AGRO-01", option, "alimentos_collapses_into_agroindustria"
    if forum_sector == "Turismo":
        if tipo.startswith("Hotel"):
            return "N2-TUR-01", "HOS", ""
        if tipo.startswith("Agencias"):
            return "N2-TUR-01", "TOU", ""
        return "N2-TUR-01", "MIC", ""
    if forum_sector == "Gastronomía":
        return "N2-TUR-01", "GAS", "gastronomia_collapses_into_turismo"
    if forum_sector == "Metalmecánica":
        if tipo.startswith("Maquinados"):
            return "N2-METAL-01", "opt1", ""
        if tipo.startswith("Estructuras"):
            return "N2-METAL-01", "opt3", ""
        return "N2-METAL-01", "opt4", ""
    if forum_sector == "Plásticos":
        if tipo.startswith("Inyección"):
            return "N2-PLAST-01", "opt1", ""
        if tipo.startswith("Envases"):
            return "N2-PLAST-01", "opt2", ""
        return "N2-PLAST-01", "opt4", ""
    if forum_sector == "Construcción":
        if tipo.startswith("Despachos"):
            return "N2-CONST-01", "opt4", ""
        if tipo.startswith("Proveedores"):
            return "N2-CONST-01", "opt3", ""
        option = "opt1" if size == "Pequeña" else "opt2"
        return "N2-CONST-01", option, "roster_mixes_vivienda_and_obra_civil"
    if forum_sector == "Logística":
        if tipo.startswith("Transporte"):
            return "N2-LOG-01", "opt1", ""
        if tipo.startswith("Almacenaje"):
            return "N2-LOG-01", "opt2", ""
        return "N2-LOG-01", "opt4", ""
    if forum_sector == "Médico hospitalario":
        if tipo.startswith("Hospitales"):
            return "N2-MED-01", "M2 pts", "hospital_not_in_instrument"
        if tipo.startswith("Clínicas"):
            return "N2-MED-01", "M4 pts", "clinic_forced_to_ivd"
        return "N2-MED-01", "M1 pts", ""
    if forum_sector == "Textil":
        if tipo.startswith("Hilados"):
            return "N2-TEXT-01", "opt1", ""
        if tipo.startswith("Diseño"):
            return "N2-TEXT-01", "opt3", "brand_has_no_option"
        return "N2-TEXT-01", "opt3", ""
    if forum_sector == "Muebles":
        if tipo.startswith("Artesanal"):
            return "N2-MUEB-01", "opt2", "talavera_folded_into_wood_furniture"
        if size == "Mediana":
            return "N2-MUEB-01", "opt3", ""
        return "N2-MUEB-01", "opt2", ""
    if forum_sector == "Artes Gráficas":
        if tipo.startswith("Impresión comercial"):
            return "N2-GRAF-01", "opt1", ""
        if tipo.startswith("Impresión digital"):
            return "N2-GRAF-01", "opt5", ""
        option = "opt4" if size == "Pequeña" else "opt2"
        return "N2-GRAF-01", option, "pdf_pools_empaque_and_etiquetas"
    raise KeyError(forum_sector)


def activity(forum_sector: str, tipo: str) -> tuple[str, str]:
    service_like = forum_sector in {"Turismo", "Gastronomía", "Logística"}
    if forum_sector == "Médico hospitalario" and not tipo.startswith("Dispositivos"):
        service_like = True
    if forum_sector == "Construcción" and tipo.startswith("Despachos"):
        service_like = True
    if service_like:
        return "SER", "activity_binary_is_manufactura_or_kisa"
    return "MAN", ""


def channel(forum_sector: str, tipo: str) -> str:
    if forum_sector == "Gastronomía":
        return "B2C"
    if forum_sector == "Turismo" and not tipo.startswith("Eventos"):
        return "B2C"
    if forum_sector == "Alimentos" and tipo.startswith("Panificación"):
        return "B2C"
    return "B2B"


def reach(rng: random.Random, forum_sector: str, size: str) -> str:
    export_sectors = {"Automotriz", "Metalmecánica", "Plásticos", "Textil", "Alimentos"}
    if size == "Micro":
        return "LOC"
    if size == "Grande" and forum_sector in export_sectors:
        return "EXP"
    return "EXP" if rng.random() < 0.3 else "LOC"


def territory_value(forum_tipo: str, seq: int, options: list[dict], rng: random.Random) -> str:
    if forum_tipo.startswith("Hotel fuera"):
        return ["R3", "R4", "R2"][seq % 3]
    if forum_tipo.startswith("Hotel corporativo"):
        return "R1"
    weights = [3 if index == 0 else 1 for index in range(len(options))]
    return rng.choices(options, weights=weights, k=1)[0]["value"]


def choose_option(rng: random.Random, options: list[dict], size: str) -> str:
    scores = [option["score"] for option in options]
    if any(score is None for score in scores):
        return rng.choice(options)["value"]
    target = {"Micro": 0.25, "Pequeña": 0.4, "Mediana": 0.62, "Grande": 0.82}[size]
    low, high = min(scores), max(scores)
    span = (high - low) or 1
    weights = []
    for option in options:
        normalized = (option["score"] - low) / span
        weights.append(1 / (0.18 + abs(normalized - target)))
    return rng.choices(options, weights=weights, k=1)[0]["value"]


def likert_value(rng: random.Random, size: str, block: str) -> int:
    center = {"Micro": 3.2, "Pequeña": 3.8, "Mediana": 4.6, "Grande": 5.4}[size]
    if block == "entorno":
        center = 3.5 + (center - 4) * 0.25
    drawn = round(center + rng.gauss(0, 1.05))
    return min(7, max(1, int(drawn)))


def annual_cost(rng: random.Random, size: str) -> int:
    low, high = COST_BAND[size]
    raw = rng.triangular(low, high, low + (high - low) * 0.35)
    return int(round(raw / 1000.0) * 1000)


def plackett_luce(rng: random.Random, factors: list[dict], weights: dict[str, float]) -> dict[str, int]:
    remaining = list(factors)
    order: list[str] = []
    while remaining:
        draw = rng.choices(remaining, weights=[weights[item["id"]] for item in remaining], k=1)[0]
        order.append(draw["id"])
        remaining.remove(draw)
    return {factor_id: position for position, factor_id in enumerate(order, start=1)}


def bias_weights(tipo: str, question_id: str, factors: list[dict]) -> dict[str, float]:
    preferred = factors[stable_index(f"{tipo}|{question_id}", len(factors))]["id"]
    return {factor["id"]: (5.0 if factor["id"] == preferred else 1.0) for factor in factors}


def expand_roster() -> list[dict]:
    people: list[dict] = []
    seen_tipo: dict[tuple[str, str, str], int] = {}
    for forum_sector, tipo, size, count in QUOTAS:
        for _ in range(count):
            key = (forum_sector, tipo, size)
            seq = seen_tipo.get(key, 0)
            seen_tipo[key] = seq + 1
            option, band = SIZE_OPTION[size]
            instrument = INSTRUMENT[forum_sector]
            notes: list[str] = []
            if forum_sector == "Alimentos":
                notes.append("forum_sector_collapses_into_agroindustria")
            if forum_sector == "Gastronomía":
                notes.append("forum_sector_collapses_into_turismo")
            link_question, link_option, link_note = eslabon(forum_sector, tipo, size, seq)
            if link_note:
                notes.append(link_note)
            activity_option, activity_note = activity(forum_sector, tipo)
            if activity_note:
                notes.append(activity_note)
            people.append(
                {
                    "forum_sector": forum_sector,
                    "forum_tipo": tipo,
                    "size_label": size,
                    "size_band": band,
                    "instrument_sector_id": instrument,
                    "n1_size_option": option,
                    "activity_option": activity_option,
                    "channel_option": channel(forum_sector, tipo),
                    "link_question": link_question,
                    "link_option": link_option,
                    "tipo_seq": seq,
                    "fit_notes": " | ".join(notes),
                }
            )
    for index, person in enumerate(people, start=1):
        person["respondent_id"] = f"FP-{index:03d}"
    return people


def main() -> None:
    if sum(count for *_, count in QUOTAS) != 120:
        raise SystemExit("quota list does not sum to 120")
    totals: dict[str, int] = {}
    for sector, _, _, count in QUOTAS:
        totals[sector] = totals.get(sector, 0) + count
    if totals != SECTOR_TOTALS:
        raise SystemExit(f"sector totals drifted: {totals}")

    questions = load_questions()
    by_id = {question["id"]: question for question in questions}
    roster = expand_roster()
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    if DB_PATH.exists():
        DB_PATH.unlink()

    connection = sqlite3.connect(DB_PATH)
    connection.execute("PRAGMA foreign_keys = ON")
    connection.executescript(
        """
        CREATE TABLE sim_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
        CREATE TABLE roster (
          respondent_id TEXT PRIMARY KEY,
          forum_sector TEXT NOT NULL,
          forum_tipo TEXT NOT NULL,
          size_label TEXT NOT NULL,
          size_band TEXT NOT NULL,
          instrument_sector_id TEXT NOT NULL,
          fit_notes TEXT NOT NULL
        );
        CREATE TABLE questions (
          question_id TEXT PRIMARY KEY,
          source_id TEXT,
          level TEXT NOT NULL,
          sector_id TEXT,
          block TEXT,
          qtype TEXT NOT NULL,
          title TEXT NOT NULL,
          prompt TEXT NOT NULL
        );
        CREATE TABLE question_options (
          question_id TEXT NOT NULL,
          option_value TEXT NOT NULL,
          option_label TEXT NOT NULL,
          option_score REAL,
          PRIMARY KEY (question_id, option_value)
        );
        CREATE TABLE question_factors (
          question_id TEXT NOT NULL,
          factor_id TEXT NOT NULL,
          factor_label TEXT NOT NULL,
          PRIMARY KEY (question_id, factor_id)
        );
        CREATE TABLE answers (
          respondent_id TEXT NOT NULL,
          question_id TEXT NOT NULL,
          option_value TEXT,
          likert_value INTEGER,
          source TEXT NOT NULL,
          PRIMARY KEY (respondent_id, question_id)
        );
        CREATE TABLE rank_positions (
          respondent_id TEXT NOT NULL,
          question_id TEXT NOT NULL,
          factor_id TEXT NOT NULL,
          rank_position INTEGER NOT NULL,
          PRIMARY KEY (respondent_id, question_id, factor_id)
        );
        CREATE TABLE rank_costs (
          respondent_id TEXT NOT NULL,
          question_id TEXT NOT NULL,
          cost_mxn INTEGER NOT NULL,
          PRIMARY KEY (respondent_id, question_id)
        );
        CREATE TABLE sim_rank_bias (
          forum_tipo TEXT NOT NULL,
          question_id TEXT NOT NULL,
          factor_id TEXT NOT NULL,
          weight REAL NOT NULL,
          PRIMARY KEY (forum_tipo, question_id, factor_id)
        );
        CREATE VIEW v_rank1 AS
        SELECT
          roster.respondent_id,
          roster.forum_sector,
          roster.forum_tipo,
          roster.size_label,
          roster.instrument_sector_id,
          rank_positions.question_id,
          questions.title AS question_title,
          question_factors.factor_label
        FROM rank_positions
        JOIN roster ON roster.respondent_id = rank_positions.respondent_id
        JOIN questions ON questions.question_id = rank_positions.question_id
        JOIN question_factors
          ON question_factors.question_id = rank_positions.question_id
         AND question_factors.factor_id = rank_positions.factor_id
        WHERE rank_positions.rank_position = 1;
        CREATE VIEW v_forum_vs_instrument AS
        SELECT forum_sector, instrument_sector_id, COUNT(*) AS respondents
        FROM roster
        GROUP BY forum_sector, instrument_sector_id;
        """
    )

    connection.executemany(
        "INSERT INTO sim_meta (key, value) VALUES (?, ?)",
        [
            ("response_model", MODEL),
            ("seed", str(SEED)),
            ("source_pdf", "Foro Puebla x Puebla - Distribución general.pdf"),
            ("event", "Foro Puebla x Puebla, 18 de noviembre de 2026, Hotel Quinta Real"),
            ("respondents", "120"),
            ("pdf_note", "Propuesta de distribución, no cifras oficiales."),
            (
                "answer_policy",
                "N1-01 size and N1-02 sector come from the roster. "
                "The Nivel 2 link is the closest option, with fit_notes when the option does not exist. "
                "Rank, likert, cost and the remaining choices are seeded simulation, not observed answers. "
                "Rank bias is stored in sim_rank_bias so a later query can tell a planted tilt from a finding. "
                "The annual peso figure is one number per ranking, not a cost of the factor in place 1.",
            ),
        ],
    )

    for question in questions:
        connection.execute(
            """
            INSERT INTO questions (question_id, source_id, level, sector_id, block, qtype, title, prompt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                question["id"],
                question.get("sourceId"),
                question["level"],
                question.get("sectorId"),
                question.get("block"),
                question["type"],
                question["title"],
                question["prompt"],
            ),
        )
        for option in question.get("options", []):
            connection.execute(
                """
                INSERT INTO question_options (question_id, option_value, option_label, option_score)
                VALUES (?, ?, ?, ?)
                """,
                (question["id"], option["value"], option["label"], option["score"]),
            )
        for factor in question.get("factors", []):
            connection.execute(
                "INSERT INTO question_factors (question_id, factor_id, factor_label) VALUES (?, ?, ?)",
                (question["id"], factor["id"], factor["label"]),
            )

    bias_rows: set[tuple[str, str, str]] = set()
    for person in roster:
        rng = random.Random(f"{SEED}|{person['respondent_id']}")
        connection.execute(
            """
            INSERT INTO roster (
              respondent_id, forum_sector, forum_tipo, size_label, size_band, instrument_sector_id, fit_notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                person["respondent_id"],
                person["forum_sector"],
                person["forum_tipo"],
                person["size_label"],
                person["size_band"],
                person["instrument_sector_id"],
                person["fit_notes"],
            ),
        )
        fixed: dict[str, tuple[str, str]] = {
            "N1-01": (person["n1_size_option"], "roster"),
            "N1-02": (person["instrument_sector_id"], "roster"),
            "N1-03": (person["activity_option"], "rule"),
            "N1-04": (person["channel_option"], "rule"),
            "N1-05": (reach(rng, person["forum_sector"], person["size_label"]), "simulated"),
            person["link_question"]: (person["link_option"], "rule"),
        }
        territory_id = TERRITORY_QUESTION[person["instrument_sector_id"]]
        territory = by_id[territory_id]
        fixed[territory_id] = (
            territory_value(person["forum_tipo"], person["tipo_seq"], territory["options"], rng),
            "rule" if person["forum_tipo"].startswith("Hotel") else "simulated",
        )

        for question in questions_for(questions, person["instrument_sector_id"]):
            question_id = question["id"]
            if question["type"] == "rank":
                weights = bias_weights(person["forum_tipo"], question_id, question["factors"])
                for factor_id, weight in weights.items():
                    key = (person["forum_tipo"], question_id, factor_id)
                    if key not in bias_rows:
                        bias_rows.add(key)
                        connection.execute(
                            """
                            INSERT INTO sim_rank_bias (forum_tipo, question_id, factor_id, weight)
                            VALUES (?, ?, ?, ?)
                            """,
                            key + (weight,),
                        )
                positions = plackett_luce(rng, question["factors"], weights)
                if sorted(positions.values()) != list(range(1, len(question["factors"]) + 1)):
                    raise SystemExit(f"bad permutation {person['respondent_id']} {question_id}")
                connection.executemany(
                    """
                    INSERT INTO rank_positions (respondent_id, question_id, factor_id, rank_position)
                    VALUES (?, ?, ?, ?)
                    """,
                    [
                        (person["respondent_id"], question_id, factor_id, position)
                        for factor_id, position in positions.items()
                    ],
                )
                connection.execute(
                    "INSERT INTO rank_costs (respondent_id, question_id, cost_mxn) VALUES (?, ?, ?)",
                    (person["respondent_id"], question_id, annual_cost(rng, person["size_label"])),
                )
                continue
            if question_id in fixed:
                value, source = fixed[question_id]
            elif question["type"] == "likert_7":
                value = likert_value(rng, person["size_label"], question.get("block") or "")
                source = "simulated"
            elif question["type"] == "single_select":
                value = choose_option(rng, question["options"], person["size_label"])
                source = "simulated"
            else:
                raise SystemExit(f"unknown type {question['type']}")
            if question["type"] == "likert_7":
                connection.execute(
                    """
                    INSERT INTO answers (respondent_id, question_id, option_value, likert_value, source)
                    VALUES (?, ?, NULL, ?, ?)
                    """,
                    (person["respondent_id"], question_id, int(value), source),
                )
            else:
                known = {option["value"] for option in question["options"]}
                if value not in known:
                    raise SystemExit(f"{question_id} has no option {value}")
                connection.execute(
                    """
                    INSERT INTO answers (respondent_id, question_id, option_value, likert_value, source)
                    VALUES (?, ?, ?, NULL, ?)
                    """,
                    (person["respondent_id"], question_id, value, source),
                )

    connection.executescript(
        """
        CREATE INDEX idx_answers_question ON answers (question_id);
        CREATE INDEX idx_rank_place ON rank_positions (question_id, rank_position);
        CREATE INDEX idx_roster_forum ON roster (forum_sector, forum_tipo);
        """
    )
    connection.commit()

    incomplete = connection.execute(
        """
        WITH expected AS (
          SELECT roster.respondent_id, questions.question_id, questions.qtype
          FROM roster
          JOIN questions
            ON questions.level = 'n1'
            OR questions.sector_id = roster.instrument_sector_id
        )
        SELECT COUNT(*)
        FROM expected
        LEFT JOIN answers
          ON answers.respondent_id = expected.respondent_id
         AND answers.question_id = expected.question_id
        LEFT JOIN rank_costs
          ON rank_costs.respondent_id = expected.respondent_id
         AND rank_costs.question_id = expected.question_id
        WHERE (expected.qtype = 'rank' AND rank_costs.question_id IS NULL)
           OR (expected.qtype != 'rank' AND answers.question_id IS NULL)
        """
    ).fetchone()[0]
    if incomplete:
        raise SystemExit(f"{incomplete} questions left empty")

    respondents = connection.execute("SELECT COUNT(*) FROM roster").fetchone()[0]
    answer_rows = connection.execute("SELECT COUNT(*) FROM answers").fetchone()[0]
    rank_rows = connection.execute("SELECT COUNT(*) FROM rank_positions").fetchone()[0]
    print(f"respondents={respondents} answers={answer_rows} rank_rows={rank_rows}")
    print(f"wrote {DB_PATH}")
    connection.close()


if __name__ == "__main__":
    main()
