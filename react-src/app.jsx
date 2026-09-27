import React from 'react';
import parse, { attributesToProps, domToReact } from 'html-react-parser';
import { Button } from './components/ui/button.jsx';
import { Card } from './components/ui/card.jsx';
import { Input, Textarea } from './components/ui/input.jsx';

function SiteBlock({ as: Component, ...props }) { return <Component {...props} />; }

const cardClasses = /(?:^|\s)(?:feed-card|member-directory-card|approved-card|review-card|imland-team-card)(?:\s|$)/;
const buttonClasses = /(?:^|\s)(?:menu|search-toggle|player-button|player-expand|player-close|contact-submit|review-toggle)(?:\s|$)/;

function renderMarkup(markup) {
  const options = {
    replace(node) {
      if (node.type !== 'tag') return;
      const props = attributesToProps(node.attribs || {});
      const children = domToReact(node.children || [], options);
      if (node.name === 'button' && buttonClasses.test(node.attribs?.class || '')) {
        return <Button {...props}>{children}</Button>;
      }
      if (node.name === 'a' && /(?:^|\s)button(?:\s|$)/.test(node.attribs?.class || '')) {
        return <Button asChild {...props}><a {...props}>{children}</a></Button>;
      }
      if (node.name === 'article' && cardClasses.test(node.attribs?.class || '')) {
        return <Card {...props}>{children}</Card>;
      }
      if (node.name === 'input' && !['hidden', 'checkbox', 'radio', 'range', 'file'].includes(node.attribs?.type || 'text')) {
        return <Input {...props} />;
      }
      if (node.name === 'textarea') return <Textarea {...props}>{children}</Textarea>;
      if (['header', 'main', 'section', 'footer'].includes(node.name)) {
        return <SiteBlock as={node.name} {...props}>{children}</SiteBlock>;
      }
    }
  };
  return parse(markup, options);
}

export function App({ markup }) { return <>{renderMarkup(markup)}</>; }
