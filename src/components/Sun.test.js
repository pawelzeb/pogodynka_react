import { render, screen } from '@testing-library/react';
import Sun from '../../pogodynka_react/src/components/Sun';

test('sunrise/sunset test', () => {
  let dt = 1757689200;
  render(<Sun sunrise={dt} sunset={dt} />);
  const date = new Date(dt * 1000);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const regex = new RegExp(`${hours}:${minutes}:${seconds}`, "i");
  const e1 = screen.getAllByText(regex);
  expect(e1[0]).toBeInTheDocument();
  expect(e1[1]).toBeInTheDocument();
});
