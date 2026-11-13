#!/usr/bin/env python3
"""Rebuild the full Foro Puebla analytics PDF from the SQLite database.

Read-only. Every count in the PDF comes from a query. The script installs
fpdf2 with pip only when it cannot be imported. It does not touch package.json
and it does not write to the database.
"""

from __future__ import annotations

import sqlite3
import subprocess
import sys
from collections import defaultdict
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from zoneinfo import ZoneInfo


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data" / "foro-puebla-120.sqlite"
OUT_PATH = ROOT / "data" / "foro-puebla-120-analitica.pdf"

MONTHS_ES = (
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
)

COLUMN_GLOSS = {
    "sim_meta.key": "Clave del metadato de la simulación o del evento.",
    "sim_meta.value": "Valor literal. Hay que copiarlo tal cual, sin parafrasear cifras.",
    "roster.respondent_id": "Identificador del invitado en el padrón.",
    "roster.forum_sector": "Sector tal como lo propone el foro. Puede ser Alimentos o Gastronomía.",
    "roster.forum_tipo": "Tipo de organización dentro del sector del foro.",
    "roster.size_label": "Etiqueta de tamaño que trae el padrón.",
    "roster.size_band": "Banda de personal que acompaña a size_label.",
    "roster.instrument_sector_id": "Sector del instrumento al que se pliega la persona. Lo usan N1-02 y el nivel 2.",
    "roster.fit_notes": "Códigos del ajuste forzado, separados por ' | '. Cadena vacía si no hubo nota.",
    "questions.question_id": "Identificador de la pregunta en esta base.",
    "questions.source_id": "Identificador de la pregunta en el instrumento de origen (F0.1, F0.2, R00-..., etc.).",
    "questions.level": "Nivel: n1 o n2.",
    "questions.sector_id": "Sector del instrumento. En nivel 1 va nulo.",
    "questions.block": "Bloque temático del instrumento.",
    "questions.qtype": "Tipo: single_select, likert_7 o rank.",
    "questions.title": "Título de la pregunta.",
    "questions.prompt": "Enunciado completo de la pregunta.",
    "question_options.question_id": "Pregunta dueña de la opción.",
    "question_options.option_value": "Código almacenado de la opción.",
    "question_options.option_label": "Etiqueta completa. No se resume.",
    "question_options.option_score": "Puntaje del instrumento. Nulo si no hay score. El cero es un score real, no un nulo.",
    "question_factors.question_id": "Pregunta rank dueña del factor.",
    "question_factors.factor_id": "Código del factor dentro de la pregunta.",
    "question_factors.factor_label": "Etiqueta completa del factor. No se resume.",
    "answers.respondent_id": "Invitado que responde.",
    "answers.question_id": "Pregunta respondida. Las preguntas rank no usan esta tabla.",
    "answers.option_value": "Opción elegida en selección única. Nulo en Likert.",
    "answers.likert_value": "Entero de la escala Likert. Nulo en selección única.",
    "answers.source": "Procedencia de la fila: roster, rule o simulated.",
    "rank_positions.respondent_id": "Invitado que ordena.",
    "rank_positions.question_id": "Pregunta rank.",
    "rank_positions.factor_id": "Factor ordenado.",
    "rank_positions.rank_position": "Lugar en el ranking. 1 es el mayor dolor. No es un hallazgo de mercado.",
    "rank_costs.respondent_id": "Invitado.",
    "rank_costs.question_id": "Pregunta rank a la que pertenece la cifra.",
    "rank_costs.cost_mxn": "Una cifra anual entera en pesos por el ranking completo. Simulada. No es el costo del factor en lugar 1.",
    "sim_rank_bias.forum_tipo": "Tipo del foro al que se le plantó el sesgo.",
    "sim_rank_bias.question_id": "Pregunta rank.",
    "sim_rank_bias.factor_id": "Factor sesgado.",
    "sim_rank_bias.weight": "5 es el factor preferido plantado. 1 es el resto. No hay otros pesos en esta base si la consulta de cobertura lo confirma.",
}


def ensure_fpdf() -> None:
    try:
        import fpdf  # noqa: F401
    except ImportError:
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "fpdf2"],
            stdout=subprocess.DEVNULL,
        )


ensure_fpdf()

from fpdf import FPDF  # noqa: E402
from fpdf.enums import TableCellFillMode, WrapMode  # noqa: E402
from fpdf.fonts import FontFace  # noqa: E402


def connect_readonly(path: Path) -> sqlite3.Connection:
    uri = path.resolve().as_uri() + "?mode=ro"
    conn = sqlite3.connect(uri, uri=True)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA query_only = ON")
    return conn


def rows(conn: sqlite3.Connection, sql: str, params: tuple = ()) -> list[sqlite3.Row]:
    return list(conn.execute(sql, params))


def scalar(conn: sqlite3.Connection, sql: str, params: tuple = ()):
    return conn.execute(sql, params).fetchone()[0]


def dec_mean(total: int, n: int) -> Decimal | None:
    if n <= 0:
        return None
    return Decimal(total) / Decimal(n)


def fmt_mean(total: int, n: int) -> str:
    value = dec_mean(total, n)
    if value is None:
        return "sin filas"
    rounded = value.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP)
    return f"{rounded:.4f}"


def fmt_decimal(value: Decimal | None, empty: str = "sin filas") -> str:
    if value is None:
        return empty
    if value == value.to_integral_value():
        return str(int(value))
    return format(value.normalize(), "f")


def median_of(values: list[int]) -> Decimal | None:
    if not values:
        return None
    ordered = sorted(values)
    count = len(ordered)
    mid = count // 2
    if count % 2 == 1:
        return Decimal(ordered[mid])
    return (Decimal(ordered[mid - 1]) + Decimal(ordered[mid])) / Decimal(2)


def fmt_score(value) -> str:
    if value is None:
        return "sin score"
    number = Decimal(str(value))
    if number == number.to_integral_value():
        return str(int(number))
    return format(number.normalize(), "f")


def fmt_mxn(value: Decimal | int | None) -> str:
    if value is None:
        return "sin filas"
    if isinstance(value, Decimal):
        return f"{fmt_decimal(value)} MXN"
    return f"{int(value)} MXN"


def size_key(band: str, label: str) -> tuple:
    head = band.split("-")[0].rstrip("+")
    try:
        start = int(head)
    except ValueError:
        start = 10**9
    return (start, label)


def factor_key(factor_id: str) -> tuple:
    digits = ""
    for char in reversed(factor_id):
        if char.isdigit():
            digits = char + digits
        else:
            break
    return (int(digits) if digits else 10**6, factor_id)


def fecha_generacion(moment: datetime) -> str:
    return (
        f"{moment.day} de {MONTHS_ES[moment.month - 1]} de {moment.year}, "
        f"{moment.strftime('%H:%M')} (hora del centro de México)"
    )


def find_fonts() -> tuple[str, str, str, str]:
    families = [
        (
            "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/System/Library/Fonts/Supplemental/Arial Italic.ttf",
            "/System/Library/Fonts/Supplemental/Arial Bold Italic.ttf",
        ),
        (
            "/Library/Fonts/Arial.ttf",
            "/Library/Fonts/Arial Bold.ttf",
            "/Library/Fonts/Arial Italic.ttf",
            "/Library/Fonts/Arial Bold Italic.ttf",
        ),
        (
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-BoldOblique.ttf",
        ),
        (
            "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
            "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation2/LiberationSans-Italic.ttf",
            "/usr/share/fonts/truetype/liberation2/LiberationSans-BoldItalic.ttf",
        ),
    ]
    for regular, bold, italic, bold_italic in families:
        if Path(regular).is_file() and Path(bold).is_file():
            italic_path = italic if Path(italic).is_file() else regular
            bold_italic_path = bold_italic if Path(bold_italic).is_file() else bold
            return regular, bold, italic_path, bold_italic_path
    unicode_fallback = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
    if Path(unicode_fallback).is_file():
        return (unicode_fallback, unicode_fallback, unicode_fallback, unicode_fallback)
    raise SystemExit(
        "No hay una fuente TrueType con acentos, omega y el signo mayor o igual. "
        "Instala Arial, DejaVu o Liberation Sans y vuelve a correr el script."
    )


