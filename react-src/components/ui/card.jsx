import React from 'react';
export function Card({ as: Component = 'article', className = '', ...props }) {
  return <Component className={`im-ui-card ${className}`.trim()} {...props} />;
}
