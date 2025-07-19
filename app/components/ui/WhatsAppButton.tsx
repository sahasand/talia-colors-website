'use client';

interface WhatsAppButtonProps {
  className?: string;
  children: React.ReactNode;
  message: string;
  phoneNumber: string;
}

export default function WhatsAppButton({ className, children, message, phoneNumber }: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}