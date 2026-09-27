import React from 'react';
export function Input({ className = '', ...props }) {
  return <input data-slot="input" className={`im-ui-input ${className}`.trim()} {...props} />;
}
export function Textarea({ className = '', ...props }) {
  return <textarea data-slot="textarea" className={`im-ui-textarea ${className}`.trim()} {...props} />;
}
