import { renderToStaticMarkup } from 'react-dom/server';
import type { ImgHTMLAttributes } from 'react';
import Home from '../../src/app/page';

jest.mock('next/image', () => {
  return function MockImage(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <span data-testid="mock-next-image">{props.alt ?? ''}</span>;
  };
});

describe('home page', () => {
  it('renders key starter content', () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain('To get started, edit the page.tsx file.');
    expect(html).toContain('Templates');
    expect(html).toContain('Documentation');
  });
});
