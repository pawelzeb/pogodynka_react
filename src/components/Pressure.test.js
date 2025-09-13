import { render, screen } from '@testing-library/react';
import Pressure from '../../pogodynka_react/src/components/Pressure';

test('Pressure test', () => {
  render(<Pressure pressure={1028}/>);
  const linkElement = screen.getByText(/1028 mBar/i);
  expect(linkElement).toBeInTheDocument();
});
