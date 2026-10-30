import { createClient } from '@/lib/supabase/client'
import type { EvaluationResult } from './evaluation-calculator'

export interface ResponseRecord {
  device_id: string
  question_id: string
  section_id: string
  answer_value: number | Record<string, number>
}

export interface ResultRecord {
  device_id: string
  total_score: number
  section_scores: unknown
  maturity_level: string
}

// Guarda o actualiza una respuesta individual en tiempo real
export async function saveResponse(response: ResponseRecord): Promise<boolean> {
  const supabase = createClient()
  
  // Primero eliminamos respuesta previa de la misma pregunta/dispositivo
  await supabase
    .from('evaluation_responses')
    .delete()
    .eq('device_id', response.device_id)
    .eq('question_id', response.question_id)
  
  // Insertamos la nueva respuesta
  const { error } = await supabase
    .from('evaluation_responses')
    .insert({
      device_id: response.device_id,
      question_id: response.question_id,
      section_id: response.section_id,
      answer_value: response.answer_value
    })
  
  if (error) {
    console.error('Error saving response:', error)
    return false
  }
  
  return true
}

// Guarda el resultado final
export async function saveResult(result: ResultRecord): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('evaluation_results')
    .upsert({
      device_id: result.device_id,
      total_score: result.total_score,
      section_scores: result.section_scores,
      maturity_level: result.maturity_level
    }, {
      onConflict: 'device_id'
    })
  
  if (error) {
    console.error('Error saving result:', error)
    return false
  }
  
  return true
}

// Obtiene estadísticas agregadas para /stash
export async function getResponseStats() {
  const supabase = createClient()
  
  // Total de participantes únicos
  const { data: participants, error: participantsError } = await supabase
    .from('evaluation_responses')
    .select('device_id')
  
  const uniqueParticipants = new Set(participants?.map(p => p.device_id) || []).size
  
  // Respuestas por pregunta
  const { data: responses, error: responsesError } = await supabase
    .from('evaluation_responses')
    .select('device_id, question_id, section_id, answer_value')
  
  // Resultados completados
  const { data: results, error: resultsError } = await supabase
    .from('evaluation_results')
    .select('*')
  
  if (participantsError || responsesError || resultsError) {
    console.error('Error fetching stats:', participantsError || responsesError || resultsError)
  }
  
  return {
    uniqueParticipants,
    responses: responses || [],
    results: results || []
  }
}

// Obtiene distribución de respuestas por pregunta
export async function getQuestionDistribution(questionId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('evaluation_responses')
    .select('answer_value')
    .eq('question_id', questionId)
  
  if (error) {
    console.error('Error fetching distribution:', error)
    return []
  }
  
  return data || []
}

// Guarda el correo de un participante para análisis detallado
export async function saveEmailLead(deviceId: string, email: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('evaluation_leads')
    .upsert({ device_id: deviceId, email }, { onConflict: 'device_id' })

  if (error) {
    console.error('Error saving email lead:', error)
    return false
  }

  return true
}

// Suscripción en tiempo real a nuevas respuestas
export function subscribeToResponses(callback: (payload: unknown) => void) {
  const supabase = createClient()
  
  const channel = supabase
    .channel('evaluation_responses_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'evaluation_responses'
      },
      callback
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}

// Suscripción en tiempo real a nuevos resultados
export function subscribeToResults(callback: (payload: unknown) => void) {
  const supabase = createClient()
  
  const channel = supabase
    .channel('evaluation_results_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'evaluation_results'
      },
      callback
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}
