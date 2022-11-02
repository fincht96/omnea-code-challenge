import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, TextField, Typography, Stack } from '@mui/material';

type Inputs = {
  note: string;
};

const AddNoteForm = ({
  onFormSubmit,
  disabled = false,
}: {
  onFormSubmit: (note: string) => void;
  disabled?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onFormSubmit(data.note);
    reset({ note: '' });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={'row'} spacing={'1rem'}>
          <TextField
            {...register('note', {
              required: {
                value: true,
                message: 'This field is required',
              },
              maxLength: {
                value: 180,
                message:
                  'Ensure field contains less than or equal to 180 characters.',
              },
            })}
            sx={{ flex: 1 }}
            inputProps={{
              style: {
                padding: '0.5rem',
              },
            }}
            autoComplete="off"
            error={!!errors.note}
          />

          <Button type="submit" variant={'outlined'} disabled={disabled}>
            Add
          </Button>
        </Stack>
      </form>

      <Typography
        visibility={errors.note ? 'visible' : 'hidden'}
        color="#d32f2f"
      >
        {errors.note?.message ?? <>&nbsp;</>}
      </Typography>
    </>
  );
};

export default AddNoteForm;
