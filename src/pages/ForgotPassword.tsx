import ForgotPasswordForm from '@/components/ForgotPasswordForm'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <button
        onClick={() => navigate('/login')}
        className="absolute left-4 top-4 flex items-center gap-2 text-primary hover:underline"
        aria-label="Retour à la connexion"
      >
        <ArrowLeft className="h-5 w-5" />
        Retour
      </button>
      <ForgotPasswordForm />
    </div>
  )
} 