def load(conn: sqlite3.Connection) -> dict:
    meta_rows = rows(conn, "SELECT key, value FROM sim_meta ORDER BY rowid")
    meta = {row["key"]: row["value"] for row in meta_rows}

    tables = [
        row["name"]
        for row in rows(
            conn,
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
        )
    ]
    views = rows(
        conn,
        "SELECT name, sql FROM sqlite_master WHERE type = 'view' ORDER BY name",
    )
    indexes = rows(
        conn,
        "SELECT name, tbl_name, sql FROM sqlite_master WHERE type = 'index' AND sql IS NOT NULL ORDER BY name",
    )
    schema = {}
    for name in tables:
        schema[name] = rows(conn, f"PRAGMA table_info({name})")

    n_roster = scalar(conn, "SELECT COUNT(*) FROM roster")
    n_answers = scalar(conn, "SELECT COUNT(*) FROM answers")
    n_rank_rows = scalar(conn, "SELECT COUNT(*) FROM rank_positions")
    n_costs = scalar(conn, "SELECT COUNT(*) FROM rank_costs")
    n_questions = scalar(conn, "SELECT COUNT(*) FROM questions")
    n_options = scalar(conn, "SELECT COUNT(*) FROM question_options")
    n_factors = scalar(conn, "SELECT COUNT(*) FROM question_factors")
    n_bias = scalar(conn, "SELECT COUNT(*) FROM sim_rank_bias")

    empty_applicable = scalar(
        conn,
        """
        WITH applicable AS (
          SELECT
            q.question_id,
            CASE
              WHEN q.level = 'n1' THEN (SELECT COUNT(*) FROM roster)
              ELSE (
                SELECT COUNT(*) FROM roster r
                WHERE r.instrument_sector_id = q.sector_id
              )
            END AS expected,
            CASE
              WHEN q.qtype = 'rank' THEN (
                SELECT COUNT(*) FROM rank_positions rp
                WHERE rp.question_id = q.question_id
              )
              ELSE (
                SELECT COUNT(*) FROM answers a
                WHERE a.question_id = q.question_id
              )
            END AS got
          FROM questions q
        )
        SELECT COUNT(*) FROM applicable WHERE expected > 0 AND got = 0
        """,
    )
    zero_row_questions = rows(
        conn,
        """
        SELECT q.question_id, q.qtype, q.sector_id, q.title
        FROM questions q
        WHERE NOT EXISTS (
          SELECT 1 FROM answers a WHERE a.question_id = q.question_id
        )
        AND NOT EXISTS (
          SELECT 1 FROM rank_positions rp WHERE rp.question_id = q.question_id
        )
        ORDER BY q.question_id
        """,
    )

    by_level = rows(
        conn,
        "SELECT level, COUNT(*) AS n FROM questions GROUP BY level ORDER BY level",
    )
    by_sector_q = rows(
        conn,
        """
        SELECT COALESCE(sector_id, 'nulo') AS sector_id, COUNT(*) AS n
        FROM questions
        GROUP BY sector_id
        ORDER BY sector_id IS NULL DESC, sector_id
        """,
    )
    by_qtype = rows(
        conn,
        "SELECT qtype, COUNT(*) AS n FROM questions GROUP BY qtype ORDER BY qtype",
    )
    by_level_qtype = rows(
        conn,
        """
        SELECT level, qtype, COUNT(*) AS n
        FROM questions
        GROUP BY level, qtype
        ORDER BY level, qtype
        """,
    )
    by_sector_qtype = rows(
        conn,
        """
        SELECT COALESCE(sector_id, 'nulo') AS sector_id, qtype, COUNT(*) AS n
        FROM questions
        GROUP BY sector_id, qtype
        ORDER BY sector_id IS NULL DESC, sector_id, qtype
        """,
    )
    by_block = rows(
        conn,
        """
        SELECT COALESCE(block, 'nulo') AS block, level, qtype, COUNT(*) AS n
        FROM questions
        GROUP BY block, level, qtype
        ORDER BY level, block, qtype
        """,
    )
    by_source = rows(
        conn,
        "SELECT source, COUNT(*) AS n FROM answers GROUP BY source ORDER BY n DESC, source",
    )
    source_by_question = rows(
        conn,
        """
        SELECT question_id, source, COUNT(*) AS n
        FROM answers
        GROUP BY question_id, source
        ORDER BY question_id, source
        """,
    )

    by_forum_sector = rows(
        conn,
        """
        SELECT forum_sector, COUNT(*) AS n
        FROM roster
        GROUP BY forum_sector
        ORDER BY n DESC, forum_sector
        """,
    )
    by_cross = rows(
        conn,
        """
        SELECT forum_sector, forum_tipo, size_label, size_band, COUNT(*) AS n
        FROM roster
        GROUP BY forum_sector, forum_tipo, size_label, size_band
        ORDER BY forum_sector, forum_tipo, size_band, size_label
        """,
    )
    forum_vs_instrument = rows(
        conn,
        """
        SELECT forum_sector, instrument_sector_id, respondents
        FROM v_forum_vs_instrument
        ORDER BY respondents DESC, forum_sector
        """,
    )
    fit_census = rows(
        conn,
        """
        SELECT fit_notes, COUNT(*) AS n
        FROM roster
        GROUP BY fit_notes
        ORDER BY n DESC, fit_notes
        """,
    )
    roster_rows = rows(
        conn,
        """
        SELECT
          respondent_id, forum_sector, forum_tipo, size_label, size_band,
          instrument_sector_id, fit_notes
        FROM roster
        ORDER BY forum_sector, forum_tipo, size_label, respondent_id
        """,
    )
    sizes = rows(
        conn,
        """
        SELECT size_label, size_band, COUNT(*) AS n
        FROM roster
        GROUP BY size_label, size_band
        """,
    )
    sizes = sorted(sizes, key=lambda row: size_key(row["size_band"], row["size_label"]))

    sectors_for_instrument: dict[str, list[str]] = defaultdict(list)
    for row in rows(
        conn,
        """
        SELECT instrument_sector_id, forum_sector, COUNT(*) AS n
        FROM roster
        GROUP BY instrument_sector_id, forum_sector
        ORDER BY instrument_sector_id, forum_sector
        """,
    ):
        sectors_for_instrument[row["instrument_sector_id"]].append(row["forum_sector"])

    questions = rows(
        conn,
        """
        SELECT question_id, source_id, level, sector_id, block, qtype, title, prompt
        FROM questions
        ORDER BY question_id
        """,
    )
    options_by_q: dict[str, list[sqlite3.Row]] = defaultdict(list)
    for row in rows(
        conn,
        """
        SELECT question_id, option_value, option_label, option_score
        FROM question_options
        ORDER BY rowid
        """,
    ):
        options_by_q[row["question_id"]].append(row)

    factors_by_q: dict[str, list[sqlite3.Row]] = defaultdict(list)
    for row in rows(
        conn,
        """
        SELECT question_id, factor_id, factor_label
        FROM question_factors
        ORDER BY rowid
        """,
    ):
        factors_by_q[row["question_id"]].append(row)
    for qid in factors_by_q:
        factors_by_q[qid].sort(key=lambda row: factor_key(row["factor_id"]))

    option_source: dict[tuple[str, str], dict[str, int]] = defaultdict(lambda: defaultdict(int))
    option_forum: dict[tuple[str, str], dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for row in rows(
        conn,
        """
        SELECT a.question_id, a.option_value, a.source, r.forum_sector, COUNT(*) AS n
        FROM answers a
        JOIN roster r ON r.respondent_id = a.respondent_id
        WHERE a.option_value IS NOT NULL
        GROUP BY a.question_id, a.option_value, a.source, r.forum_sector
        """,
    ):
        key = (row["question_id"], row["option_value"])
        option_source[key][row["source"]] += row["n"]
        option_forum[key][row["forum_sector"]] += row["n"]

    answer_n = {
        row["question_id"]: row["n"]
        for row in rows(
            conn,
            "SELECT question_id, COUNT(*) AS n FROM answers GROUP BY question_id",
        )
    }

    likert_cells: dict[tuple[str, str], dict[int, int]] = defaultdict(lambda: defaultdict(int))
    likert_sum: dict[tuple[str, str], int] = defaultdict(int)
    likert_n: dict[tuple[str, str], int] = defaultdict(int)
    likert_min: dict[tuple[str, str], int | None] = {}
    likert_max: dict[tuple[str, str], int | None] = {}
    for row in rows(
        conn,
        """
        SELECT
          a.question_id,
          r.size_label,
          a.likert_value,
          COUNT(*) AS n,
          SUM(a.likert_value) AS total
        FROM answers a
        JOIN roster r ON r.respondent_id = a.respondent_id
        JOIN questions q ON q.question_id = a.question_id
        WHERE q.qtype = 'likert_7'
        GROUP BY a.question_id, r.size_label, a.likert_value
        """,
    ):
        key = (row["question_id"], row["size_label"])
        likert_cells[key][row["likert_value"]] += row["n"]
        likert_n[key] += row["n"]
        likert_sum[key] += row["total"]
        current_min = likert_min.get(key)
        current_max = likert_max.get(key)
        value = row["likert_value"]
        likert_min[key] = value if current_min is None else min(current_min, value)
        likert_max[key] = value if current_max is None else max(current_max, value)

    pos_counts: dict[tuple[str, str, int], int] = defaultdict(int)
    for row in rows(
        conn,
        """
        SELECT question_id, factor_id, rank_position, COUNT(*) AS n
        FROM rank_positions
        GROUP BY question_id, factor_id, rank_position
        """,
    ):
        pos_counts[(row["question_id"], row["factor_id"], row["rank_position"])] = row["n"]

    rank_people = {
        row["question_id"]: (row["people"], row["nrows"])
        for row in rows(
            conn,
            """
            SELECT question_id, COUNT(DISTINCT respondent_id) AS people, COUNT(*) AS nrows
            FROM rank_positions
            GROUP BY question_id
            """,
        )
    }
    w5_tipos: dict[tuple[str, str], list[str]] = defaultdict(list)
    for row in rows(
        conn,
        """
        SELECT question_id, factor_id, forum_tipo
        FROM sim_rank_bias
        WHERE weight = 5
        ORDER BY question_id, factor_id, forum_tipo
        """,
    ):
        w5_tipos[(row["question_id"], row["factor_id"])].append(row["forum_tipo"])

    rank1_w5 = {
        (row["question_id"], row["factor_id"]): row["n"]
        for row in rows(
            conn,
            """
            SELECT rp.question_id, rp.factor_id, COUNT(*) AS n
            FROM rank_positions rp
            JOIN roster r ON r.respondent_id = rp.respondent_id
            JOIN sim_rank_bias b
              ON b.forum_tipo = r.forum_tipo
             AND b.question_id = rp.question_id
             AND b.factor_id = rp.factor_id
             AND b.weight = 5
            WHERE rp.rank_position = 1
            GROUP BY rp.question_id, rp.factor_id
            """,
        )
    }
    bias_questions = {
        row["question_id"]
        for row in rows(conn, "SELECT DISTINCT question_id FROM sim_rank_bias")
    }
    w5_table = rows(
        conn,
        """
        SELECT b.forum_tipo, b.question_id, b.factor_id, b.weight, f.factor_label
        FROM sim_rank_bias b
        JOIN question_factors f
          ON f.question_id = b.question_id
         AND f.factor_id = b.factor_id
        WHERE b.weight = 5
        ORDER BY b.question_id, b.forum_tipo, b.factor_id
        """,
    )
    weight_counts = rows(
        conn,
        "SELECT weight, COUNT(*) AS n FROM sim_rank_bias GROUP BY weight ORDER BY weight",
    )
    bias_coverage = rows(
        conn,
        """
        WITH expected AS (
          SELECT r.forum_tipo, f.question_id, f.factor_id
          FROM roster r
          JOIN questions q
            ON q.sector_id = r.instrument_sector_id
           AND q.qtype = 'rank'
          JOIN question_factors f ON f.question_id = q.question_id
          GROUP BY r.forum_tipo, f.question_id, f.factor_id
        )
        SELECT
          (SELECT COUNT(*) FROM expected) AS expected_rows,
          (SELECT COUNT(*) FROM sim_rank_bias) AS bias_rows,
          (
            SELECT COUNT(*)
            FROM expected e
            JOIN sim_rank_bias b
              USING (forum_tipo, question_id, factor_id)
          ) AS matched,
          (
            SELECT COUNT(*)
            FROM expected e
            LEFT JOIN sim_rank_bias b
              USING (forum_tipo, question_id, factor_id)
            WHERE b.factor_id IS NULL
          ) AS missing_bias,
          (
            SELECT COUNT(*)
            FROM sim_rank_bias b
            LEFT JOIN expected e
              USING (forum_tipo, question_id, factor_id)
            WHERE e.factor_id IS NULL
          ) AS extra_bias,
          (SELECT COUNT(*) FROM sim_rank_bias WHERE weight NOT IN (1, 5)) AS other_weights,
          (
            SELECT COUNT(*) FROM (
              SELECT forum_tipo, question_id
              FROM sim_rank_bias
              WHERE weight = 5
              GROUP BY forum_tipo, question_id
              HAVING COUNT(*) != 1
            )
          ) AS not_exactly_one_w5
        """,
    )[0]

    cost_values: dict[tuple[str, str], list[int]] = defaultdict(list)
    cost_by_size: dict[str, list[int]] = defaultdict(list)
    all_costs: list[int] = []
    for row in rows(
        conn,
        """
        SELECT c.question_id, r.size_label, c.cost_mxn
        FROM rank_costs c
        JOIN roster r ON r.respondent_id = c.respondent_id
        """,
    ):
        cost_values[(row["question_id"], row["size_label"])].append(row["cost_mxn"])
        cost_by_size[row["size_label"]].append(row["cost_mxn"])
        all_costs.append(row["cost_mxn"])

    people_cost_counts = rows(
        conn,
        """
        SELECT n_costs, COUNT(*) AS people
        FROM (
          SELECT r.respondent_id, COUNT(c.question_id) AS n_costs
          FROM roster r
          LEFT JOIN rank_costs c ON c.respondent_id = r.respondent_id
          GROUP BY r.respondent_id
        )
        GROUP BY n_costs
        ORDER BY n_costs
        """,
    )
    orphan_options = scalar(
        conn,
        """
        SELECT COUNT(*)
        FROM answers a
        LEFT JOIN question_options o
          ON o.question_id = a.question_id
         AND o.option_value = a.option_value
        WHERE a.option_value IS NOT NULL
          AND o.option_value IS NULL
        """,
    )
    orphan_factors = scalar(
        conn,
        """
        SELECT COUNT(*)
        FROM rank_positions p
        LEFT JOIN question_factors f
          ON f.question_id = p.question_id
         AND f.factor_id = p.factor_id
        WHERE f.factor_id IS NULL
        """,
    )

    return {
        "meta_rows": meta_rows,
        "meta": meta,
        "tables": tables,
        "views": views,
        "indexes": indexes,
        "schema": schema,
        "n_roster": n_roster,
        "n_answers": n_answers,
        "n_rank_rows": n_rank_rows,
        "n_costs": n_costs,
        "n_questions": n_questions,
        "n_options": n_options,
        "n_factors": n_factors,
        "n_bias": n_bias,
        "empty_applicable": empty_applicable,
        "zero_row_questions": zero_row_questions,
        "by_level": by_level,
        "by_sector_q": by_sector_q,
        "by_qtype": by_qtype,
        "by_level_qtype": by_level_qtype,
        "by_sector_qtype": by_sector_qtype,
        "by_block": by_block,
        "by_source": by_source,
        "source_by_question": source_by_question,
        "by_forum_sector": by_forum_sector,
        "by_cross": by_cross,
        "forum_vs_instrument": forum_vs_instrument,
        "fit_census": fit_census,
        "roster_rows": roster_rows,
        "sizes": sizes,
        "sectors_for_instrument": sectors_for_instrument,
        "questions": questions,
        "options_by_q": options_by_q,
        "factors_by_q": factors_by_q,
        "option_source": option_source,
        "option_forum": option_forum,
        "answer_n": answer_n,
        "likert_cells": likert_cells,
        "likert_sum": likert_sum,
        "likert_n": likert_n,
        "likert_min": likert_min,
        "likert_max": likert_max,
        "pos_counts": pos_counts,
        "rank_people": rank_people,
        "w5_tipos": w5_tipos,
        "rank1_w5": rank1_w5,
        "bias_questions": bias_questions,
        "w5_table": w5_table,
        "weight_counts": weight_counts,
        "bias_coverage": bias_coverage,
        "cost_values": cost_values,
        "cost_by_size": cost_by_size,
        "all_costs": all_costs,
        "people_cost_counts": people_cost_counts,
        "orphan_options": orphan_options,
        "orphan_factors": orphan_factors,
    }


def sanity(data: dict) -> None:
    if data["orphan_options"] or data["orphan_factors"]:
        raise SystemExit(
            "Hay respuestas o rankings cuyo código no está en el catálogo. "
            f"opciones huerfanas={data['orphan_options']} factores huerfanos={data['orphan_factors']}"
        )
    if sum(row["n"] for row in data["by_forum_sector"]) != data["n_roster"]:
        raise SystemExit("El conteo por forum_sector no suma el padrón.")
    if sum(row["n"] for row in data["by_source"]) != data["n_answers"]:
        raise SystemExit("El conteo por source no suma answers.")
    if sum(row["n"] for row in data["by_qtype"]) != data["n_questions"]:
        raise SystemExit("El conteo por tipo no suma questions.")
    option_totals: dict[str, int] = defaultdict(int)
    for (qid, _option), sources in data["option_source"].items():
        option_totals[qid] += sum(sources.values())
    for question in data["questions"]:
        if question["qtype"] != "single_select":
            continue
        if option_totals[question["question_id"]] != data["answer_n"].get(question["question_id"], 0):
            raise SystemExit(f"Las opciones no suman las respuestas de {question['question_id']}.")
    rank_total = 0
    for key, count in data["pos_counts"].items():
        rank_total += count
    if rank_total != data["n_rank_rows"]:
        raise SystemExit("Las posiciones de ranking no suman rank_positions.")
    if len(data["all_costs"]) != data["n_costs"]:
        raise SystemExit("Los costos cargados no suman rank_costs.")


class Report(FPDF):
    def __init__(self, fonts: tuple[str, str, str, str]):
        super().__init__(format="A4", unit="mm")
        regular, bold, italic, bold_italic = fonts
        self.add_font("Body", "", regular)
        self.add_font("Body", "B", bold)
        self.add_font("Body", "I", italic)
        self.add_font("Body", "BI", bold_italic)
        self.set_margins(12, 12, 12)
        self.set_auto_page_break(True, margin=14)
        self.section_title = ""
        self.index_page = None
        self.alias_nb_pages()
        self.set_title("Analítica íntegra del Foro Puebla x Puebla")
        self.set_author("Generado desde foro-puebla-120.sqlite")
        self.set_creator("scripts/report_foro_analytics_pdf.py")
        self.set_subject(
            "Padrón del foro y simulación sembrada. Documento para sistemas RAG."
        )
        if hasattr(self, "set_lang"):
            self.set_lang("es-MX")

    def header(self) -> None:
        if self.page_no() == 1:
            return
        self.set_font("Body", "", 8)
        self.set_text_color(70, 78, 90)
        self.cell(
            0,
            4,
            "Foro Puebla x Puebla  ·  Analítica íntegra  ·  Fuera del padrón, simulación sembrada",
            align="L",
            new_x="LMARGIN",
            new_y="NEXT",
        )
        self.ln(1.2)
        self.set_draw_color(28, 58, 92)
        self.set_line_width(0.3)
        y = self.get_y()
        self.line(self.l_margin, y, self.w - self.r_margin, y)
        self.ln(2.4)
        self.set_line_width(0.2)
        self.set_text_color(20, 24, 28)

    def footer(self) -> None:
        self.set_y(-12)
        self.set_font("Body", "", 8)
        self.set_text_color(70, 78, 90)
        self.cell(0, 8, f"Página {self.page_no()} de {{nb}}", align="C", new_x="LMARGIN", new_y="TOP")
        self.set_text_color(20, 24, 28)

    def ensure_space(self, height: float) -> None:
        if self.get_y() + height > self.page_break_trigger:
            self.add_page()

    def h1(self, text: str) -> None:
        self.add_page()
        self.section_title = text
        self.start_section(text, level=0)
        self.set_text_color(28, 58, 92)
        self.set_font("Body", "B", 15)
        self.set_x(self.l_margin)
        self.multi_cell(0, 7, text, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(28, 58, 92)
        self.set_line_width(0.4)
        y = self.get_y()
        self.line(self.l_margin, y, self.w - self.r_margin, y)
        self.ln(3)
        self.set_line_width(0.2)
        self.set_text_color(20, 24, 28)

    def h2(self, text: str) -> None:
        self.ensure_space(18)
        self.ln(1.5)
        self.start_section(text, level=1)
        self.set_text_color(28, 58, 92)
        self.set_font("Body", "B", 12)
        self.set_x(self.l_margin)
        self.multi_cell(0, 6, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)
        self.set_text_color(20, 24, 28)

    def h3(self, text: str) -> None:
        self.ensure_space(16)
        self.set_text_color(36, 48, 64)
        self.set_font("Body", "B", 10)
        self.set_x(self.l_margin)
        self.multi_cell(0, 5, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(0.6)
        self.set_text_color(20, 24, 28)

    def p(self, text: str, size: float = 10) -> None:
        self.set_x(self.l_margin)
        self.set_font("Body", "", size)
        self.set_text_color(20, 24, 28)
        self.multi_cell(0, size * 0.48, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(1.2)

    def tight(self, text: str, size: float = 8) -> None:
        self.set_x(self.l_margin)
        self.set_font("Body", "", size)
        self.set_text_color(20, 24, 28)
        self.multi_cell(0, size * 0.46, text, new_x="LMARGIN", new_y="NEXT")

    def note(self, text: str) -> None:
        self.set_font("Body", "", 9)
        self.set_fill_color(255, 244, 230)
        self.set_draw_color(168, 86, 24)
        self.set_text_color(40, 28, 16)
        self.set_x(self.l_margin)
        self.multi_cell(0, 4.4, text, border=1, fill=True, new_x="LMARGIN", new_y="NEXT")
        self.ln(2.2)
        self.set_text_color(20, 24, 28)

    def sql_block(self, text: str) -> None:
        self.set_font("Courier", "", 7)
        self.set_text_color(30, 36, 44)
        self.set_x(self.l_margin)
        self.multi_cell(0, 3.3, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(1.5)
        self.set_text_color(20, 24, 28)

    def write_table(
        self,
        headers: list[str],
        data_rows: list[list[str]],
        weights: list[float],
        size: float = 7,
    ) -> None:
        if not data_rows:
            return
        self.set_font("Body", "", size)
        self.set_text_color(20, 24, 28)
        total = sum(weights)
        widths_mm = [self.epw * weight / total for weight in weights]
        sample = [headers] + data_rows
        wrap = WrapMode.WORD
        for record in sample:
            for text, width in zip(record, widths_mm):
                available = width - 1.3
                for token in str(text).split():
                    if self.get_string_width(token) > available:
                        wrap = WrapMode.CHAR
                        break
                if wrap == WrapMode.CHAR:
                    break
            if wrap == WrapMode.CHAR:
                break
        face = FontFace(
            emphasis="BOLD",
            color=(255, 255, 255),
            fill_color=(28, 58, 92),
            size_pt=size,
        )
        line_height = max(3.15, self.font_size * 1.28)
        with self.table(
            width=self.epw,
            col_widths=tuple(weights),
            headings_style=face,
            line_height=line_height,
            text_align="LEFT",
            v_align="TOP",
            padding=0.45,
            wrapmode=wrap,
            repeat_headings=1,
            borders_layout="ALL",
            cell_fill_color=(246, 248, 250),
            cell_fill_mode=TableCellFillMode.ROWS,
        ) as table:
            header = table.row()
            for item in headers:
                header.cell(str(item))
            for record in data_rows:
                body = table.row()
                for item in record:
                    body.cell(str(item))
        self.ln(2.2)


def display_fit(value: str) -> str:
    if value == "":
        return "(cadena vacía)"
    return value


def source_text(sources: dict[str, int]) -> str:
    if not sources:
        return "no aplica"
    order = {"roster": 0, "rule": 1, "simulated": 2}
    items = sorted(sources.items(), key=lambda item: (order.get(item[0], 9), item[0]))
    if len(items) == 1:
        return items[0][0]
    return "; ".join(f"{name}: {count}" for name, count in items)


def question_sources(data: dict, question_id: str) -> str:
    grouped: dict[str, int] = defaultdict(int)
    for row in data["source_by_question"]:
        if row["question_id"] == question_id:
            grouped[row["source"]] += row["n"]
    return source_text(grouped)


def universe(data: dict, question: sqlite3.Row) -> tuple[int, str]:
    if question["level"] == "n1":
        return data["n_roster"], "las personas del padrón, porque la pregunta es de nivel 1"
    sector = question["sector_id"] or ""
    count = sum(
        1
        for row in data["roster_rows"]
        if row["instrument_sector_id"] == sector
    )
    return count, f"personas con instrument_sector_id = {sector}"


def write_cover(pdf: Report, data: dict, generated: str, db_path: Path) -> None:
    pdf.add_page()
    pdf.start_section("1. Portada", level=0)
    pdf.section_title = "1. Portada"
    pdf.set_text_color(28, 58, 92)
    pdf.set_font("Body", "B", 11)
    pdf.cell(0, 6, "FORO PUEBLA X PUEBLA", align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    pdf.set_font("Body", "B", 18)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(
        0,
        8,
        "Analítica íntegra de la base para sistemas RAG",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(1)
    pdf.set_text_color(20, 24, 28)
    pdf.set_font("Body", "", 11)
    event = data["meta"].get("event", "")
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5.5, event, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    pdf.set_font("Body", "", 10)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(
        0,
        5,
        f"Base de datos (solo lectura): {db_path}",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(
        0,
        5,
        f"Fecha de generación: {generated}",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(
        0,
        5,
        "Reconstrucción: scripts/report_foro_analytics_pdf.py. Cada conteo de este PDF sale de una consulta a esa base.",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(2)
    note = data["meta"].get("pdf_note", "")
    model = data["meta"].get("response_model", "")
    seed = data["meta"].get("seed", "")
    respondents = data["meta"].get("respondents", "")
    pdf.note(
        "AVISO PARA UN RAG. El padrón es la distribución del foro. El resto es simulación sembrada.\n\n"
        f"sim_meta.pdf_note, copiado de la tabla: {note}\n"
        f"sim_meta.respondents, copiado de la tabla: {respondents}. "
        f"La consulta COUNT(*) de roster devuelve {data['n_roster']}.\n"
        f"sim_meta.response_model, copiado de la tabla: {model}. "
        f"sim_meta.seed, copiado de la tabla: {seed}.\n\n"
        "N1-01 (tamaño) y N1-02 (sector del instrumento, source_id F0.2) salen del padrón: source = roster. "
        "El eslabón de nivel 2 es un mapa determinista desde forum_tipo hacia la opción más cercana del instrumento. "
        "Cuando esa opción no existe, fit_notes guarda el ajuste forzado. "
        "Alimentos se pliega en el sector de instrumento agroindustria. "
        "Gastronomía se pliega en turismo. tics-startups no tiene personas en el padrón.\n\n"
        "Todo lo demás, incluidos rankings, Likert, la cifra en pesos y el resto de las opciones, es simulación sembrada. "
        "La política completa está en la sección 3, clave answer_policy.\n\n"
        "Un lugar 1 no es un hallazgo de mercado. rank_position = 1 significa mayor dolor dentro del ranking simulado. "
        "Si ese factor tiene weight 5 en sim_rank_bias para el forum_tipo de la persona, el lugar 1 está plantado: "
        "weight 5 es el factor preferido y weight 1 es el resto.\n\n"
        "cost_mxn es una sola cifra anual en pesos por el ranking completo. No es el costo del factor que quedó en lugar 1. "
        "No hay disposición de pago por un producto. "
        "F0.2 no conserva Alimentos ni Gastronomía como categorías propias del instrumento."
    )
    pdf.set_font("Body", "B", 11)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5.5, "Orden del documento", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)
    pdf.set_font("Body", "", 10)
    for line in (
        "1. Portada.",
        "2. Diccionario de tablas y reglas de lectura.",
        "3. sim_meta, clave por clave.",
        "4. Cobertura.",
        "5. Padrón.",
        "6. Catálogo de preguntas.",
        "7. Selección única, con todas las opciones.",
        "8. Likert, con la escala 1 a 7 y el corte por tamaño.",
        "9. Rankings, etiquetas completas y sesgo weight 5.",
        "10. Costos en pesos, por tamaño.",
        "11. Índice: si un RAG pregunta X, mira la sección Y.",
    ):
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(0, 4.8, line, new_x="LMARGIN", new_y="NEXT")


def write_dictionary(pdf: Report, data: dict) -> None:
    pdf.h1("2. Diccionario y reglas de lectura")
    pdf.p(
        "Esta sección describe el esquema que devolvió sqlite_master y PRAGMA table_info. "
        "Los nombres de tablas y columnas se copian de la base. La glosa dice cómo leerlos."
    )
    pdf.h2("Tablas y columnas")
    for table in (
        "sim_meta",
        "roster",
        "questions",
        "question_options",
        "question_factors",
        "answers",
        "rank_positions",
        "rank_costs",
        "sim_rank_bias",
    ):
        info = data["schema"].get(table)
        if not info:
            continue
        pdf.h3(table)
        body = []
        for column in info:
            gloss = COLUMN_GLOSS.get(f"{table}.{column['name']}", "Sin glosa adicional.")
            flags = []
            if column["pk"]:
                flags.append("clave primaria")
            if column["notnull"]:
                flags.append("NOT NULL")
            if column["dflt_value"] is not None:
                flags.append(f"default {column['dflt_value']}")
            extra = ", ".join(flags) if flags else "sin bandera extra"
            body.append([column["name"], column["type"], extra, gloss])
        pdf.write_table(
            ["Columna", "Tipo", "Banderas", "Cómo leerla"],
            body,
            [36, 18, 32, 100],
            size=7,
        )
    pdf.h2("Vistas")
    for view in data["views"]:
        pdf.h3(view["name"])
        pdf.p("Definición SQL guardada en sqlite_master:", size=9)
        pdf.sql_block(view["sql"])
    if data["indexes"]:
        pdf.h2("Índices")
        pdf.write_table(
            ["Índice", "Tabla", "SQL"],
            [[row["name"], row["tbl_name"], row["sql"]] for row in data["indexes"]],
            [42, 32, 112],
            size=7,
        )
    pdf.h2("Qué se puede afirmar")
    pdf.p(
        "Se puede afirmar un conteo, un mínimo, un máximo, un promedio o una mediana cuando este PDF lo muestra "
        "y la sección dice de qué consulta sale. Se puede decir qué filas tienen source roster, rule o simulated. "
        "Se puede describir la distribución propuesta del padrón por forum_sector, forum_tipo y size_label. "
        "Se puede decir qué factor tiene weight 5 para cada forum_tipo, porque eso está en sim_rank_bias."
    )
    pdf.h2("Qué no se puede afirmar")
    pdf.p(
        "No se puede extrapolar esta base a Puebla, al estado ni a un censo oficial. "
        "sim_meta.pdf_note dice que es una propuesta de distribución, no cifras oficiales. "
        "No se puede tratar la simulación como si fueran respuestas observadas."
    )
    pdf.p(
        "No se puede leer cost_mxn como el costo del factor que quedó en lugar 1. "
        "La cifra es una sola cantidad anual, en pesos, por el ranking completo, y está simulada. "
        "No se puede afirmar disposición de pago por un producto. "
        "Un Likert sobre cuota o pago por uso sigue siendo simulación sembrada, no una disposición observada."
    )
    pdf.p(
        "No se puede decir que F0.2 (N1-02, source_id F0.2) conserve Alimentos o Gastronomía. "
        "Esas categorías viven en forum_sector. En el instrumento, Alimentos cae en agroindustria y Gastronomía cae en turismo. "
        "La etiqueta de la opción agroindustria menciona alimentos, y la de turismo menciona gastronomía; "
        "eso no las deja como option_value propios."
    )
    pdf.p(
        "No se puede tratar un lugar 1 como hallazgo de mercado. "
        "Si el factor coincide con weight 5 para el forum_tipo de quien lo puso en lugar 1, el lugar está plantado. "
        "Weight 5 es el factor preferido. Weight 1 es el resto."
    )
    pdf.p(
        "No se puede hablar de resultados de tics-startups. Ese sector del instrumento no tiene personas en el padrón. "
        "Sus preguntas están en el catálogo y sus conteos de respuesta son cero."
    )
    pdf.p(
        "Nivel 1 aplica a todo el padrón. Nivel 2 aplica solo a las personas cuyo instrument_sector_id es el sector_id de la pregunta. "
        "N1-01 y N1-02 tienen source roster. El eslabón de nivel 2 y otras filas marcadas rule son el mapa determinista, no una opinión recogida en campo. "
        "fit_notes registra el ajuste cuando la opción del instrumento no existe o hay que forzar el acomodo. "
        "La sección 7 muestra, opción por opción, si el source es roster, rule, simulated o una mezcla."
    )


def write_meta(pdf: Report, data: dict) -> None:
    pdf.h1("3. sim_meta íntegro")
    pdf.p(
        "Cada fila de la tabla sim_meta va abajo, en el orden de la tabla (rowid). "
        "El valor se copia completo. No hay claves omitidas."
    )
    pdf.write_table(
        ["Clave", "Valor"],
        [[row["key"], row["value"]] for row in data["meta_rows"]],
        [40, 146],
        size=8,
    )
    pdf.p(
        f"Conteo de claves por consulta: {len(data['meta_rows'])}. "
        "Un RAG que cite el modelo o la semilla debe usar response_model y seed de esta tabla, no un valor recordado."
    )


def write_coverage(pdf: Report, data: dict) -> None:
    pdf.h1("4. Cobertura")
    pdf.p(
        "Pregunta vacía, para esta sección, significa pregunta cuyo universo aplicable es mayor que cero y aun así no tiene filas. "
        "El universo de nivel 1 es el padrón completo. El universo de nivel 2 es el número de personas con el mismo instrument_sector_id. "
        "En rank se cuentan filas de rank_positions. En selección única y Likert se cuentan filas de answers."
    )
    pdf.write_table(
        ["Consulta", "Resultado"],
        [
            ["Personas en roster", str(data["n_roster"])],
            ["Filas en answers", str(data["n_answers"])],
            ["Filas en rank_positions", str(data["n_rank_rows"])],
            ["Filas en rank_costs (rankings con costo)", str(data["n_costs"])],
            [
                "Preguntas vacías (universo aplicable > 0 y cero filas)",
                str(data["empty_applicable"]),
            ],
            ["Preguntas en el catálogo", str(data["n_questions"])],
            ["Filas en question_options", str(data["n_options"])],
            ["Filas en question_factors", str(data["n_factors"])],
            ["Filas en sim_rank_bias", str(data["n_bias"])],
            [
                "Preguntas del catálogo sin filas de respuesta ni de ranking",
                str(len(data["zero_row_questions"])),
            ],
        ],
        [120, 66],
        size=8,
    )
    if data["zero_row_questions"]:
        pdf.p(
            "Esas preguntas sin filas no entran al conteo de vacías porque su universo aplicable es cero. "
            "Están en el catálogo y se listan completas en la sección 6. Aquí va el resultado de la consulta:"
        )
        pdf.write_table(
            ["question_id", "qtype", "sector_id", "Título"],
            [
                [row["question_id"], row["qtype"], row["sector_id"] or "nulo", row["title"]]
                for row in data["zero_row_questions"]
            ],
            [28, 28, 36, 94],
            size=7,
        )
    else:
        pdf.p("La consulta de preguntas sin ninguna fila devolvió cero.")

    pdf.h2("Respuestas por source")
    pdf.write_table(
        ["source", "Filas"],
        [[row["source"], str(row["n"])] for row in data["by_source"]],
        [40, 30],
        size=8,
    )
    pdf.h2("Preguntas por nivel")
    pdf.write_table(
        ["level", "Preguntas"],
        [[row["level"], str(row["n"])] for row in data["by_level"]],
        [30, 30],
        size=8,
    )
    pdf.h2("Preguntas por sector del instrumento")
    pdf.p("El sector nulo corresponde a nivel 1, donde sector_id no trae valor.")
    pdf.write_table(
        ["sector_id", "Preguntas"],
        [[row["sector_id"], str(row["n"])] for row in data["by_sector_q"]],
        [50, 30],
        size=8,
    )
    pdf.h2("Preguntas por tipo")
    pdf.write_table(
        ["qtype", "Preguntas"],
        [[row["qtype"], str(row["n"])] for row in data["by_qtype"]],
        [40, 30],
        size=8,
    )
    pdf.h2("Preguntas por nivel y tipo")
    pdf.write_table(
        ["level", "qtype", "Preguntas"],
        [[row["level"], row["qtype"], str(row["n"])] for row in data["by_level_qtype"]],
        [24, 36, 30],
        size=8,
    )
    pdf.h2("Preguntas por sector del instrumento y tipo")
    pdf.write_table(
        ["sector_id", "qtype", "Preguntas"],
        [[row["sector_id"], row["qtype"], str(row["n"])] for row in data["by_sector_qtype"]],
        [48, 36, 28],
        size=8,
    )
    pdf.h2("Preguntas por bloque, nivel y tipo")
    pdf.write_table(
        ["block", "level", "qtype", "Preguntas"],
        [
            [row["block"], row["level"], row["qtype"], str(row["n"])]
            for row in data["by_block"]
        ],
        [48, 18, 36, 24],
        size=7.5,
    )


def write_roster(pdf: Report, data: dict) -> None:
    pdf.h1("5. Padrón")
    pdf.p(
        "El padrón es la distribución propuesta del foro, no un censo. "
        "Las tablas de esta sección incluyen todas las combinaciones que devolvió la consulta. "
        "Una cadena vacía de fit_notes se imprime como (cadena vacía) para que no se confunda con una celda perdida."
    )
    pdf.h2("Conteo por forum_sector")
    pdf.write_table(
        ["forum_sector", "n"],
        [[row["forum_sector"], str(row["n"])] for row in data["by_forum_sector"]],
        [70, 24],
        size=8,
    )
    pdf.p(f"Suma de n: {sum(row['n'] for row in data['by_forum_sector'])}.")

    def sector_n(name: str) -> int:
        for row in data["by_forum_sector"]:
            if row["forum_sector"] == name:
                return row["n"]
        return 0

    def folded(forum_sector: str, instrument: str) -> int:
        total = 0
        for row in data["forum_vs_instrument"]:
            if row["forum_sector"] == forum_sector and row["instrument_sector_id"] == instrument:
                total += row["respondents"]
        return total

    alimentos = sector_n("Alimentos")
    gastronomia = sector_n("Gastronomía")
    tics_forum = sector_n("tics-startups") + sector_n("TICs") + sector_n("TICS")
    pdf.p(
        f"Alimentos tiene {alimentos} personas en forum_sector. "
        f"De ellas, {folded('Alimentos', 'agroindustria')} tienen instrument_sector_id agroindustria. "
        f"Gastronomía tiene {gastronomia} personas en forum_sector. "
        f"De ellas, {folded('Gastronomía', 'turismo')} tienen instrument_sector_id turismo. "
        f"No hay filas de roster con forum_sector tics-startups (conteo buscado: {tics_forum}). "
        f"Personas con instrument_sector_id tics-startups: "
        f"{sum(1 for row in data['roster_rows'] if row['instrument_sector_id'] == 'tics-startups')}."
    )
    n1_values = [
        option["option_value"]
        for option in data["options_by_q"].get("N1-02", [])
    ]
    pdf.p(
        "option_value de N1-02, en el orden de la tabla question_options: "
        + ", ".join(n1_values)
        + ". Entre esos códigos no están Alimentos ni Gastronomía."
    )

    pdf.h2("forum_sector por forum_tipo por size_label")
    ordered = sorted(
        data["by_cross"],
        key=lambda row: (
            row["forum_sector"],
            row["forum_tipo"],
            size_key(row["size_band"], row["size_label"]),
        ),
    )
    pdf.write_table(
        ["forum_sector", "forum_tipo", "size_label", "size_band", "n"],
        [
            [
                row["forum_sector"],
                row["forum_tipo"],
                row["size_label"],
                row["size_band"],
                str(row["n"]),
            ]
            for row in ordered
        ],
        [34, 78, 24, 22, 14],
        size=7,
    )
    pdf.p(f"Combinaciones con n mayor que cero: {len(ordered)}. Suma de n: {sum(row['n'] for row in ordered)}.")

    pdf.h2("Vista v_forum_vs_instrument")
    pdf.p("La vista agrupa el padrón por forum_sector e instrument_sector_id. La columna respondents es el conteo de la vista.")
    pdf.write_table(
        ["forum_sector", "instrument_sector_id", "respondents"],
        [
            [row["forum_sector"], row["instrument_sector_id"], str(row["respondents"])]
            for row in data["forum_vs_instrument"]
        ],
        [55, 55, 30],
        size=8,
    )

    pdf.h2("Censo de fit_notes")
    pdf.write_table(
        ["fit_notes", "n"],
        [[display_fit(row["fit_notes"]), str(row["n"])] for row in data["fit_census"]],
        [150, 20],
        size=7,
    )
    pdf.p(f"Suma de n: {sum(row['n'] for row in data['fit_census'])}.")
    pdf.p(
        "Lectura de los códigos, sin cambiar el valor almacenado: "
        "alimentos_collapses_into_agroindustria y forum_sector_collapses_into_agroindustria describen el pliegue de Alimentos; "
        "bebidas_share_processed_food_option y bakery_shares_basic_processing describen acomodos de bebidas y panificación; "
        "gastronomia_collapses_into_turismo y forum_sector_collapses_into_turismo describen el pliegue de Gastronomía; "
        "hospital_not_in_instrument dice que el hospital no está en el instrumento; "
        "clinic_forced_to_ivd dice que la clínica se forzó a IVD; "
        "activity_binary_is_manufactura_or_kisa dice que la actividad se redujo al binario manufactura o KISA; "
        "los demás códigos se leen por su texto en inglés, que es el valor guardado."
    )

    pdf.h2("Listado de las personas del padrón")
    pdf.p(
        f"Filas: {len(data['roster_rows'])}. Orden: forum_sector, forum_tipo, size_label, respondent_id."
    )
    pdf.write_table(
        [
            "respondent_id",
            "forum_sector",
            "forum_tipo",
            "size_label",
            "size_band",
            "instrument_sector_id",
            "fit_notes",
        ],
        [
            [
                row["respondent_id"],
                row["forum_sector"],
                row["forum_tipo"],
                row["size_label"],
                row["size_band"],
                row["instrument_sector_id"],
                display_fit(row["fit_notes"]),
            ]
            for row in data["roster_rows"]
        ],
        [16, 24, 36, 16, 14, 28, 52],
        size=6.5,
    )


def write_catalog(pdf: Report, data: dict) -> None:
    pdf.h1("6. Catálogo de preguntas")
    pdf.p(
        "Todas las preguntas, en orden de question_id. "
        "sector nulo significa que sector_id está vacío (nivel 1). "
        "El enunciado completo va en las secciones 7, 8 y 9, según el tipo."
    )
    pdf.write_table(
        ["question_id", "source_id", "nivel", "sector", "tipo", "título"],
        [
            [
                row["question_id"],
                row["source_id"] or "nulo",
                row["level"],
                row["sector_id"] or "nulo",
                row["qtype"],
                row["title"],
            ]
            for row in data["questions"]
        ],
        [24, 42, 12, 32, 24, 52],
        size=6.5,
    )
    pdf.p(f"Filas del catálogo: {len(data['questions'])}.")


def write_question_heading(pdf: Report, data: dict, question: sqlite3.Row) -> None:
    pdf.ensure_space(28)
    people, who = universe(data, question)
    answered = data["answer_n"].get(question["question_id"], 0)
    pdf.h3(
        f"{question['question_id']}  ·  {question['level']}  ·  "
        f"{question['sector_id'] or 'sector nulo'}  ·  {question['qtype']}"
    )
    pdf.p(
        f"source_id: {question['source_id'] or 'nulo'}. Bloque: {question['block'] or 'nulo'}. "
        f"Título: {question['title']}",
        size=8,
    )
    pdf.p(f"Enunciado: {question['prompt']}", size=8)
    pdf.p(
        f"Universo aplicable: {people} ({who}). Filas en answers: {answered}. "
        f"Source observado en answers: {question_sources(data, question['question_id'])}.",
        size=8,
    )


def write_single_select(pdf: Report, data: dict) -> None:
    pdf.h1("7. Selección única")
    pdf.p(
        "Cada pregunta single_select trae todas las opciones de question_options, también las que nadie eligió. "
        "n es el número de personas que eligieron esa opción. "
        "Si nadie la eligió, n es 0 y el source dice no aplica. "
        "Si una opción mezcla procedencias, el source trae el conteo de cada una. "
        "sin score significa option_score nulo. Un 0 en score es un puntaje guardado. "
        "El orden de las opciones es el de inserción en la base (rowid). "
        "Cada opción va en dos párrafos: primero los conteos y después la etiqueta completa, para que el texto se copie sin mezclar cifras dentro de la etiqueta."
    )
    pdf.p(
        "En nivel 2, el conteo se parte por forum_sector de las personas cuyo instrument_sector_id es el de la pregunta. "
        "Si ese sector no tiene personas, la línea de conteos no trae forum_sector y todas las n quedan en 0."
    )
    singles = [row for row in data["questions"] if row["qtype"] == "single_select"]
    current_group = None
    for question in singles:
        if question["level"] == "n1":
            group = "Nivel 1"
        else:
            group = f"Nivel 2 · {question['sector_id']}"
        if group != current_group:
            pdf.h2(group)
            current_group = group
        write_question_heading(pdf, data, question)
        forum_sectors: list[str] = []
        if question["level"] == "n2" and question["sector_id"]:
            forum_sectors = data["sectors_for_instrument"].get(question["sector_id"], [])
        options = data["options_by_q"].get(question["question_id"], [])
        if not options:
            pdf.p("Esta pregunta no tiene filas en question_options.")
            continue
        for option in options:
            key = (question["question_id"], option["option_value"])
            sources = data["option_source"].get(key, {})
            forums = data["option_forum"].get(key, {})
            total = sum(sources.values())
            parts = [
                f"opción {option['option_value']}",
                f"score {fmt_score(option['option_score'])}",
                f"n {total}",
                f"source {source_text(sources)}",
            ]
            for sector in forum_sectors:
                parts.append(f"{sector} {forums.get(sector, 0)}")
            pdf.ensure_space(18)
            pdf.tight(" | ".join(parts), size=8)
            pdf.tight(option["option_label"], size=8)
            pdf.ln(0.8)


def likert_record(data: dict, question_id: str, size_label: str, size_band: str) -> list[str]:
    key = (question_id, size_label)
    count = data["likert_n"].get(key, 0)
    if count == 0:
        stats = ["0", "sin filas", "sin filas", "sin filas"]
    else:
        stats = [
            str(count),
            str(data["likert_min"][key]),
            str(data["likert_max"][key]),
            fmt_mean(data["likert_sum"][key], count),
        ]
    cells = data["likert_cells"].get(key, {})
    values = [str(cells.get(point, 0)) for point in range(1, 8)]
    return [size_label, size_band, *stats, *values]


def write_likert(pdf: Report, data: dict) -> None:
    pdf.h1("8. Likert")
    pdf.p(
        "Cada pregunta likert_7 trae n, mínimo, máximo y promedio, más el conteo de cada valor del 1 al 7. "
        "El promedio es la suma de likert_value dividida entre n, con redondeo half-up a 4 decimales. "
        "Luego se parte por size_label. El renglón Todas junta a las personas que respondieron la pregunta. "
        "Un valor de la escala con conteo 0 se imprime como 0. Estas filas son simulación si su source es simulated; "
        "el source de cada pregunta está en el encabezado."
    )
    likerts = [row for row in data["questions"] if row["qtype"] == "likert_7"]
    headers = ["corte", "size_band", "n", "mín", "máx", "promedio", "1", "2", "3", "4", "5", "6", "7"]
    weights = [24, 18, 12, 12, 12, 18, 10, 10, 10, 10, 10, 10, 10]
    for question in likerts:
        write_question_heading(pdf, data, question)
        overall_cells: dict[int, int] = defaultdict(int)
        total_n = 0
        total_sum = 0
        seen_min = None
        seen_max = None
        body = []
        for size in data["sizes"]:
            key = (question["question_id"], size["size_label"])
            total_n += data["likert_n"].get(key, 0)
            total_sum += data["likert_sum"].get(key, 0)
            for point, count in data["likert_cells"].get(key, {}).items():
                overall_cells[point] += count
            if key in data["likert_min"]:
                seen_min = data["likert_min"][key] if seen_min is None else min(seen_min, data["likert_min"][key])
                seen_max = data["likert_max"][key] if seen_max is None else max(seen_max, data["likert_max"][key])
            body.append(
                likert_record(data, question["question_id"], size["size_label"], size["size_band"])
            )
        if total_n == 0:
            overall = ["Todas", "todos", "0", "sin filas", "sin filas", "sin filas"] + ["0"] * 7
        else:
            overall = [
                "Todas",
                "todos",
                str(total_n),
                str(seen_min),
                str(seen_max),
                fmt_mean(total_sum, total_n),
            ] + [str(overall_cells.get(point, 0)) for point in range(1, 8)]
        pdf.write_table(headers, [overall] + body, weights, size=6.5)


def write_rankings(pdf: Report, data: dict) -> None:
    pdf.h1("9. Rankings y sesgo plantado")
    pdf.p(
        "rank_position = 1 es el mayor dolor dentro del ranking. No es un hallazgo de mercado. "
        "La etiqueta del factor se imprime completa. "
        "P1, P2 y el resto son el conteo de personas que dejaron el factor en esa posición. "
        "La media es el rango medio: promedio aritmético de rank_position, redondeo half-up a 4 decimales. "
        "Si no hay filas, la media dice sin filas y los conteos de posición son 0."
    )
    pdf.p(
        "w5 dice sí cuando ese factor es el de weight 5 para al menos un forum_tipo. "
        "n w5 en P1 cuenta cuántas de las personas que lo pusieron en lugar 1 pertenecen a un forum_tipo cuyo weight, "
        "para ese mismo factor y esa misma pregunta, es 5. "
        "Cada factor trae la etiqueta completa en su propio párrafo y, debajo, los conteos en otra línea. "
        "ninguno significa que el factor no es el preferido de ningún tipo. "
        "sin filas en sim_rank_bias significa que la pregunta no tiene sesgo plantado."
    )
    coverage = data["bias_coverage"]
    pdf.h2("Cobertura de sim_rank_bias")
    pdf.p(
        "La consulta arma el conjunto esperado así: cada forum_tipo del padrón, cruzado con cada factor de las preguntas rank "
        "cuyo sector_id es el instrument_sector_id de ese tipo."
    )
    pdf.write_table(
        ["Medida", "Resultado"],
        [
            ["Filas esperadas", str(coverage["expected_rows"])],
            ["Filas en sim_rank_bias", str(coverage["bias_rows"])],
            ["Coincidencias de la llave forum_tipo + question_id + factor_id", str(coverage["matched"])],
            ["Esperadas sin fila de sesgo", str(coverage["missing_bias"])],
            ["Filas de sesgo fuera del conjunto esperado", str(coverage["extra_bias"])],
            ["Filas con weight distinto de 1 y de 5", str(coverage["other_weights"])],
            ["Pares forum_tipo + pregunta rank sin exactamente un weight 5", str(coverage["not_exactly_one_w5"])],
        ],
        [130, 30],
        size=8,
    )
    pdf.write_table(
        ["weight", "Filas"],
        [[fmt_score(row["weight"]), str(row["n"])] for row in data["weight_counts"]],
        [30, 30],
        size=8,
    )
    if (
        coverage["expected_rows"] == coverage["bias_rows"] == coverage["matched"]
        and coverage["missing_bias"] == 0
        and coverage["extra_bias"] == 0
        and coverage["other_weights"] == 0
        and coverage["not_exactly_one_w5"] == 0
    ):
        pdf.p(
            "Esas cifras cierran. Cada forum_tipo del padrón tiene, en cada pregunta rank de su sector de instrumento, "
            "exactamente un factor con weight 5 y el resto con weight 1. "
            "tics-startups no entra a sim_rank_bias porque no hay forum_tipo de ese sector en el padrón."
        )
    else:
        pdf.p(
            "Esas cifras no cierran con el padrón. Hay que usar los conteos de arriba y no asumir un sesgo completo."
        )

    pdf.h2("Mapa completo de weight 5")
    pdf.p(
        "Cada factor preferido plantado va en dos párrafos: la llave y, debajo, la etiqueta completa. "
        f"Filas: {len(data['w5_table'])}."
    )
    for row in data["w5_table"]:
        pdf.ensure_space(14)
        pdf.tight(
            f"{row['forum_tipo']} | {row['question_id']} | {row['factor_id']} | weight {fmt_score(row['weight'])}",
            size=8,
        )
        pdf.tight(row["factor_label"], size=8)
        pdf.ln(0.5)

    pdf.h2("Cada ranking")
    current_sector = None
    ranks = [row for row in data["questions"] if row["qtype"] == "rank"]
    for question in ranks:
        sector = question["sector_id"] or "sin sector"
        if sector != current_sector:
            pdf.h2(f"Sector {sector}")
            current_sector = sector
        people, nrows = data["rank_people"].get(question["question_id"], (0, 0))
        factors = data["factors_by_q"].get(question["question_id"], [])
        max_pos = 0
        for factor in factors:
            for position in range(1, 13):
                if data["pos_counts"].get((question["question_id"], factor["factor_id"], position), 0):
                    max_pos = max(max_pos, position)
        n_pos = max(len(factors), max_pos)
        write_question_heading(pdf, data, question)
        pdf.p(
            f"Personas con filas de ranking: {people}. Filas de rank_positions: {nrows}. "
            f"Factores en catálogo: {len(factors)}. Posiciones mostradas: {n_pos}.",
            size=8,
        )
        if n_pos == 0:
            pdf.p("Esta pregunta rank no tiene factores en question_factors.")
            continue
        for factor in factors:
            counts = []
            total_n = 0
            total_sum = 0
            for position in range(1, n_pos + 1):
                count = data["pos_counts"].get(
                    (question["question_id"], factor["factor_id"], position),
                    0,
                )
                counts.append(f"P{position}={count}")
                total_n += count
                total_sum += position * count
            tipos = data["w5_tipos"].get((question["question_id"], factor["factor_id"]), [])
            if tipos:
                flag = "sí"
                tipos_txt = "; ".join(tipos)
            elif question["question_id"] in data["bias_questions"]:
                flag = "no"
                tipos_txt = "ninguno"
            else:
                flag = "no"
                tipos_txt = "sin filas en sim_rank_bias"
            planted = data["rank1_w5"].get((question["question_id"], factor["factor_id"]), 0)
            pdf.ensure_space(16)
            pdf.tight(f"{factor['factor_id']}. {factor['factor_label']}", size=8)
            pdf.tight(
                "Posiciones: "
                + "; ".join(counts)
                + f". Rango medio: {fmt_mean(total_sum, total_n)}. "
                + f"Weight 5: {flag}. "
                + f"En lugar 1 y con weight 5 en su forum_tipo: {planted}. "
                + f"forum_tipo con weight 5: {tipos_txt}.",
                size=8,
            )
            pdf.ln(0.7)


def cost_stats(values: list[int]) -> list[str]:
    if not values:
        return ["0", "sin filas", "sin filas", "sin filas"]
    return [
        str(len(values)),
        fmt_mxn(min(values)),
        fmt_mxn(median_of(values)),
        fmt_mxn(max(values)),
    ]


def write_costs(pdf: Report, data: dict) -> None:
    pdf.h1("10. Costos en pesos")
    pdf.note(
        "ADVERTENCIA. cost_mxn es una cifra por ranking completo. Está simulada. "
        "No es el costo del factor en lugar 1. No es una cotización de maquinado ni una disposición de pago. "
        "La mediana es el valor central de los enteros ordenados; si n es par, es el promedio de los dos centrales. "
        "Cuando n es 0, mínimo, mediana y máximo dicen sin filas."
    )
    pdf.p("Filas de costo por persona, consulta sobre roster y rank_costs:")
    pdf.write_table(
        ["Filas de rank_costs por persona", "Personas"],
        [[str(row["n_costs"]), str(row["people"])] for row in data["people_cost_counts"]],
        [70, 30],
        size=8,
    )
    pdf.p(
        f"Todas las filas de rank_costs juntas: n = {len(data['all_costs'])}, "
        f"mínimo = {fmt_mxn(min(data['all_costs']) if data['all_costs'] else None)}, "
        f"mediana = {fmt_mxn(median_of(data['all_costs']))}, "
        f"máximo = {fmt_mxn(max(data['all_costs']) if data['all_costs'] else None)}. "
        "Esa junta mezcla preguntas distintas. Para leer un ranking hay que usar la tabla de abajo."
    )
    pdf.h2("Todas las filas, por size_label")
    pdf.p("n cuenta filas de rank_costs, no personas distintas. Una persona aporta una fila por cada ranking de su sector.")
    pdf.write_table(
        ["size_label", "size_band", "n", "mínimo", "mediana", "máximo"],
        [
            [size["size_label"], size["size_band"], *cost_stats(data["cost_by_size"].get(size["size_label"], []))]
            for size in data["sizes"]
        ],
        [28, 24, 16, 36, 40, 36],
        size=8,
    )
    pdf.h2("Cada pregunta rank, por size_label")
    ranks = [row for row in data["questions"] if row["qtype"] == "rank"]
    missing = [
        row["question_id"]
        for row in ranks
        if not any(data["cost_values"].get((row["question_id"], size["size_label"])) for size in data["sizes"])
    ]
    if missing:
        pdf.p(
            "Preguntas rank sin ninguna fila en rank_costs: " + ", ".join(missing) + ". "
            "Esas filas van en la tabla con n = 0."
        )
    body = []
    for question in ranks:
        for size in data["sizes"]:
            values = data["cost_values"].get((question["question_id"], size["size_label"]), [])
            body.append(
                [
                    question["question_id"],
                    size["size_label"],
                    size["size_band"],
                    *cost_stats(values),
                ]
            )
    pdf.write_table(
        ["question_id", "size_label", "size_band", "n", "mínimo", "mediana", "máximo"],
        body,
        [28, 24, 20, 14, 32, 34, 32],
        size=6.5,
    )
    pdf.p("El título de cada question_id está en la sección 6 y otra vez en la sección 9.")


def write_index(pdf: Report) -> None:
    pdf.h1("11. Índice para un RAG")
    pdf.index_page = pdf.page_no()
    pdf.p(
        "Si un RAG pregunta X, mira la sección Y. Los question_id se leen en la sección indicada, con la etiqueta completa y el conteo de la consulta.",
        size=9,
    )
    rows_index = [
        [
            "Qué es esta base y qué está simulado",
            "Sección 1 y sección 3. Citar pdf_note, answer_policy, response_model y seed tal como están en sim_meta.",
        ],
        [
            "¿Estos números describen a Puebla o al estado?",
            "Sección 2. No se puede extrapolar. El padrón es la distribución propuesta del foro.",
        ],
        [
            "Tamaño de la empresa",
            "Sección 5 (size_label y size_band) y sección 7, pregunta N1-01, source roster.",
        ],
        [
            "Sector del foro contra el sector del instrumento F0.2",
            "Sección 5, vista v_forum_vs_instrument, y sección 7, N1-02. F0.2 no trae Alimentos ni Gastronomía como option_value.",
        ],
        [
            "Alimentos contra agroindustria",
            "Sección 5: conteo de Alimentos, pliegue a instrument_sector_id agroindustria y fit_notes con alimentos. Sección 7: N2-AGRO-01 partido por forum_sector.",
        ],
        [
            "Gastronomía contra turismo",
            "Sección 5: conteo de Gastronomía, pliegue a turismo y fit_notes con gastronomia. Sección 7: N2-TUR-01, opción GAS.",
        ],
        [
            "Médico hospitalario",
            "Sección 5: fit_notes hospital_not_in_instrument y clinic_forced_to_ivd. Secciones 6 y 7: preguntas N2-MED.",
        ],
        [
            "tics-startups",
            "Sección 4: cero personas y las preguntas del catálogo sin filas. Sección 6: N2-TIC. No hay respuestas que interpretar.",
        ],
        [
            "Eslabón de nivel 2 y ajustes forzados",
            "Sección 5, censo de fit_notes. Sección 7, preguntas con source rule. El encabezado de cada pregunta dice el source observado.",
        ],
        [
            "Likert del 1 al 7",
            "Sección 8. El corte por size_label está en cada pregunta. El source va en el encabezado.",
        ],
        [
            "Lugar 1 o mayor dolor",
            "Sección 9. P1 es rank_position 1. Es el mayor dolor del ranking simulado.",
        ],
        [
            "Lugar 1 plantado",
            "Sección 9, mapa de weight 5 y la línea Weight 5 de cada factor. Sección 2. Si el factor es weight 5 para ese forum_tipo, no es hallazgo de mercado. Weight 5 es el preferido; weight 1 es el resto.",
        ],
        [
            "Cotización de maquinado",
            "Sección 7: N1-24 Cotizaciones perdidas, N2-METAL-03, N2-METAL-07 y N2-METAL-14. Sección 8: N1-39, cuota para laboratorio, centro de maquinado o sala limpia. Sección 9: N2-METAL-04, fricciones de maquinado, y N2-METAL-05 factor f5, volatilidad que erosiona el margen cotizado. Sección 10: la cifra en pesos no es el costo de ese factor.",
        ],
        [
            "Cifra anual en pesos",
            "Sección 10. Una cifra por ranking completo, simulada. No es el costo del lugar 1.",
        ],
        [
            "Disposición de pago por un producto",
            "Sección 2. No se puede afirmar con esta base.",
        ],
        [
            "Modelo y semilla",
            "Sección 3, claves response_model y seed.",
        ],
        [
            "Cobertura y preguntas sin filas",
            "Sección 4. Personas, filas de answers, filas de ranking, rankings con costo y preguntas vacías.",
        ],
        [
            "Catálogo de question_id",
            "Sección 6. source_id, nivel, sector, tipo y título.",
        ],
    ]
    pdf.write_table(
        ["Si un RAG pregunta", "Mira"],
        rows_index,
        [52, 134],
        size=7.5,
    )


def build(db_path: Path, out_path: Path) -> dict:
    generated = fecha_generacion(datetime.now(ZoneInfo("America/Mexico_City")))
    with connect_readonly(db_path) as conn:
        data = load(conn)
    sanity(data)
    pdf = Report(find_fonts())
    write_cover(pdf, data, generated, db_path.resolve())
    write_dictionary(pdf, data)
    write_meta(pdf, data)
    write_coverage(pdf, data)
    write_roster(pdf, data)
    write_catalog(pdf, data)
    write_single_select(pdf, data)
    write_likert(pdf, data)
    write_rankings(pdf, data)
    write_costs(pdf, data)
    write_index(pdf)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(out_path))
    data["pages"] = pdf.page
    data["index_page"] = pdf.index_page
    data["generated"] = generated
    return data


def main() -> None:
    db_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else DB_PATH
    out_path = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else OUT_PATH
    if not db_path.is_file():
        raise SystemExit(f"No está la base: {db_path}")
    data = build(db_path, out_path)
    size_kb = out_path.stat().st_size / 1024
    zero_ids = ",".join(row["question_id"] for row in data["zero_row_questions"])
    print(out_path)
    print(f"pages={data['pages']}")
    print(f"size_kb={size_kb:.1f}")
    print(
        "coverage "
        f"respondents={data['n_roster']} "
        f"answer_rows={data['n_answers']} "
        f"rank_rows={data['n_rank_rows']} "
        f"empty_questions={data['empty_applicable']}"
    )
    print(
        "catalog_questions_with_zero_rows="
        f"{len(data['zero_row_questions'])} ids={zero_ids}"
    )
    print(f"rank_cost_rows={data['n_costs']}")
    print(f"index_starts_at_page={data['index_page']}")
    if data["index_page"] is not None and data["pages"] != data["index_page"]:
        print(
            "INDEX_PAGE_SPILL "
            f"index_page={data['index_page']} last_page={data['pages']}"
        )


if __name__ == "__main__":
    main()
