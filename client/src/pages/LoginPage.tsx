/**
 * Página de inicio de sesión.
 * Diseño de dos paneles: izquierdo con branding/características, derecho con el formulario.
 * En pantallas pequeñas (<lg) solo se muestra el formulario.
 *
 * Comportamiento:
 * - Valida email y contraseña antes de llamar al servicio de auth.
 * - Muestra un spinner en el botón durante la llamada.
 * - Si hay un state.from guardado por RouteGuard, redirige allí tras el login.
 * - Muestra un toast de error si las credenciales son inválidas.
 */

import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/branding/Logo';
import { DecorativeBlobs } from '@/components/branding/DecorativeBlobs';
import { GridPattern } from '@/components/branding/GridPattern';
import { FormInput } from '@/components/form/FormInput';
import { PasswordInput } from '@/components/form/PasswordInput';
import { Checkbox } from '@/components/form/Checkbox';
import { Spinner } from '@/components/feedback/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';


interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  useDocumentTitle('Iniciar sesión');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * Valida los campos del formulario localmente.
   * @returns true si todos los campos son válidos.
   */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) newErrors.email = 'Ingresa tu nombre de usuario';
    if (password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario de login.
   * Valida, llama al servicio de auth y navega tras el éxito.
   *
   * @param e - Evento de submit del formulario.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login({ email: email.trim(), password });
      const from = (location.state as { from?: string })?.from ?? '/dashboard';
      navigate(from, { replace: true });
      showToast('¡Bienvenido de vuelta!', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al iniciar sesión', 'error');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ===== PANEL IZQUIERDO (branding) — solo lg+ ===== */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-cta relative overflow-hidden flex-col justify-between p-12">
        <GridPattern className="opacity-10" />
        <DecorativeBlobs variant="auth" />

        <div className="relative z-10">
          <Logo size="lg" className="[&>span]:text-white [&_span]:text-white" />
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Bienvenido de vuelta a<br />ComplexityLab
          </h2>
          <p className="text-white/80 text-base leading-relaxed">
            Accede a tu cuenta y continúa mejorando tus habilidades de programación.
          </p>

          <div className="space-y-3">
            {[
              'Accede a todos los desafíos disponibles',
              'Revisa tu progreso y estadísticas',
              'Gestiona los desafíos que has creado',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-white/90 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-xs">
            © {new Date().getFullYear()} ComplexityLab. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* ===== PANEL DERECHO (formulario) ===== */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-dark-900">
        <div className="w-full max-w-md">
          {/* Logo solo en mobile */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-2xl border border-zinc-200 dark:border-dark-600 p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Iniciar sesión</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Ingresa tus credenciales para acceder a tu cuenta.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <FormInput
                id="loginEmail"
                label="Nombre de Usuario"
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                error={errors.email}
                icon={<Mail size={16} />}
                placeholder="Tu nombre de usuario"
                autoComplete="username"
              />

              <PasswordInput
                id="loginPassword"
                label="Contraseña"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                error={errors.password}
                placeholder="Mínimo 6 caracteres"
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <Checkbox
                  id="rememberMe"
                  label="Recordarme"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <a href="#" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-primary hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? <Spinner size={18} /> : <ArrowRight size={18} />}
                {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
              </button>
            </form>

            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
