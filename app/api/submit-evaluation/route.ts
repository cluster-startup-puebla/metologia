import { NextResponse } from 'next/server'

// POST /api/submit-evaluation
// Placeholder endpoint para guardar resultados
// TODO: Conectar con base de datos en segunda etapa

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { answers, results, timestamp } = body
    
    // Validación básica
    if (!answers || !results) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // TODO: Guardar en base de datos
    // Ejemplo de estructura que se recibirá:
    // {
    //   answers: { 1: "b", 2: "c", ..., 16: { falta_materiales: 2, ... } },
    //   results: {
    //     sections: [...],
    //     totalScore: 54,
    //     maxScore: 108,
    //     category: "Plata",
    //     riesgo: "...",
    //     reto: "..."
    //   },
    //   timestamp: "2025-01-15T..."
    // }

    console.log('Evaluation submitted:', {
      timestamp,
      totalScore: results.totalScore,
      category: results.category,
      answersCount: Object.keys(answers).length,
    })

    return NextResponse.json({
      success: true,
      message: 'Evaluación guardada correctamente',
      id: `eval_${Date.now()}`, // Placeholder ID
    })
  } catch (error) {
    console.error('Error processing evaluation:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
