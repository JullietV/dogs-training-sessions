'use client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>

        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
          {children}
        </div>
      </div>
    </div>
  );
} 