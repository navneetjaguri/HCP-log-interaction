import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InteractionFormState {
  hcp_name: string;
  interaction_type: string;
  date: string;
  time: string;
  attendees: string;
  topics_discussed: string;
  materials_shared: string;
  samples_distributed: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  outcomes: string;
  follow_up_actions: string;
}

const initialState: InteractionFormState = {
  hcp_name: '',
  interaction_type: 'Meeting',
  date: '',
  time: '',
  attendees: '',
  topics_discussed: '',
  materials_shared: '',
  samples_distributed: '',
  sentiment: 'Neutral',
  outcomes: '',
  follow_up_actions: '',
};

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ field: keyof InteractionFormState; value: any }>) => {
      const { field, value } = action.payload;
      (state as any)[field] = value;
    },
    updateForm: (state, action: PayloadAction<Partial<InteractionFormState>>) => {
      return { ...state, ...action.payload };
    },
    resetForm: (state) => initialState,
  },
});

export const { updateField, updateForm, resetForm } = interactionSlice.actions;
export default interactionSlice.reducer;
