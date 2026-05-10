/**
 * Componente de esferas decorativas difusas (blobs) que aparecen detrás
 * de secciones clave como el hero, autenticación y CTA.
 * Puramente visual; usa filter: blur() para el efecto glassmorphism de fondo.
 *
 * Props:
 * - variant: selecciona el conjunto de blobs para cada sección.
 */

export type BlobVariant = 'hero' | 'auth' | 'pageHeader' | 'cta';

interface DecorativeBlobsProps {
  variant?: BlobVariant;
}

export function DecorativeBlobs({ variant = 'hero' }: DecorativeBlobsProps) {
  if (variant === 'hero') {
    return (
      <>
        <div
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'rgba(99, 102, 241, 0.12)', filter: 'blur(120px)' }}
        />
        <div
          className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'rgba(16, 185, 129, 0.08)', filter: 'blur(100px)' }}
        />
      </>
    );
  }

  if (variant === 'auth') {
    return (
      <>
        <div
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'rgba(99, 102, 241, 0.15)', filter: 'blur(120px)' }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'rgba(16, 185, 129, 0.1)', filter: 'blur(100px)' }}
        />
      </>
    );
  }

  if (variant === 'pageHeader') {
    return (
      <>
        <div
          className="absolute top-[-20%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'rgba(99, 102, 241, 0.08)', filter: 'blur(120px)' }}
        />
        <div
          className="absolute bottom-[-20%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'rgba(16, 185, 129, 0.06)', filter: 'blur(100px)' }}
        />
      </>
    );
  }

  // cta
  return null;
}
