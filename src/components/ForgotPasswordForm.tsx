import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Mot de passe oublié</h2>
      <Input
        type="email"
        placeholder="Votre adresse email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading || !email} className="w-full">
        {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
      </Button>
      {success && (
        <Alert variant="success">
          Un email de réinitialisation a été envoyé si l’adresse existe.
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}
    </form>
  )
} 