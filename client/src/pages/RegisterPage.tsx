/**
 * Página de registro de nuevos usuarios.
 * Diseño de dos paneles similar a LoginPage.
 * Incluye medidor de fortaleza de contraseña reactivo.
 *
 * Comportamiento:
 * - Valida nombre, email, contraseña, confirmación y aceptación de términos.
 * - Muestra PasswordStrengthMeter reactivo al escribir la contraseña.
 * - Tras el registro exitoso redirige a /login con un toast de éxito.
 */

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/branding/Logo';
import { DecorativeBlobs } from '@/components/branding/DecorativeBlobs';
import { GridPattern } from '@/components/branding/GridPattern';
import { FormInput } from '@/components/form/FormInput';
import { PasswordInput } from '@/components/form/PasswordInput';
import { Checkbox } from '@/components/form/Checkbox';
import { PasswordStrengthMeter } from '@/components/form/PasswordStrengthMeter';
import { Spinner } from '@/components/feedback/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { isValidEmail, scorePassword, minLength } from '@/lib/validation';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
}

const PANEL_FEATURES = [
  'Crea y comparte desafíos con la comunidad',
  'Accede a cientos de problemas algorítmicos',
  'Rastrea tu progreso con estadísticas detalladas',
  'Aprende de las soluciones de otros desarrolladores',
];

export default function RegisterPage() {
  useDocumentTitle('Crear cuenta');
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const strengthScore = scorePassword(password);

  /**
   * Valida todos los campos del formulario de registro.
   * @returns true si todos los campos cumplen las reglas.
   */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!minLength(name, 2)) newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    if (!isValidEmail(email)) newErrors.email = 'Ingresa un correo electrónico válido';
    if (password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    if (password !== confirm) newErrors.confirm = 'Las contraseñas no coinciden';
    if (!terms) newErrors.terms = 'Debes aceptar los términos y condiciones';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario de registro.
   * Valida, llama al servicio y redirige al login con toast.
   *
   * @param e - Evento de submit del formulario.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      showToast('¡Cuenta creada! Inicia sesión para continuar.', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al registrarse', 'error');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ===== PANEL IZQUIERDO (branding) — solo lg+ ===== */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-cta relative overflow-hidden flex-col justify-between p-12">
        <GridPattern className="opacity-10" />
        <DecorativeBlobs variant="auth" />

        <div className="relative z-10">
          <Logo size="lg" />
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Únete a la comunidad<br />ComplexityLab
          </h2>
          <p className="text-white/80 text-base leading-relaxed">
            Crea tu cuenta gratuita y empieza a mejorar tus habilidades hoy mismo.
          </p>

          <div className="space-y-3">
            {PANEL_FEATURES.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-white/90 text-sm">
                <CheckCircle2 size={16} className="shrink-0 text-white" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/60 text-xs">
          © {new Date().getFullYear()} ComplexityLab. Todos los derechos reservados.
        </p>
      </div>

      {/* ===== PANEL DERECHO (formulario) ===== */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-dark-900">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-2xl border border-zinc-200 dark:border-dark-600 p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Crear cuenta</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Rellena el formulario para registrarte gratuitamente.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <FormInput
                id="registerName"
                label="Nombre completo"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                error={errors.name}
                icon={<User size={16} />}
                placeholder="Tu nombre"
                autoComplete="name"
              />

              <FormInput
                id="registerEmail"
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                error={errors.email}
                icon={<Mail size={16} />}
                placeholder="correo@ejemplo.com"
                autoComplete="email"
              />

              <div>
                <PasswordInput
                  id="registerPassword"
                  label="Contraseña"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  error={errors.password}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                />
                {password.length > 0 && (
                  <div className="mt-2">
                    <PasswordStrengthMeter score={strengthScore} />
                  </div>
                )}
              </div>

              <PasswordInput
                id="registerConfirm"
                label="Confirmar contraseña"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: undefined })); }}
                error={errors.confirm}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
              />

              <Checkbox
                id="acceptTerms"
                checked={terms}
                onChange={(e) => { setTerms(e.target.checked); setErrors((p) => ({ ...p, terms: undefined })); }}
                error={errors.terms}
                label={
                  <>
                    Acepto los{' '}
                    <a href="#" className="text-primary-400 hover:underline">Términos de Servicio</a>
                    {' '}y la{' '}
                    <a href="#" className="text-primary-400 hover:underline">Política de Privacidad</a>
                  </>
                }
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-primary hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? <Spinner size={18} /> : <ArrowRight size={18} />}
                {loading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
              </button>
            </form>

            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
