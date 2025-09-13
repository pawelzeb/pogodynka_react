import { render, screen } from '@testing-library/react';
import City from '../../pogodynka_react/src/components/City';

test('City test', () => {
  render(<City
            city="Warsaw"
            temp="23"
            temp_min="22"
            temp_max="24"
            lat="52.2298"
            lon="21.0118"
            tm="0"
            text1="pogodnie"
            text2="czyste niebo"
            img="icon01"
          />);
  const e1 = screen.getByText(/lat: 52.2298°/i);
  const e2 = screen.getByText(/lon: 21.0118°/i);
  expect(e1).toBeInTheDocument();
  expect(e2).toBeInTheDocument();
});
