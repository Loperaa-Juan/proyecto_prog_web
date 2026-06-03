/**
 * Página de formulario para crear o editar un desafío.
 * Se usa para ambas rutas: /challenges/new y /challenges/:id/edit.
 * Detecta el modo (crear/editar) leyendo el parámetro :id de la URL.
 *
 * Comportamiento:
 * - En modo editar: carga los datos del desafío por ID y pre-rellena el formulario.
 * - Contadores de caracteres para título (max 80) y descripción (max 600).
 * - TagInput para etiquetas (max 5, Enter o coma para agregar).
 * - Tras el submit exitoso: toast + redirige al dashboard.
 */

import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Save, ArrowRight } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { Textarea } from '@/components/form/Textarea';
import { Select } from '@/components/form/Select';
import { TagInput } from '@/components/form/TagInput';
import { Spinner } from '@/components/feedback/Spinner';
import { useToast } from '@/hooks/useToast';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { minLength } from '@/lib/validation';
import * as challengeService from '@/services/challenges';
import type { ChallengeDifficulty, ChallengeCategory } from '@/types';

interface FormErrors {
  title?: string;
  description?: string;
  difficulty?: string;
}

const DIFFICULTY_OPTIONS = [
  { value: 'easy',   label: 'Fácil'  },
  { value: 'medium', label: 'Medio'  },
  { value: 'hard',   label: 'Difícil'},
];

const CATEGORY_OPTIONS = [
  { value: 'arrays',     label: 'Arreglos'        },
  { value: 'strings',    label: 'Cadenas'          },
  { value: 'linkedlist', label: 'Listas enlazadas' },
  { value: 'trees',      label: 'Árboles'          },
  { value: 'graphs',     label: 'Grafos'           },
  { value: 'dp',         label: 'Prog. Dinámica'   },
  { value: 'sorting',    label: 'Ordenamiento'     },
  { value: 'stacks',     label: 'Pilas'            },
];

export default function ChallengeFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  useDocumentTitle(isEdit ? 'Editar desafío' : 'Crear desafío');

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | ''>('');
  const [category, setCategory]     = useState<ChallengeCategory | ''>('arrays');
  const [tags, setTags]             = useState<string[]>([]);
  const [code, setCode]             = useState('');
  const [errors, setErrors]         = useState<FormErrors>({});
  const [loading, setLoading]       = useState(false);
  const [hydrating, setHydrating]   = useState(isEdit);

  // En modo edición: carga los datos del desafío existente
  useEffect(() => {
    if (!id) return;
    setHydrating(true);
    challengeService
      .getById(id)
      .then((c) => {
        setTitle(c.title);
        setDescription(c.description);
        setDifficulty(c.difficulty);
        setCategory(c.category);
        setTags(c.tags);
        setCode(c.codeTemplate ?? '');
      })
      .catch(() => {
        showToast('No se encontró el desafío', 'error');
        navigate('/dashboard');
      })
      .finally(() => setHydrating(false));
  }, [id, navigate, showToast]);

  /**
   * Valida los campos obligatorios del formulario.
   * @returns true si todos los campos cumplen las reglas.
   */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!minLength(title, 1)) newErrors.title = 'El título es obligatorio';
    if (!minLength(description, 20)) newErrors.description = 'La descripción debe tener al menos 20 caracteres';
    if (!difficulty) newErrors.difficulty = 'Selecciona una dificultad';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario: crea o actualiza el desafío.
   * Muestra un toast de éxito y redirige al dashboard.
   *
   * @param e - Evento de submit del formulario.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        difficulty: difficulty as ChallengeDifficulty,
        category: (category || 'arrays') as ChallengeCategory,
        tags,
        codeTemplate: code.trim() || undefined,
      };

      if (isEdit && id) {
        await challengeService.update(id, payload);
        showToast('Desafío actualizado correctamente', 'success');
      } else {
        await challengeService.create(payload);
        showToast('Desafío creado correctamente', 'success');
      }

      navigate('/dashboard');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al guardar', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (hydrating) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size={32} className="border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Migas de pan */}
      <nav className="flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 mb-8">
        <Link to="/dashboard" className="hover:text-primary-400 transition-colors">Dashboard</Link>
        <ChevronRight size={14} />
        <span className="text-zinc-700 dark:text-zinc-300 font-medium">
          {isEdit ? 'Editar desafío' : 'Crear desafío'}
        </span>
      </nav>

      <div className="bg-white dark:bg-dark-800 rounded-2xl border border-zinc-200 dark:border-dark-600 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
          {isEdit ? 'Editar desafío' : 'Crear nuevo desafío'}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          {isEdit
            ? 'Modifica los campos que necesitas actualizar.'
            : 'Completa el formulario para publicar tu desafío en la comunidad.'}
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Título */}
          <FormInput
            id="challengeTitle"
            label={`Título (${title.length}/80)`}
            type="text"
            value={title}
            maxLength={80}
            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
            error={errors.title}
            placeholder="Nombre descriptivo del desafío"
          />

          {/* Descripción */}
          <Textarea
            id="challengeDesc"
            label="Descripción"
            value={description}
            onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: undefined })); }}
            error={errors.description}
            maxLength={600}
            currentLength={description.length}
            placeholder="Describe el problema con claridad. Mínimo 20 caracteres."
            rows={5}
          />

          {/* Dificultad y Categoría en fila */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="challengeDiff"
              label="Dificultad *"
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value as ChallengeDifficulty); setErrors((p) => ({ ...p, difficulty: undefined })); }}
              options={DIFFICULTY_OPTIONS}
              placeholder="Selecciona…"
              error={errors.difficulty}
            />
            <Select
              id="challengeCat"
              label="Categoría"
              value={category}
              onChange={(e) => setCategory(e.target.value as ChallengeCategory)}
              options={CATEGORY_OPTIONS}
            />
          </div>

          {/* Etiquetas */}
          <TagInput
            label="Etiquetas"
            tags={tags}
            onChange={setTags}
            maxTags={5}
            placeholder="Agrega hasta 5 etiquetas…"
          />

          {/* Código de plantilla */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="challengeCode" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Plantilla de código <span className="text-zinc-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="challengeCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Escribe aquí la plantilla de código de inicio…"
              rows={7}
              className="w-full rounded-xl border border-zinc-200 dark:border-dark-500 px-4 py-3 text-sm font-mono text-zinc-900 dark:text-white bg-white dark:bg-dark-700 placeholder:text-zinc-400 outline-none focus:border-primary-500 resize-y transition-colors"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-dark-500 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-dark-700 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-primary hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? <Spinner size={16} /> : (isEdit ? <Save size={16} /> : <ArrowRight size={16} />)}
              {loading ? 'Guardando…' : (isEdit ? 'Guardar cambios' : 'Publicar desafío')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
