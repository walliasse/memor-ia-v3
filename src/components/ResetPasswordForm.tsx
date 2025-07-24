import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-20">
      <h2 className="text-xl font-bold mb-2">Nouveau mot de passe</h2>
      <Input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading || !password} className="w-full">
        {loading ? 'Mise à jour...' : 'Changer le mot de passe'}
      </Button>
      {success && (
        <Alert variant="success">
          Mot de passe mis à jour ! Vous pouvez vous reconnecter.
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