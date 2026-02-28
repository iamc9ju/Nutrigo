import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';

jest.mock('@/store/auth-store', () => ({
    useAuthStore: () => ({
        login: jest.fn().mockResolvedValue(true),
        error: null,
        isLoading: false,
    }),
}));

describe('Login Page', () => {
    it('renders login form correctly', () => {
        render(<LoginPage />);
        expect(screen.getByRole('heading', { name: /เข้าสู่ระบบ/i })).toBeInTheDocument();
    });

    it('shows validation errors when submitting empty form', async () => {
        render(<LoginPage />);
        fireEvent.click(screen.getByRole('button', { name: /เข้าสู่ระบบ/i }));

        await waitFor(() => {

            expect(screen.getByText(/กรุณากรอกอีเมล/i)).toBeInTheDocument();
            expect(screen.getByText(/กรุณากรอกรหัสผ่าน/i)).toBeInTheDocument();
        });
    });

    it('allows user to fill out the form', () => {
        render(<LoginPage />);
        const emailInput = screen.getByPlaceholderText(/you@example.com/i);
        const passwordInput = screen.getByPlaceholderText(/••••••••/i);

        fireEvent.change(emailInput, { target: { value: 'patient@hospital.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('patient@hospital.com');
        expect(passwordInput).toHaveValue('password123');
    });
});
