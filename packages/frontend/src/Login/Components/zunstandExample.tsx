//This is example code for how to use Zustand for state management using store and hooks in a React component.
import { User } from '../../../../shared-types/auth'
import { useAuthStore } from '../../store/useAuthStore'

export const Dashboard = () => {
  const user: User | null = useAuthStore((state) => state.user)
  const isExpired = useAuthStore((state) => state.isSessionExpired)

  if (!user || isExpired()) {
    return <p>ההתחברות פגה תוקף</p>
  }

  return (
    <div>
      <h1>שלום {user.firstName}</h1>
    </div>
  )
}
