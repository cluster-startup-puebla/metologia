#!/usr/bin/env python3
"""Turn the v2 markdown instruments into question JSON. No scores are computed."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "metodologia" / "v2"
OUT = ROOT / "content" / "methodology" / "v2"

FILES = {
    "agricola-pecuaria": "instrumento-nivel-2-agricola-pecuaria-puebla-tlaxcala-v5.md",
    "alimentos": "instrumento-nivel-2-alimentos-procesados-puebla-tlaxcala-v.md",
    "agencias": "instrumento-nivel-2-agencias-viajes-operadores-puebla-tlax.md",
    "artes-graficas": "instrumento-nivel-2-artes-graficas-puebla-tlaxcala-v5.md",
    "automotriz": "instrumento-nivel-2-automotriz-puebla-tlaxcala-v5.md",
    "confeccion": "instrumento-nivel-2-confeccion-maquila-puebla-tlaxcala-v5.md",
    "construccion": "instrumento-nivel-2-construccion-puebla-tlaxcala-v5.md",
    "dispositivos": "instrumento-nivel-2-dispositivos-medicos-puebla-tlaxcala-v.md",
    "gastronomia": "instrumento-nivel-2-gastronomia-catering-puebla-tlaxcala-v.md",
    "logistica": "instrumento-nivel-2-logistica-puebla-tlaxcala-v5.md",
    "medico-hospitalario": "instrumento-nivel-2-medico-hospitalario-puebla-tlaxcala-v5.md",
    "metalmecanica": "instrumento-nivel-2-metalmecanica-estructuras-puebla-tlaxc.md",
    "muebles": "instrumento-nivel-2-muebles-puebla-tlaxcala-v5.md",
    "plasticos": "instrumento-nivel-2-plasticos-puebla-tlaxcala-v5.md",
    "textiles": "instrumento-nivel-2-textiles-hilados-puebla-tlaxcala-v5.md",
    "turismo": "instrumento-nivel-2-turismo-puebla-tlaxcala-v5.md",
    "quimica": "instrumento-nivel-2-quimica-petroquimica-puebla-tlaxcala-v.md",
    "tics": "instrumento-nivel-2-tics-software-puebla-tlaxcala-v5.md",
}

GROUPS = [
    {"id": "automotriz", "label": "Automotriz, autopartes y electromovilidad", "instruments": ["automotriz"]},
    {"id": "agro", "label": "Agro", "instruments": ["agricola-pecuaria", "alimentos"]},
    {"id": "plasticos", "label": "Plásticos, polímeros y economía circular", "instruments": ["plasticos"]},
    {"id": "metalmecanica", "label": "Metalmecánica, estructuras y maquinados", "instruments": ["metalmecanica"]},
    {"id": "textil", "label": "Textil", "instruments": ["textiles", "confeccion"]},
    {"id": "muebles", "label": "Muebles, madera y herrajes", "instruments": ["muebles"]},
    {"id": "turismo", "label": "Turismo", "instruments": ["turismo", "agencias", "gastronomia"]},
    {"id": "salud", "label": "Salud", "instruments": ["medico-hospitalario", "dispositivos"]},
    {"id": "construccion", "label": "Construcción, obra civil y materiales", "instruments": ["construccion"]},
    {"id": "logistica", "label": "Logística, transporte y última milla", "instruments": ["logistica"]},
    {"id": "artes-graficas", "label": "Artes gráficas, impresión y empaques", "instruments": ["artes-graficas"]},
    {"id": "quimica", "label": "Industria química, petroquímica y resinas sintéticas", "instruments": ["quimica"]},
    {"id": "tics", "label": "Tecnologías de la información, software y servicios digitales", "instruments": ["tics"]},
]

QUESTION_START = re.compile(r"^\*\*\[(.+?)\]\s*(.*?)\*\*")
WIDGET = re.compile(r"\*\((.*)\)\*")
PROMPT = re.compile(r"Pregunta de Evaluación:\s*(.+)", re.I)
MICRO = re.compile(r"Micro-copy\s*/\s*Guía Técnica:\s*(.+)", re.I)
SECTION = re.compile(r"^\*\*(MÓDULO|SECCIÓN)\b", re.I)
OPTION = re.compile(r"^\(\s*\)\s*(.+)")
FACTOR = re.compile(r"^\[\s*\]\s*(.+)")
CHECK_AND_FACTOR = re.compile(r"^\(\s*\)\s*\[\s*\]\s*(.+)")
SCORE = re.compile(r"\((\d+)\s*pts?\)", re.I)
POINT = re.compile(r"^(\d+)\s*Points?\b", re.I)
POINT_PREFIX = re.compile(r"^\d+\s+Points?\s*\(\d+\s*pts\):\s*", re.I)
FREE_MARK = re.compile(r"\[\s*Input de Texto Libre\s*\]|_{5,}", re.I)
SCORE_NOTE = re.compile(
    r"\s*(?:\[Score:\s*(\d+(?:\.\d+)?)\s*pts?\]|\((\d+(?:\.\d+)?)\s*pts?\))",
    re.I,
)


def clean(value: str) -> str:
    value = (
        value.replace("\\|", "|")
        .replace("\\*", "*")
        .replace("\\[", "[")
        .replace("\\]", "]")
        .replace("\\'", "'")
        .replace("\\>", ">")
        .replace("\\$", "$")
    )
    value = value.replace("\\<", "<").replace("\\_", "_")
    value = re.sub(r"\\+$", "", value).strip()
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def content_lines(path: Path) -> list[str]:
    lines: list[str] = []
    for raw in path.read_text().splitlines():
        text = raw.strip()
        if not text or re.fullmatch(r"[+|=\-\s]+", text):
            continue
        if text.startswith("|"):
            text = text[1:]
            if text.endswith("|"):
                text = text[:-1]
        text = clean(text)
        if text:
            lines.append(text)
    return lines


def widget_of(header: str) -> str:
    match = WIDGET.search(header)
    return clean(match.group(1)) if match else "Tarjeta de Selección Única"


def title_of(header: str) -> str:
    title = WIDGET.sub("", header)
    return clean(title)


def present_label(label: str) -> tuple[str, bool]:
    free = bool(FREE_MARK.search(label))
    label = POINT_PREFIX.sub("", label).strip()
    if not free:
        return label, False
    if re.search(r"proyecto", label, re.I):
        return "Un proyecto propio", True
    return "Otro", True


def strip_score_note(label: str) -> tuple[str, int | None]:
    """Pull a written point value out of an answer and return the bare text."""
    found: list[int] = []

    def repl(match: re.Match[str]) -> str:
        raw = match.group(1) or match.group(2)
        found.append(int(round(float(raw))))
        return ""

    cleaned = SCORE_NOTE.sub(repl, label)
    cleaned = re.sub(r"\s+:", ":", cleaned)
    cleaned = re.sub(r"\s{2,}", " ", cleaned).strip()
    if len(set(found)) > 1:
        raise SystemExit(f"conflicting scores in answer: {label}")
    return cleaned, found[-1] if found else None


RUBRIC_HEAD = re.compile(
    r"^(Nivel \d+\s*-|Abandono Tecnológico|Subutilización|Leve Subutilización|Ninguno / Uso Pleno|Sin Planes de|Control (Manual|Reactivo|Moderado|Avanzado|Básico)|Pruebas Manuales|Pruebas Unitarias|Automatización de Pruebas|Excelencia en|Cero Defectos|Bitácora Manual|Trazabilidad )",
    re.I,
)


def drop_rubric_titles(options: list[dict]) -> None:
    """The heading before the colon is a judgment. The answer is the description."""
    split: list[tuple[str, str] | None] = []
    for option in options:
        label = option["label"]
        if ":" not in label:
            split.append(None)
            continue
        head, tail = label.split(":", 1)
        split.append((head.strip(), tail.strip()))
    if not any(parts and RUBRIC_HEAD.match(parts[0]) and len(parts[1]) >= 20 for parts in split):
        return
    for option, parts in zip(options, split):
        if parts and len(parts[1]) >= 20:
            option["label"] = parts[1]


def question_type(widget: str, options: list[dict], factors: list[dict]) -> str:
    if factors:
        return "rank"
    if "Likert" in widget:
        return "likert_5"
    if any(option.get("free") for option in options):
        return "single_select_text"
    return "single_select"


def parse_file(path: Path, level: str, sector_id: str | None) -> list[dict]:
    section = "Inicio"
    questions: list[dict] = []
    current: dict | None = None

    def flush() -> None:
        nonlocal current
        if not current:
            return
        options = current.pop("_options")
        factors = current.pop("_factors")
        if not options and not factors:
            current = None
            return
        widget = current["widget"]
        kind = question_type(widget, options, factors)
        current["type"] = kind
        current["prefilled"] = "Pre-poblado" in widget
        if kind == "rank":
            current["factorCount"] = len(factors)
            current["factors"] = factors
        else:
            drop_rubric_titles(options)
            current["options"] = options
        if kind == "single_select_text":
            text_option = next(option["value"] for option in options if option.get("free"))
            current["text"] = {"maxLength": 100, "optionValue": text_option}
        for option in options:
            option.pop("free", None)
        questions.append(current)
        current = None

    for line in content_lines(path):
        if SECTION.match(line):
            flush()
            section = clean(line.strip("*"))
            continue
        start = QUESTION_START.match(line)
        if start:
            flush()
            code = clean(start.group(1).split("/")[0])
            header = line
            current = {
                "id": code,
                "level": level,
                "sectorId": sector_id,
                "section": section,
                "widget": widget_of(header),
                "title": title_of(start.group(2) or code),
                "prompt": "",
                "microcopy": None,
                "_options": [],
                "_factors": [],
            }
            continue
        if not current:
            continue
        prompt = PROMPT.search(line)
        if prompt:
            current["prompt"] = clean(prompt.group(1)).strip("*").rstrip(":").strip()
            continue
        micro = MICRO.search(line)
        if micro:
            current["microcopy"] = clean(micro.group(1)).strip("*").strip()
            continue
        both = CHECK_AND_FACTOR.match(line)
        if both:
            label, _score = strip_score_note(clean(both.group(1)))
            index = len(current["_factors"]) + 1
            current["_factors"].append({"id": f"f{index}", "label": label})
            continue
        option = OPTION.match(line)
        if option:
            raw_label = clean(option.group(1))
            point = POINT.match(raw_label)
            scored = SCORE.search(raw_label)
            likert_score = int(scored.group(1)) if point and scored else None
            label, free = present_label(raw_label)
            label, noted = strip_score_note(label)
            if likert_score is not None and noted is not None and likert_score != noted:
                raise SystemExit(f"score mismatch in {current['id']}: {raw_label}")
            score = likert_score if likert_score is not None else noted
            index = len(current["_options"]) + 1
            current["_options"].append({"value": f"opt{index}", "label": label, "score": score, "free": free})
            continue
        factor = FACTOR.match(line)
        if factor:
            label, _score = strip_score_note(clean(factor.group(1)))
            if label.lower().startswith("input de texto"):
                continue
            index = len(current["_factors"]) + 1
            current["_factors"].append({"id": f"f{index}", "label": label})
    flush()
    return questions


def parse_roadmap(path: Path) -> list[dict]:
    text = path.read_text()
    start = text.upper().find("NIVEL 1")
    end = text.upper().find("ACTA DE")
    if start < 0:
        raise SystemExit(f"{path.name} has no level table")
    chunk = text[start : end if end > start else None]
    bands = ("PLATINO", "ORO", "PLATA", "BRONCE")
    found: dict[str, dict] = {band: {"actions": [], "cut": None} for band in bands}
    current: str | None = None
    cut_pattern = re.compile(r"(ISMS\s*>=\s*[\d.]+|[\d.]+\s*<=\s*ISMS\s*<\s*[\d.]+|ISMS\s*<\s*[\d.]+)")
    for raw in chunk.splitlines():
        line = raw.replace("\\", "")
        for band in bands:
            if re.search(rf"\b{band}\b", line):
                current = band
                break
        if current is None:
            continue
        cut = cut_pattern.search(line)
        if cut and found[current]["cut"] is None:
            found[current]["cut"] = re.sub(r"\s+", "", cut.group(1))
        if "•" not in line:
            continue
        action = re.sub(r"\s+", " ", line.split("•", 1)[1]).strip(" *")
        if not action or action.startswith("(") or "Sección IV" in action:
            continue
        found[current]["actions"].append(action)

    steps = []
    for band in bands:
        cut = found[band]["cut"]
        actions = found[band]["actions"]
        if not cut or not actions:
            raise SystemExit(f"{path.name} {band} missing cut or actions ({cut}, {len(actions)})")
        upper = re.fullmatch(r"ISMS>=([\d.]+)", cut)
        middle = re.fullmatch(r"([\d.]+)<=ISMS<([\d.]+)", cut)
        lower = re.fullmatch(r"ISMS<([\d.]+)", cut)
        if upper:
            minimum, maximum = float(upper.group(1)), None
        elif middle:
            minimum, maximum = float(middle.group(1)), float(middle.group(2))
        elif lower:
            minimum, maximum = 0.0, float(lower.group(1))
        else:
            raise SystemExit(f"{path.name} unreadable cut {cut}")
        steps.append({"band": band.lower(), "min": minimum, "max": maximum, "actions": actions})
    return steps


def main() -> None:
    n1 = parse_file(SRC / "instrumento-diagnostico-regional-web-v8.md", "n1", None)
    if not n1:
        raise SystemExit("Nivel 1 produced no questions")
    sector_question = next(question for question in n1 if question["id"] == "MOD0-WEB-01")
    labels = [option["label"] for option in sector_question["options"]]
    if len(labels) != 16:
        raise SystemExit(f"expected 16 sectors, got {len(labels)}: {labels}")

    order = [
        "automotriz",
        "agricola-pecuaria",
        "alimentos",
        "plasticos",
        "metalmecanica",
        "textiles",
        "confeccion",
        "muebles",
        "turismo",
        "agencias",
        "gastronomia",
        "medico-hospitalario",
        "dispositivos",
        "construccion",
        "logistica",
        "artes-graficas",
    ]
    for option, sector_id in zip(sector_question["options"], order):
        option["value"] = sector_id
    existing_values = {option["value"] for option in sector_question["options"]}
    if "quimica" not in existing_values:
        sector_question["options"].append(
            {"value": "quimica", "label": "17. Industria Química, Petroquímica y Resinas Sintéticas", "score": None}
        )
    if "tics" not in existing_values:
        sector_question["options"].append(
            {"value": "tics", "label": "18. Tecnologías de la Información, Software y Servicios Digitales", "score": None}
        )

    instruments = []
    n2_dir = OUT / "n2"
    n2_dir.mkdir(parents=True, exist_ok=True)
    for sector_id, filename in FILES.items():
        questions = parse_file(SRC / filename, "n2", sector_id)
        if len(questions) < 8:
            raise SystemExit(f"{sector_id} only parsed {len(questions)} questions")
        label = next(option["label"] for option in sector_question["options"] if option["value"] == sector_id)
        roadmap = parse_roadmap(SRC / filename)
        document = {"sectorId": sector_id, "label": label, "questions": questions, "roadmap": roadmap}
        (n2_dir / f"{sector_id}.json").write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
        instruments.append({"id": sector_id, "label": label, "questionCount": len(questions), "file": f"n2/{sector_id}.json"})
        print(f"{sector_id:22} {len(questions):3}  ranks={sum(1 for q in questions if q['type']=='rank')} text={sum(1 for q in questions if q['type']=='single_select_text')}")

    (OUT / "n1.json").write_text(json.dumps({"instrument": "n1", "questions": n1}, ensure_ascii=False, indent=2) + "\n")
    index = {
        "instrumentVersion": "n1-web-8.0",
        "region": "puebla-tlaxcala",
        "generatedFrom": "docs/metodologia/v2",
        "scoring": None,
        "sectorQuestionId": "MOD0-WEB-01",
        "counts": {"n1": len(n1), "n2": sum(item["questionCount"] for item in instruments)},
        "groups": GROUPS,
        "instruments": instruments,
    }
    (OUT / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n")
    print(f"n1={len(n1)} types={sorted({q['type'] for q in n1})}")


if __name__ == "__main__":
    main()
