import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type { AttendanceReward, AttendanceToday } from '../types/attendance';
import { trackEvent } from '../lib/analytics';

//오늘의 보상 수령
export const claimAttendanceReword = async () => {
  const { data } = await api.post<ApiResponse<AttendanceReward>>(
    '/api/v1/attendance-rewards'
  );
  if (data.isSuccess && data.result?.newlyClaimed) {
    trackEvent('attendance_check', {
      reward_amount: data.result.grantedAmount,
    });
  }
  return data.result;
};

//오늘의 보상 수령 여부 조회
export const getAttendanceToday = async () => {
  const { data } = await api.get<ApiResponse<AttendanceToday>>(
    '/api/v1/attendance-rewards/today'
  );
  return data.result;
};
