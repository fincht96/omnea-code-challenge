import { Typography, Box } from '@mui/material';
import { memo } from 'react';

const NoteContainer = ({ text, id }: { text: string; id: string }) => {
  return (
    <Box p={'0.5rem 1rem'} border={'solid 1px #cccccc'} borderRadius={'5px'}>
      <Typography
        variant="body1"
        fontWeight={'bold'}
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        id: {id}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default memo(NoteContainer);
