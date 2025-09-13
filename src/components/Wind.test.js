import { render, screen } from '@testing-library/react';
import Wind from '../../pogodynka_react/src/components/Wind';

test('Wind value', () => {
  render(<Wind speed={10} deg={20} />);
  const linkElement = screen.getByText(/10 m\/s/i);
  expect(linkElement).toBeInTheDocument();
});
