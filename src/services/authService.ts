import type { User } from '@/src/types';
import { mockUser } from '@/src/constants/mockData';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    await delay(1000);
    // Backend will call SMS provider here
    return { success: true, message: `OTP sent to ${phone}` };
  },

  async verifyOtp(phone: string, otp: string): Promise<{ user: User; token: string }> {
    await delay(1200);
    // Backend will verify OTP here
    const user: User = { ...mockUser, phone };
    return { user, token: `mock_token_${Date.now()}` };
  },

  async resendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    await delay(800);
    return { success: true, message: `OTP resent to ${phone}` };
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await delay(800);
    return { ...mockUser, ...data, id: userId };
  },

  async logout(): Promise<void> {
    await delay(300);
  },
};
