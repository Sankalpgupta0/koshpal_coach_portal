import { axiosInstance } from './axiosInstance.mjs';

/**
 * Create availability slots
 * POST /api/v1/coach/slots
 */
export const createSlots = async (date, timeSlots) => {
  const response = await axiosInstance.post('/coach/slots', {
    date,
    timeSlots,
  });
  return response.data;
};

/**
 * Get coach's slots
 * GET /api/v1/coach/slots
 */
export const getMySlots = async (date = null) => {
  const params = date ? { date } : {};
  const response = await axiosInstance.get('/coach/slots', { params });
  return response.data;
};

/**
 * Get coach's consultations
 * GET /api/v1/coach/consultations
 */
export const getMyConsultations = async (filter = null) => {
  const params = filter ? { filter } : {};
  const response = await axiosInstance.get('/coach/consultations', { params });
  return response.data;
};

/**
 * Get consultation statistics
 * GET /api/v1/coach/consultations/stats
 */
export const getConsultationStats = async () => {
  const response = await axiosInstance.get('/coach/consultations/stats');
  return response.data;
};

/**
 * Cancel a consultation
 * PATCH /api/v1/coach/consultations/:id/cancel
 */
export const cancelConsultation = async (consultationId, reason) => {
  const response = await axiosInstance.patch(
    `/coach/consultations/${consultationId}/cancel`,
    { reason }
  );
  return response.data;
};

/**
 * Complete a consultation
 * PATCH /api/v1/coach/consultations/:id/complete
 */
export const completeConsultation = async (consultationId) => {
  const response = await axiosInstance.patch(
    `/coach/consultations/${consultationId}/complete`
  );
  return response.data;
};

/**
 * Update consultation status
 * PATCH /api/v1/coach/consultations/:id/status
 */
export const updateConsultationStatus = async (consultationId, status) => {
  const response = await axiosInstance.patch(
    `/coach/consultations/${consultationId}/status`,
    { status }
  );
  return response.data;
};

/**
 * Save weekly availability
 * POST /api/v1/coach/slots
 */
export const saveWeeklyAvailability = async (weeklyData) => {
  const response = await axiosInstance.post('/coach/slots', weeklyData);
  return response.data;
};

/**
 * Get weekly schedule
 * GET /api/v1/coach/slots/weekly
 */
export const getWeeklySchedule = async (weeks = 1) => {
  const response = await axiosInstance.get('/coach/slots/weekly', {
    params: { weeks },
  });
  return response.data;
};

/**
 * Delete a slot
 * DELETE /api/v1/coach/slots/:id
 */
export const deleteSlot = async (slotId) => {
  const response = await axiosInstance.delete(`/coach/slots/${slotId}`);
  return response.data;
};

/**
 * Get coach profile
 * GET /api/v1/coach/profile
 */
export const getMyProfile = async () => {
  const response = await axiosInstance.get('/coach/profile');
  return response.data;
};

/**
 * Update coach profile
 * PATCH /api/v1/coach/profile
 */
export const updateMyProfile = async (profileData) => {
  const response = await axiosInstance.patch('/coach/profile', profileData);
  return response.data;
};

/**
 * Get earnings/payments data
 * GET /api/v1/coach/payments
 */
export const getPayments = async (params = {}) => {
  const response = await axiosInstance.get('/coach/payments', { params });
  return response.data;
};

/**
 * Get payment statistics
 * GET /api/v1/coach/payments/stats
 */
export const getPaymentStats = async () => {
  const response = await axiosInstance.get('/coach/payments/stats');
  return response.data;
};

/**
 * Generate invoice
 * POST /api/v1/coach/invoices
 */
export const generateInvoice = async (invoiceData) => {
  const response = await axiosInstance.post('/coach/invoices', invoiceData);
  return response.data;
};

/**
 * Get invoices
 * GET /api/v1/coach/invoices
 */
export const getInvoices = async (params = {}) => {
  const response = await axiosInstance.get('/coach/invoices', { params });
  return response.data;
};

/**
 * Get coach profile
 * GET /api/v1/coach/profile
 */
export const getCoachProfile = async () => {
  const response = await axiosInstance.get('/coach/profile');
  return response.data;
};

/**
 * Update coach timezone
 * PATCH /api/v1/coach/profile/timezone
 */
export const updateCoachTimezone = async (timezone) => {
  const response = await axiosInstance.patch('/coach/profile/timezone', {
    timezone,
  });
  return response.data;
};
