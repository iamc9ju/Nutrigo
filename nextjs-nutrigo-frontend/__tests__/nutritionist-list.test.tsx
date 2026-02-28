import { render, screen } from '@testing-library/react';
import NutritionistList from '@/components/NutritionistList';

describe('NutritionistList Component', () => {
    it('renders section title correctly', () => {
        render(<NutritionistList />);
        expect(screen.getByText(/พบกับนักโภชนาการของเรา/i)).toBeInTheDocument();
    });

    it('renders the static list of nutritionists', () => {
        render(<NutritionistList />);
        expect(screen.getByText(/ดร. Sarah Jenkins/i)).toBeInTheDocument();
        expect(screen.getByText(/นักโภชนาการการกีฬา/i)).toBeInTheDocument();

        expect(screen.getByText(/ดร. Rella Dhooks/i)).toBeInTheDocument();
    });

    it('renders CTA button', () => {
        render(<NutritionistList />);
        expect(screen.getByRole('button', { name: /ดูนักโภชนาการทั้งหมด/i })).toBeInTheDocument();
    });
});
